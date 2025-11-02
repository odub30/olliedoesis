-- AlterTable
ALTER TABLE "images" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "filename" TEXT,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE INDEX "images_categoryId_idx" ON "images"("categoryId");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
