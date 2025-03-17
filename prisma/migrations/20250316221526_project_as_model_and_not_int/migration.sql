/*
  Warnings:

  - You are about to drop the column `project` on the `accounting_entry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounting_entry" DROP COLUMN "project",
ADD COLUMN     "project_number" INTEGER;

-- AddForeignKey
ALTER TABLE "accounting_entry" ADD CONSTRAINT "accounting_entry_project_number_fkey" FOREIGN KEY ("project_number") REFERENCES "Project"("number") ON DELETE SET NULL ON UPDATE CASCADE;
