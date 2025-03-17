/*
  Warnings:

  - Added the required column `cost_in_cents` to the `accounting_entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounting_entry" ADD COLUMN     "cost_in_cents" INTEGER NOT NULL;
