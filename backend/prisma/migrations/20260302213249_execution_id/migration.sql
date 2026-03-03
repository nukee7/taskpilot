/*
  Warnings:

  - A unique constraint covering the columns `[executionId]` on the table `Execution` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `executionId` to the `Execution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Execution" ADD COLUMN     "executionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Execution_executionId_key" ON "Execution"("executionId");
