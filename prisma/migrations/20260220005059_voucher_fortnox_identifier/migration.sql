-- CreateTable
CREATE TABLE "voucher_fortnox_identifier" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "series" TEXT NOT NULL,
    "fiscal_year" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "voucher_fortnox_identifier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "voucher_fortnox_identifier" ADD CONSTRAINT "voucher_fortnox_identifier_id_fkey" FOREIGN KEY ("id") REFERENCES "voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
