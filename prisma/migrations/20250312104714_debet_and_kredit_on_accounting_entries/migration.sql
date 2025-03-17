/*
  Warnings:

  - You are about to drop the column `cost_in_cents` on the `accounting_entry` table. All the data in the column will be lost.
  - Added the required column `debet_in_cents` to the `accounting_entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kredit_in_cents` to the `accounting_entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounting_entry" DROP COLUMN "cost_in_cents",
ADD COLUMN     "debet_in_cents" INTEGER NOT NULL,
ADD COLUMN     "kredit_in_cents" INTEGER NOT NULL;
