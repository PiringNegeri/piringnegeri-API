/*
  Warnings:

  - The values [CS_OFFICER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SupportType" AS ENUM ('BOT', 'HUMAN');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('USER', 'BOT', 'STAFF', 'ADMIN');

-- AlterEnum
ALTER TYPE "ReportStatus" ADD VALUE 'IN_PROGRESS';

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'STAFF', 'ADMIN', 'SUPER_ADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_reportId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "supportType" "SupportType" NOT NULL DEFAULT 'BOT';

-- DropTable
DROP TABLE "comments";

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "senderType" "SenderType" NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,
    "reportId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messages_userId_idx" ON "messages"("userId");

-- CreateIndex
CREATE INDEX "messages_reportId_idx" ON "messages"("reportId");

-- CreateIndex
CREATE INDEX "messages_senderType_idx" ON "messages"("senderType");

-- CreateIndex
CREATE INDEX "reports_supportType_idx" ON "reports"("supportType");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
