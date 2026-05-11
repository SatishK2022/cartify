/*
  Warnings:

  - A unique constraint covering the columns `[slug,isDeleted]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_isDeleted_key" ON "Category"("slug", "isDeleted");
