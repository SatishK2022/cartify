import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/api-error";
import { CreateAddressInput, UpdateAddressInput, UpdateProfileInput } from "./user.validation";

export const getProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isVerified: true,
            phone: true,
            avatar: true
        }
    })

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    return user;
}

export const updateProfile = async (userId: string, payload: UpdateProfileInput) => {
    const { name, phone, avatar } = payload

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name,
            phone,
            avatar
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isVerified: true,
            phone: true,
            avatar: true
        }
    })

    return updatedUser
}

export const getAddresses = async (userId: string) => {
    const addresses = await prisma.address.findMany({
        where: {
            userId
        },
        orderBy: [
            {
                isDefault: "desc"
            },
            {
                createdAt: "desc"
            }
        ]
    })

    if (!addresses) {
        throw new ApiError(400, "Addresses not found");
    }

    return addresses
}

export const getAddress = async (userId: string, addressId: string) => {
    const address = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId
        }
    })

    if (!address) {
        throw new ApiError(400, "Address not found");
    }

    return address
}

export const createAddress = async (userId: string, payload: CreateAddressInput) => {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } = payload;

    const address = await prisma.$transaction(async (tx) => {
        const existingAddresses = await tx.address.count({
            where: {
                userId
            }
        });

        const shouldBeDefault = existingAddresses === 0 ? true : isDefault || false;

        if (shouldBeDefault) {
            await tx.address.updateMany({
                where: {
                    userId
                },
                data: {
                    isDefault: false
                }
            })
        }

        // create address
        return await tx.address.create({
            data: {
                fullName,
                phone,
                addressLine1,
                addressLine2,
                city,
                state,
                pincode,
                country,
                isDefault: shouldBeDefault,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    })

    return address;
}

export const updateAddress = async (userId: string, addressId: string, payload: UpdateAddressInput) => {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } = payload;

    const address = await prisma.$transaction(async (tx) => {

        // find address
        const existingAddress = await tx.address.findFirst({
            where: {
                id: addressId,
                userId
            }
        });

        if (!existingAddress) {
            throw new ApiError(404, "Address not found");
        }

        // prevent removing only default
        if (existingAddress.isDefault && isDefault === false) {

            const otherAddressCount = await tx.address.count({
                where: {
                    userId,
                    NOT: {
                        id: addressId
                    }
                }
            });

            // if no other addresses exist
            if (otherAddressCount === 0) {
                throw new ApiError(400, "At least one default address is required");
            }
        }

        // if making new default
        if (isDefault) {
            await tx.address.updateMany({
                where: {
                    userId
                },
                data: {
                    isDefault: false
                }
            });
        }

        // update address
        return await tx.address.update({
            where: {
                id: addressId
            },
            data: {
                fullName,
                phone,
                addressLine1,
                addressLine2,
                city,
                state,
                pincode,
                country,

                isDefault: isDefault ?? existingAddress.isDefault
            }
        });
    });

    return address;
}

export const deleteAddress = async (userId: string, addressId: string) => {
    return await prisma.$transaction(async (tx) => {
        const address = await tx.address.findFirst({
            where: {
                id: addressId,
                userId
            }
        });

        if (!address) {
            throw new ApiError(404, "Address not found");
        }

        await tx.address.delete({
            where: {
                id: addressId
            }
        });

        // if deleted default address
        if (address.isDefault) {
            const anotherAddress = await tx.address.findFirst({
                where: {
                    userId
                }
            });

            if (anotherAddress) {
                await tx.address.update({
                    where: {
                        id: anotherAddress.id
                    },
                    data: {
                        isDefault: true
                    }
                });
            }
        }

        return true;
    });
};

