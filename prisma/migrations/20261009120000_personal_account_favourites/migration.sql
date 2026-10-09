CREATE TABLE "account_favourite" (
    "username" TEXT NOT NULL,
    "account_number" INTEGER NOT NULL,
    CONSTRAINT "account_favourite_pkey" PRIMARY KEY ("username", "account_number")
);
