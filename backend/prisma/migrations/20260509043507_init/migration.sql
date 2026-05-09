-- AlterTable
ALTER TABLE "User" ADD COLUMN     "forgotPasswordToken" TEXT,
ADD COLUMN     "forgotPasswordTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "verifyEmailToken" TEXT,
ADD COLUMN     "verifyEmailTokenExpiry" TIMESTAMP(3);
