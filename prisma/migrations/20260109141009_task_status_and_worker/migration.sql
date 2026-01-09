-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('OPEN', 'ASSIGNED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "workerId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
