/*
  Warnings:

  - You are about to drop the column `builtM2` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `landM2` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `zone` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyImage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[documentNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SocialProvider" AS ENUM ('WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK');

-- CreateEnum
CREATE TYPE "PropertyMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_typeId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyImage" DROP CONSTRAINT "PropertyImage_propertyId_fkey";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "builtM2",
DROP COLUMN "city",
DROP COLUMN "featured",
DROP COLUMN "landM2",
DROP COLUMN "price",
DROP COLUMN "zone",
ADD COLUMN     "agentId" TEXT,
ADD COLUMN     "areaM2" DECIMAL(12,2),
ADD COLUMN     "builtAreaM2" DECIMAL(12,2),
ADD COLUMN     "cityId" INTEGER,
ADD COLUMN     "depthM2" DECIMAL(12,2),
ADD COLUMN     "frontM2" DECIMAL(12,2),
ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pricePerM2" DECIMAL(12,2),
ADD COLUMN     "suites" INTEGER,
ADD COLUMN     "totalPrice" DECIMAL(12,2),
ADD COLUMN     "zoneId" INTEGER,
ALTER COLUMN "currencyId" DROP NOT NULL,
ALTER COLUMN "typeId" DROP NOT NULL,
ALTER COLUMN "statusId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "password",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "branchId" INTEGER,
ADD COLUMN     "cityId" INTEGER,
ADD COLUMN     "documentNumber" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "hireDate" TIMESTAMP(3),
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Lead";

-- DropTable
DROP TABLE "PropertyImage";

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "cityId" INTEGER,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSocialAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "SocialProvider" NOT NULL,
    "handle" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "UserSocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyMedia" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "type" "PropertyMediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_cityId_name_key" ON "Zone"("cityId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UserSocialAccount_userId_provider_key" ON "UserSocialAccount"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "Property_cityId_idx" ON "Property"("cityId");

-- CreateIndex
CREATE INDEX "Property_statusId_idx" ON "Property"("statusId");

-- CreateIndex
CREATE INDEX "Property_typeId_idx" ON "Property"("typeId");

-- CreateIndex
CREATE INDEX "Property_agentId_idx" ON "Property"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_documentNumber_key" ON "User"("documentNumber");

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSocialAccount" ADD CONSTRAINT "UserSocialAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PropertyType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "PropertyStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyMedia" ADD CONSTRAINT "PropertyMedia_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
