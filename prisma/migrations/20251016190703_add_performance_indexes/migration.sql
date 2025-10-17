-- CreateIndex
CREATE INDEX "Blog_published_publishedAt_idx" ON "Blog"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "Blog_authorId_published_idx" ON "Blog"("authorId", "published");

-- CreateIndex
CREATE INDEX "Blog_authorId_idx" ON "Blog"("authorId");

-- CreateIndex
CREATE INDEX "SearchHistory_createdAt_category_idx" ON "SearchHistory"("createdAt", "category");
