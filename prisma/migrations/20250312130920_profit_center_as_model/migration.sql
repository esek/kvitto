/*
  Warnings:

  - You are about to drop the column `profit_center` on the `accounting_entry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounting_entry" DROP COLUMN "profit_center",
ADD COLUMN     "profit_center_name" TEXT;

-- CreateTable
CREATE TABLE "ProfitCenter" (
    "name" TEXT NOT NULL,
    "utskott" "utskott" NOT NULL,

    CONSTRAINT "ProfitCenter_pkey" PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "accounting_entry" ADD CONSTRAINT "accounting_entry_profit_center_name_fkey" FOREIGN KEY ("profit_center_name") REFERENCES "ProfitCenter"("name") ON DELETE SET NULL ON UPDATE CASCADE;
