/*
  Warnings:

  - A unique constraint covering the columns `[trackingOrder]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trackingOrder` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `trackingOrder` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_trackingOrder_key` ON `Order`(`trackingOrder`);
