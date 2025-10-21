-- AlterTable
ALTER TABLE "voucher" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false;
