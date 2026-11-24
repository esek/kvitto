-- AlterTable
ALTER TABLE "project" ADD COLUMN "profit_center_name" TEXT;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_profit_center_name_fkey" FOREIGN KEY ("profit_center_name") REFERENCES "profit_center"("name") ON DELETE SET NULL ON UPDATE CASCADE;
