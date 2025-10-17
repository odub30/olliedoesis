-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "category" TEXT,
ADD COLUMN     "githubRepo" TEXT,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "lastUpdated" TIMESTAMP(3),
ADD COLUMN     "relatedPostIds" TEXT[];

-- CreateTable
CREATE TABLE "CodeExample" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogFAQ" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogFAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogMetrics" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "bundleReduction" TEXT,
    "fcpImprovement" TEXT,
    "lcpImprovement" TEXT,
    "ttiImprovement" TEXT,
    "lighthouseIncrease" INTEGER,

    CONSTRAINT "BlogMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodeExample_blogId_idx" ON "CodeExample"("blogId");

-- CreateIndex
CREATE INDEX "CodeExample_order_idx" ON "CodeExample"("order");

-- CreateIndex
CREATE INDEX "BlogFAQ_blogId_idx" ON "BlogFAQ"("blogId");

-- CreateIndex
CREATE INDEX "BlogFAQ_order_idx" ON "BlogFAQ"("order");

-- CreateIndex
CREATE UNIQUE INDEX "BlogMetrics_blogId_key" ON "BlogMetrics"("blogId");

-- CreateIndex
CREATE INDEX "Blog_category_idx" ON "Blog"("category");

-- AddForeignKey
ALTER TABLE "CodeExample" ADD CONSTRAINT "CodeExample_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogFAQ" ADD CONSTRAINT "BlogFAQ_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogMetrics" ADD CONSTRAINT "BlogMetrics_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
