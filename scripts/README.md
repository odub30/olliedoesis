# Blog Content Migration Scripts

This directory contains scripts for migrating and managing blog content.

## migrate-blog-content.ts

Enhances existing blog posts with new schema fields added in the blog system upgrade.

### What it does

1. **Category Assignment**: Automatically assigns categories based on existing tags using intelligent mapping
2. **Keyword Extraction**: Generates SEO keywords from blog title, excerpt, and tags
3. **GitHub Link Detection**: Scans content for GitHub repository URLs and extracts them
4. **Related Posts**: Finds and links related blog posts based on tag similarity

### Usage

```bash
# Using npx with ts-node
npx ts-node scripts/migrate-blog-content.ts

# Or add to package.json scripts and run
npm run migrate:blogs
```

### Features

- **Safe**: Only updates blogs that haven't been enhanced yet (skips blogs with existing category/keywords)
- **Intelligent**: Uses tag-based category mapping and keyword extraction algorithms
- **Detailed Logging**: Shows progress and what changes are being made to each blog
- **Rollback Safe**: Uses transactions and can be run multiple times safely

### Category Mappings

The script uses smart category mappings based on tags:

| Tags | Category |
|------|----------|
| nextjs, react, typescript, javascript, css, tailwind | Frontend Development |
| performance | Performance Optimization |
| seo | SEO & Marketing |
| security | Security |
| database, prisma, nodejs, api | Backend Development |
| testing | Testing & Quality |
| deployment, docker | DevOps |
| aws | Cloud & Infrastructure |

### Output Example

```
🚀 Starting blog content migration...

📊 Found 5 blog posts to process

📝 Processing: "Building High-Performance Web Apps"
   ✓ Category: Frontend Development
   ✓ Keywords: building, performance, apps, nextjs, react
   ✓ GitHub: https://github.com/user/repo
   ✓ Related: 2 posts
   ✅ Updated successfully

⏭️  Skipping "Another Post" - already enhanced

✨ Migration complete!
   Updated: 4 blog posts
   Skipped: 1 blog posts (already enhanced)
   Total: 5 blog posts
```

### Notes

- Run this after deploying the new blog schema migration
- Can be run multiple times safely - skips already-enhanced blogs
- Review the output to ensure categorizations are correct
- You can manually adjust categories via the admin interface after migration
