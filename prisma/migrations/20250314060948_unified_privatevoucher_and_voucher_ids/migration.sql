/*
  Warnings:

  - You are about to drop the column `name` on the `account` table. All the data in the column will be lost.
  - The primary key for the `private_voucher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `private_voucher` table. All the data in the column will be lost.
  - You are about to drop the column `project` on the `voucher` table. All the data in the column will be lost.
  - Added the required column `accounting_label` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voucher_label` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account" DROP COLUMN "name",
ADD COLUMN     "accounting_label" TEXT NOT NULL,
ADD COLUMN     "voucher_label" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "private_voucher" DROP CONSTRAINT "private_voucher_pkey",
DROP COLUMN "id",
ALTER COLUMN "ssn" SET DATA TYPE TEXT,
ALTER COLUMN "clearing_num" SET DATA TYPE TEXT,
ALTER COLUMN "account_num" SET DATA TYPE TEXT,
ADD CONSTRAINT "private_voucher_pkey" PRIMARY KEY ("voucher_id");

-- AlterTable
ALTER TABLE "voucher" DROP COLUMN "project",
ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Project" (
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("number")
);
