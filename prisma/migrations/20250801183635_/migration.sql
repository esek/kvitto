/*
  Warnings:

  - The primary key for the `voucher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `voucher` table. All the data in the column will be lost.
  - You are about to drop the column `receipt_date` on the `voucher` table. All the data in the column will be lost.
  - You are about to drop the column `receipt_url` on the `voucher` table. All the data in the column will be lost.
  - You are about to drop the column `ver_nr` on the `voucher` table. All the data in the column will be lost.
  - You are about to drop the column `cost_in_cents` on the `ware` table. All the data in the column will be lost.
  - You are about to drop the column `voucher_id` on the `ware` table. All the data in the column will be lost.
  - You are about to drop the `ProfitCenter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `private_voucher` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[voucher_label]` on the table `account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `series` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ware` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price_in_cents` to the `ware` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "voucher_series" AS ENUM ('B', 'I', 'K', 'L', 'U');

-- DropForeignKey
ALTER TABLE "accounting_entry" DROP CONSTRAINT "accounting_entry_profit_center_name_fkey";

-- DropForeignKey
ALTER TABLE "accounting_entry" DROP CONSTRAINT "accounting_entry_project_number_fkey";

-- DropForeignKey
ALTER TABLE "accounting_entry" DROP CONSTRAINT "accounting_entry_voucher_id_fkey";

-- DropForeignKey
ALTER TABLE "private_voucher" DROP CONSTRAINT "private_voucher_voucher_id_fkey";

-- DropForeignKey
ALTER TABLE "ware" DROP CONSTRAINT "ware_voucher_id_fkey";

-- AlterTable
ALTER TABLE "accounting_entry" ALTER COLUMN "voucher_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "voucher" DROP CONSTRAINT "voucher_pkey",
DROP COLUMN "name",
DROP COLUMN "receipt_date",
DROP COLUMN "receipt_url",
DROP COLUMN "ver_nr",
ADD COLUMN     "accounted_by" TEXT,
ADD COLUMN     "approved_by" TEXT,
ADD COLUMN     "attachment_url" TEXT,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "series" "voucher_series" NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "date_turned_in" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "voucher_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "voucher_id_seq";

-- AlterTable
ALTER TABLE "ware" DROP COLUMN "cost_in_cents",
DROP COLUMN "voucher_id",
ADD COLUMN     "expense_claim_id" TEXT,
ADD COLUMN     "expense_report_id" TEXT,
ADD COLUMN     "internal_invoice_id" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "sales_report_id" TEXT,
ADD COLUMN     "unit_price_in_cents" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ProfitCenter";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "private_voucher";

-- CreateTable
CREATE TABLE "profit_center" (
    "name" TEXT NOT NULL,
    "utskott" "utskott" NOT NULL,

    CONSTRAINT "profit_center_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "project" (
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "expense_report" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "receipt_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expense_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_claim" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ssn" TEXT NOT NULL,
    "clearing_num" TEXT NOT NULL,
    "account_num" TEXT NOT NULL,
    "receipt_date" TIMESTAMP(3) NOT NULL,
    "payment_date" TIMESTAMP(3),
    "payment_added_by" TEXT,

    CONSTRAINT "expense_claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internal_invoice" (
    "id" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "sender_utskott" "utskott" NOT NULL,
    "recipient_name" TEXT NOT NULL,

    CONSTRAINT "internal_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_report" (
    "id" TEXT NOT NULL,
    "sales_fee_in_cents" INTEGER NOT NULL,
    "total_sales_in_cents" INTEGER NOT NULL,
    "project_number" INTEGER,

    CONSTRAINT "sales_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_invoice" (
    "id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "ocr" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "company_name" TEXT NOT NULL,

    CONSTRAINT "supplier_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers_expense" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ssn" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "miles" INTEGER NOT NULL,
    "miles_compensation_in_cents" INTEGER NOT NULL,
    "ticket_price_in_cents" INTEGER NOT NULL,
    "clearing_num" TEXT NOT NULL,
    "account_num" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3),
    "payment_added_by" TEXT,

    CONSTRAINT "drivers_expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_name_key" ON "project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "account_voucher_label_key" ON "account"("voucher_label");

-- AddForeignKey
ALTER TABLE "accounting_entry" ADD CONSTRAINT "accounting_entry_profit_center_name_fkey" FOREIGN KEY ("profit_center_name") REFERENCES "profit_center"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_entry" ADD CONSTRAINT "accounting_entry_project_number_fkey" FOREIGN KEY ("project_number") REFERENCES "project"("number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_entry" ADD CONSTRAINT "accounting_entry_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ware" ADD CONSTRAINT "ware_expense_report_id_fkey" FOREIGN KEY ("expense_report_id") REFERENCES "expense_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ware" ADD CONSTRAINT "ware_expense_claim_id_fkey" FOREIGN KEY ("expense_claim_id") REFERENCES "expense_claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ware" ADD CONSTRAINT "ware_internal_invoice_id_fkey" FOREIGN KEY ("internal_invoice_id") REFERENCES "internal_invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ware" ADD CONSTRAINT "ware_sales_report_id_fkey" FOREIGN KEY ("sales_report_id") REFERENCES "sales_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_report" ADD CONSTRAINT "expense_report_id_fkey" FOREIGN KEY ("id") REFERENCES "voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_claim" ADD CONSTRAINT "expense_claim_id_fkey" FOREIGN KEY ("id") REFERENCES "voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_invoice" ADD CONSTRAINT "internal_invoice_id_fkey" FOREIGN KEY ("id") REFERENCES "voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_report" ADD CONSTRAINT "sales_report_id_fkey" FOREIGN KEY ("id") REFERENCES "voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_invoice" ADD CONSTRAINT "supplier_invoice_id_fkey" FOREIGN KEY ("id") REFERENCES "voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers_expense" ADD CONSTRAINT "drivers_expense_id_fkey" FOREIGN KEY ("id") REFERENCES "voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
