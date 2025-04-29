/*
  Warnings:

  - You are about to drop the column `name` on the `accounting_entry` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `accounting_entry` table. All the data in the column will be lost.
  - You are about to drop the column `suggestedAccountId` on the `ware` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounting_entry" DROP COLUMN "name",
DROP COLUMN "number",
ADD COLUMN     "account_number" INTEGER;

-- AlterTable
ALTER TABLE "ware" DROP COLUMN "suggestedAccountId",
ADD COLUMN     "account_number" INTEGER;

-- AddForeignKey
ALTER TABLE "accounting_entry" ADD CONSTRAINT "accounting_entry_account_number_fkey" FOREIGN KEY ("account_number") REFERENCES "account"("number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ware" ADD CONSTRAINT "ware_account_number_fkey" FOREIGN KEY ("account_number") REFERENCES "account"("number") ON DELETE SET NULL ON UPDATE CASCADE;
