-- CreateEnum
CREATE TYPE "utskott" AS ENUM ('CM', 'E6', 'ENU', 'FVU', 'INFU', 'KM', 'NOJU', 'NOLLU', 'OTHER', 'PENGU', 'SRE', 'STYRELSEN');

-- CreateTable
CREATE TABLE "accounting_entry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "profit_center" TEXT,
    "project" INTEGER,
    "voucher_id" INTEGER,

    CONSTRAINT "accounting_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ware" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "cost_in_cents" INTEGER NOT NULL,
    "voucher_id" INTEGER,

    CONSTRAINT "ware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucher" (
    "id" SERIAL NOT NULL,
    "ver_nr" INTEGER,
    "transaction_date" TIMESTAMP(3),
    "date_turned_in" TIMESTAMP(3) NOT NULL,
    "receipt_url" TEXT NOT NULL,
    "receipt_date" TIMESTAMP(3) NOT NULL,
    "utskott" "utskott" NOT NULL,
    "project" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_voucher" (
    "id" SERIAL NOT NULL,
    "payment_date" TIMESTAMP(3),
    "payment_added_by" TEXT,
    "voucher_id" INTEGER NOT NULL,
    "ssn" INTEGER NOT NULL,
    "clearing_num" INTEGER NOT NULL,
    "account_num" INTEGER NOT NULL,

    CONSTRAINT "private_voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("number")
);

-- CreateIndex
CREATE UNIQUE INDEX "private_voucher_voucher_id_key" ON "private_voucher"("voucher_id");

-- AddForeignKey
ALTER TABLE "accounting_entry" ADD CONSTRAINT "accounting_entry_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ware" ADD CONSTRAINT "ware_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_voucher" ADD CONSTRAINT "private_voucher_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
