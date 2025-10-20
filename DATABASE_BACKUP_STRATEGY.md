# Database Backup Strategy

**Purpose:** Prevent data loss and enable quick recovery after database incidents
**Last Updated:** 2024-10-18
**Review Schedule:** Monthly

---

## 🎯 Backup Goals

1. **Recovery Time Objective (RTO):** < 30 minutes
2. **Recovery Point Objective (RPO):** < 24 hours
3. **Retention Period:** 30 days for daily backups, 1 year for monthly
4. **Automation Level:** Fully automated with manual verification

---

## 📊 What Needs Backing Up

### Critical Data (Must backup)
- ✅ **Database:** All tables and data
- ✅ **Environment variables:** Documented and secured
- ✅ **Vercel Blob storage:** User-uploaded images
- ✅ **Seed data:** Keep seed.ts up-to-date

### Version Controlled (Already backed up in Git)
- ✅ Source code
- ✅ Prisma schema
- ✅ Configuration files
- ✅ Static assets in public/
- ✅ Seed scripts

### Regenerable (Low priority)
- 📊 Analytics data (SearchHistory, PageView)
- 📊 Search analytics
- 📊 Tag counts (can be recalculated)

---

## 🛠️ Backup Methods

### Method 1: Prisma Database Exports (Recommended)

**Pros:**
- Database-agnostic format
- Easy to version control
- Can be automated
- Works with Prisma Accelerate

**Cons:**
- Requires custom script
- Not built into Prisma Accelerate

**Implementation:**

Create `scripts/backup-database.ts`:

```typescript
// scripts/backup-database.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  console.log('📦 Starting database backup...');

  // Fetch all data
  const backup = {
    timestamp: new Date().toISOString(),
    version: '1.0',
    data: {
      users: await prisma.user.findMany({ include: { accounts: true, sessions: true } }),
      projects: await prisma.project.findMany({ include: { tags: true, images: true } }),
      blogs: await prisma.blog.findMany({
        include: {
          tags: true,
          images: true,
          codeExamples: true,
          faqs: true,
          metrics: true,
        },
      }),
      tags: await prisma.tag.findMany(),
      images: await prisma.image.findMany({ include: { tags: true } }),
      searchHistory: await prisma.searchHistory.findMany(),
      searchAnalytics: await prisma.searchAnalytics.findMany(),
      pageViews: await prisma.pageView.findMany(),
    },
  };

  // Write to file
  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));

  console.log(`✅ Backup completed: ${backupFile}`);
  console.log(`📊 Backed up ${Object.keys(backup.data).length} tables`);

  // Clean up old backups (keep last 30 days)
  cleanOldBackups(backupDir, 30);
}

function cleanOldBackups(backupDir: string, daysToKeep: number) {
  const files = fs.readdirSync(backupDir);
  const now = Date.now();
  const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

  let deletedCount = 0;

  files.forEach((file) => {
    const filePath = path.join(backupDir, file);
    const stats = fs.statSync(filePath);
    const age = now - stats.mtimeMs;

    if (age > maxAge) {
      fs.unlinkSync(filePath);
      deletedCount++;
    }
  });

  if (deletedCount > 0) {
    console.log(`🗑️  Deleted ${deletedCount} old backup(s)`);
  }
}

backupDatabase()
  .catch((error) => {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Add to package.json:**
```json
{
  "scripts": {
    "backup:db": "npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/backup-database.ts"
  }
}
```

**Usage:**
```bash
npm run backup:db
```

**Schedule with GitHub Actions:**

Create `.github/workflows/database-backup.yml`:

```yaml
name: Database Backup

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run backup
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npm run backup:db

      - name: Upload backup artifact
        uses: actions/upload-artifact@v3
        with:
          name: database-backup-${{ github.run_number }}
          path: backups/
          retention-days: 30
```

### Method 2: PostgreSQL pg_dump (Direct Database Access)

**Note:** Prisma Accelerate doesn't allow direct PostgreSQL access, so this method requires direct database URL.

**Only use if you have `POSTGRES_DATABASE_URL` (not Accelerate URL):**

Create `scripts/pg-backup.sh`:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="./backups/pg"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.sql"
DAYS_TO_KEEP=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Run pg_dump
echo "📦 Starting PostgreSQL backup..."
pg_dump $POSTGRES_DATABASE_URL > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

echo "✅ Backup completed: $BACKUP_FILE.gz"

# Clean old backups
find $BACKUP_DIR -name "backup-*.sql.gz" -mtime +$DAYS_TO_KEEP -delete
echo "🗑️  Cleaned backups older than $DAYS_TO_KEEP days"
```

**Usage:**
```bash
chmod +x scripts/pg-backup.sh
./scripts/pg-backup.sh
```

### Method 3: Vercel Blob Storage Backup

**For images and uploaded files:**

Create `scripts/backup-blob-storage.ts`:

```typescript
// scripts/backup-blob-storage.ts
import { list } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

async function backupBlobStorage() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups', 'blob', timestamp);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('📦 Starting Blob storage backup...');

  // List all blobs
  const { blobs } = await list();

  console.log(`📊 Found ${blobs.length} files to backup`);

  // Create manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    count: blobs.length,
    files: blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    })),
  };

  fs.writeFileSync(
    path.join(backupDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Download each file (optional - can be very large!)
  // Uncomment if you want to download actual files
  // for (const blob of blobs) {
  //   const response = await fetch(blob.url);
  //   const buffer = await response.buffer();
  //   const filename = path.basename(blob.pathname);
  //   fs.writeFileSync(path.join(backupDir, filename), buffer);
  // }

  console.log(`✅ Blob manifest saved: ${backupDir}/manifest.json`);
}

backupBlobStorage().catch(console.error);
```

**Add to package.json:**
```json
{
  "scripts": {
    "backup:blob": "npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/backup-blob-storage.ts"
  }
}
```

---

## 📅 Backup Schedule

### Automated Backups

| Frequency | Method | What | Retention |
|-----------|--------|------|-----------|
| **Daily** | Database export | Full database | 30 days |
| **Weekly** | Blob manifest | Image metadata | 90 days |
| **Monthly** | Full system | Database + Blobs | 1 year |

### Manual Backups (Before Major Changes)

- ✅ Before database migrations
- ✅ Before major deployments
- ✅ Before schema changes
- ✅ Before bulk data imports/exports

**Command:**
```bash
npm run backup:db
```

---

## 💾 Backup Storage Locations

### Option 1: Git Repository (Small Backups)
**Recommended for:** Environment config, small database exports

```bash
# Add backups directory to Git (if small)
git add backups/
git commit -m "Database backup $(date +%Y-%m-%d)"
git push
```

**Pros:** Version controlled, always accessible
**Cons:** Not suitable for large files, increases repo size

### Option 2: GitHub Artifacts (Via Actions)
**Recommended for:** Automated daily backups

**Pros:** Automatic, built-in retention, free
**Cons:** 90 day max retention, requires GitHub Actions

### Option 3: Cloud Storage (S3, Google Cloud Storage)
**Recommended for:** Production systems, large backups

**Setup for AWS S3:**

```typescript
// scripts/backup-to-s3.ts
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';

const s3Client = new S3Client({ region: 'us-east-1' });

async function backupToS3() {
  // Run backup first
  const backupFile = await runBackup();

  // Upload to S3
  const fileContent = fs.readFileSync(backupFile);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: 'your-backup-bucket',
      Key: `backups/${path.basename(backupFile)}`,
      Body: fileContent,
    })
  );

  console.log('✅ Backup uploaded to S3');
}
```

### Option 4: Vercel Blob (For Backups)
**Recommended for:** Keeping backups close to your app

```typescript
import { put } from '@vercel/blob';
import * as fs from 'fs';

async function backupToVercelBlob() {
  const backupFile = './backups/latest-backup.json';
  const fileContent = fs.readFileSync(backupFile);

  const blob = await put(`backups/backup-${Date.now()}.json`, fileContent, {
    access: 'private',
  });

  console.log('✅ Backup saved to Vercel Blob:', blob.url);
}
```

---

## 🔄 Restoration Procedures

### Restore from JSON Backup

Create `scripts/restore-database.ts`:

```typescript
// scripts/restore-database.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function restoreDatabase(backupFile: string) {
  console.log('🔄 Starting database restoration...');
  console.log(`📂 Reading backup: ${backupFile}`);

  const backup = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));

  console.log(`📅 Backup timestamp: ${backup.timestamp}`);
  console.log(`⚠️  This will delete all current data!`);

  // Prompt for confirmation (in real script, add confirmation logic)

  // Delete all data (in reverse order of dependencies)
  await prisma.blogMetrics.deleteMany();
  await prisma.blogFAQ.deleteMany();
  await prisma.codeExample.deleteMany();
  await prisma.searchAnalytics.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.pageView.deleteMany();
  await prisma.image.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.project.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Old data deleted');

  // Restore data
  console.log('📥 Restoring users...');
  for (const user of backup.data.users) {
    const { accounts, sessions, ...userData } = user;
    await prisma.user.create({ data: userData });
  }

  console.log('📥 Restoring tags...');
  for (const tag of backup.data.tags) {
    await prisma.tag.create({ data: tag });
  }

  console.log('📥 Restoring projects...');
  for (const project of backup.data.projects) {
    const { tags, images, ...projectData } = project;
    await prisma.project.create({ data: projectData });
  }

  console.log('📥 Restoring blogs...');
  for (const blog of backup.data.blogs) {
    const { tags, images, codeExamples, faqs, metrics, ...blogData } = blog;
    await prisma.blog.create({ data: blogData });
  }

  // Restore relationships (tags, images, etc.)
  // ... additional restoration logic

  console.log('✅ Restoration completed!');
}

const backupFile = process.argv[2];
if (!backupFile) {
  console.error('Usage: npm run restore:db <backup-file>');
  process.exit(1);
}

restoreDatabase(backupFile)
  .catch((error) => {
    console.error('❌ Restoration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Add to package.json:**
```json
{
  "scripts": {
    "restore:db": "npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/restore-database.ts"
  }
}
```

**Usage:**
```bash
npm run restore:db ./backups/backup-2024-10-18.json
```

---

## 🧪 Testing Backups

**Monthly Backup Test Procedure:**

1. **Run a backup:**
   ```bash
   npm run backup:db
   ```

2. **Verify backup file:**
   ```bash
   ls -lh backups/
   # Check file size is reasonable
   ```

3. **Test restoration in development:**
   ```bash
   # Use a test database
   DATABASE_URL="your_test_database_url" npm run restore:db backups/latest-backup.json
   ```

4. **Verify restored data:**
   ```bash
   npx prisma studio
   # Check that all data looks correct
   ```

5. **Document results:**
   - Create entry in backup test log
   - Note any issues
   - Update procedures if needed

---

## 📋 Pre-Deployment Checklist

Before any major deployment or database change:

- [ ] Run manual backup: `npm run backup:db`
- [ ] Verify backup file created successfully
- [ ] Note backup timestamp for rollback reference
- [ ] Ensure environment variables are documented
- [ ] Test restoration procedure (in dev environment)
- [ ] Have rollback plan ready

---

## 🚨 Disaster Recovery Plan

### If Database is Deleted

1. **Don't Panic** ✅
2. **Check what survived:**
   - Prisma schema (should be in Git)
   - Seed files
   - Static content
3. **Restore from latest backup:**
   ```bash
   # Find latest backup
   ls -lt backups/

   # Restore
   npm run restore:db backups/backup-YYYY-MM-DD.json
   ```

4. **If no backup exists:**
   - Run schema push: `npx prisma db push`
   - Run seed: `npx ts-node prisma/seed.ts`
   - Manually recreate critical content

5. **Update environment variables**
6. **Test application**
7. **Deploy to production**

### If Vercel Blob is Deleted

1. **Check Blob backup manifest**
2. **Re-upload images** from local backup or `public/` folder
3. **Update Image records** in database with new URLs

---

## 📚 Documentation Requirements

### Keep Updated

1. **Environment Variables Document**
   - List all required variables
   - Note which are critical
   - Document how to obtain new keys

2. **Content Inventory**
   - Which content is database-only
   - Which content has file backups (markdown)
   - What's regenerable vs critical

3. **Backup Log**
   - Track backup tests
   - Note any failures
   - Document restoration times

---

## 🔒 Security Considerations

### Backup Security

- ❌ **Never** commit backups with sensitive data to public repos
- ✅ **Encrypt** backups if storing off-site
- ✅ **Restrict access** to backup storage
- ✅ **Test restoration** regularly

### Environment Variables

- ✅ Store in secure password manager (1Password, LastPass)
- ✅ Document required variables in .env.example
- ✅ Rotate secrets periodically
- ❌ Never commit actual .env files

---

## 📊 Monitoring & Alerts

### Set Up Alerts For

1. **Backup Failures**
   - GitHub Actions failing
   - Backup script errors
   - Disk space issues

2. **Database Issues**
   - Connection failures
   - Slow queries
   - High error rates

3. **Blob Storage**
   - Upload failures
   - Storage quota warnings

### Monitoring Tools

- **Vercel Dashboard:** Monitor deployments and functions
- **GitHub Actions:** Track backup workflow status
- **Prisma Pulse:** Real-time database changes (if available)
- **Custom logging:** Log all backup operations

---

## ✅ Implementation Checklist

- [ ] Create `scripts/backup-database.ts`
- [ ] Create `scripts/restore-database.ts`
- [ ] Add backup scripts to package.json
- [ ] Set up GitHub Actions backup workflow
- [ ] Test backup creation
- [ ] Test backup restoration
- [ ] Document environment variables
- [ ] Set up monitoring/alerts
- [ ] Schedule monthly backup tests
- [ ] Create backup storage location (S3, etc.)
- [ ] Add backups to .gitignore (if sensitive)
- [ ] Document restoration procedures
- [ ] Train team on backup/restore process

---

## 🔗 Resources

- [Prisma Backup Best Practices](https://www.prisma.io/docs)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [PostgreSQL Backup Guide](https://www.postgresql.org/docs/current/backup.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Last Review:** 2024-10-18
**Next Review:** 2024-11-18
**Owner:** Admin Team
**Version:** 1.0
