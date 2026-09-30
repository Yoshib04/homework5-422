-- CreateTable
CREATE TABLE "Trail" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "distanceMiles" DOUBLE PRECISION NOT NULL,
    "difficulty" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trail_pkey" PRIMARY KEY ("id")
);
