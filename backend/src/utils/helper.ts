export const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");
};

export const generateUniqueSlug = async (
    model: any,
    title: string
) => {
    const baseSlug = generateSlug(title);

    let slug = baseSlug;
    let count = 1;

    while (true) {
        const exists = await model.findFirst({
            where: {
                slug,
                isDeleted: false
            },
            select: {
                id: true
            }
        });

        if (!exists) break;

        slug = `${baseSlug}-${count}`;
        count++;
    }

    return slug;
};