/*
  Warnings:

  - You are about to drop the `Favourites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favourites" DROP CONSTRAINT "Favourites_adId_fkey";

-- DropForeignKey
ALTER TABLE "Favourites" DROP CONSTRAINT "Favourites_userId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_adId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_userId_fkey";

-- DropTable
DROP TABLE "Favourites";

-- DropTable
DROP TABLE "Feedback";
