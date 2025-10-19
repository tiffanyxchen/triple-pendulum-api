/*
  Warnings:

  - You are about to drop the column `theta1` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `theta2` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `theta3` on the `Result` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[theta1_init,theta2_init,theta3_init]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `theta1_init` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theta1_series` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theta2_init` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theta2_series` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theta3_init` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theta3_series` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Result_theta1_theta2_theta3_key";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "theta1",
DROP COLUMN "theta2",
DROP COLUMN "theta3",
ADD COLUMN     "theta1_init" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "theta1_series" JSONB NOT NULL,
ADD COLUMN     "theta2_init" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "theta2_series" JSONB NOT NULL,
ADD COLUMN     "theta3_init" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "theta3_series" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Result_theta1_init_theta2_init_theta3_init_key" ON "Result"("theta1_init", "theta2_init", "theta3_init");
