# 🔧 Admin Login Fix - Complete Instructions

## 🎯 The Problem

Your admin login wasn't working because:

1. ✅ **Auth credentials are correct** (GitHub ID, Secret, NextAuth Secret all set)
2. ❌ **Server was running on PORT 3001 instead of 3000**
3. ❌ **Auth callback URL was set to port 3000**
4. ❌ **GitHub OAuth redirected to wrong port → Login failed**

---

## ✅ Solution Applied

I've fixed the port conflict. Your server should now run on port 3000.

---

## 🚀 How to Login Now

### Step 1: Start the Dev Server

```bash
# Make sure you're in the project directory
cd c:/olliedoesis

# Start the server (it should use port 3000)
npm run dev
```

You should see:
```
✓ Starting...
- Local:        http://localhost:3000  ← Should be 3000!
```

If you see port 3001 or another port, stop the server (Ctrl+C) and run:
```bash
# Kill any process on port 3000
powershell "Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force"

# Then start again
npm run dev
```

---

### Step 2: Visit the Signin Page

Open your browser and go to:
```
http://localhost:3000/auth/signin
```

---

### Step 3: Click "Continue with GitHub"

1. Click the GitHub button
2. You'll be redirected to GitHub
3. Authorize the application
4. You'll be redirected back to localhost:3000
5. **You'll automatically become ADMIN** (first user privilege!)

---

### Step 4: Access Admin Panel

Once logged in, visit:
```
http://localhost:3000/admin
```

You should now have full access! 🎉

---

## ⚠️ Verify GitHub OAuth Settings

**Important:** Your GitHub OAuth app must allow `localhost:3000` as a callback URL.

### Check Your Settings:

1. Go to: https://github.com/settings/developers
2. Find your OAuth app with Client ID: `Ov23liYpevHBPMJS03Kv`
3. Make sure **"Authorization callback URL"** is set to:
   ```
   http://localhost:3000/api/auth/callback/github
   ```

### If You Need to Add It:

Click "Edit" on your OAuth app and add:
```
http://localhost:3000/api/auth/callback/github
```

You can have multiple callback URLs (for dev and production):
```
http://localhost:3000/api/auth/callback/github
https://olliedoesis.vercel.app/api/auth/callback/github
```

---

## 🐛 Troubleshooting

### Problem: Still on Wrong Port

**Symptom:** Server starts on 3001 or other port

**Solution:**
```bash
# Find what's using port 3000
netstat -ano | grep ":3000"

# Kill the process (replace XXXXX with the PID)
powershell "Stop-Process -Id XXXXX -Force"

# Or kill all Node processes
powershell "Get-Process node | Stop-Process -Force"

# Restart
npm run dev
```

---

### Problem: GitHub Returns Error

**Symptom:** After authorizing GitHub, you see an error page

**Possible Causes:**

1. **Callback URL mismatch**
   - ✅ Fix: Update GitHub OAuth app settings (see above)

2. **Wrong port**
   - ✅ Fix: Make sure server is on port 3000

3. **Environment variables not loaded**
   - ✅ Fix: Restart dev server after env changes

---

### Problem: 404 Error

**Symptom:** Can't access `/auth/signin`

**Solution:**
```bash
# Make sure your dev server is running
npm run dev

# Try accessing the page again
# Open: http://localhost:3000/auth/signin
```

---

### Problem: "Unauthorized" When Accessing Admin

**Symptom:** You can login but `/admin` shows "unauthorized"

**Cause:** You're not the first user OR your role wasn't set to ADMIN

**Solution:**
1. Check if you're the first user in the database
2. First user automatically gets ADMIN role
3. If you're not the first user, manually set your role in the database:

```bash
# Open Prisma Studio
npx prisma studio

# Go to the "User" table
# Find your user
# Change "role" to "ADMIN"
# Save
```

---

## 🔍 Check Everything is Working

Run this diagnostic script:
```bash
node scripts/test-auth-config.js
```

You should see all ✅ green checkmarks.

---

## 📝 Current Environment Variables

Your auth is configured with:

```env
NEXTAUTH_URL=http://localhost:3000          ✅
NEXTAUTH_SECRET=***MmnmkTY=                 ✅
GITHUB_ID=Ov23liYpevHBPMJS03Kv             ✅
GITHUB_SECRET=***991a37de                   ✅
DATABASE_URL=prisma+postgres://...          ✅
```

All correct! ✅

---

## ✅ Quick Test Checklist

- [ ] Server running on port 3000
- [ ] Visit http://localhost:3000/auth/signin
- [ ] See GitHub login button
- [ ] Click "Continue with GitHub"
- [ ] Redirected to GitHub
- [ ] Authorize application
- [ ] Redirected back to localhost:3000
- [ ] Logged in successfully
- [ ] Visit http://localhost:3000/admin
- [ ] Can access admin panel

---

## 🆘 Still Having Issues?

If you're still stuck:

1. **Check browser console** (F12 → Console tab)
   - Look for errors
   - Copy any error messages

2. **Check terminal**
   - Look for server errors
   - Copy any error messages

3. **Try incognito/private window**
   - Rules out cookie/cache issues

4. **Clear browser data**
   - Clear cookies for localhost
   - Clear cache

5. **Restart everything**
   ```bash
   # Stop server (Ctrl+C)
   # Close terminal
   # Open new terminal
   cd c:/olliedoesis
   npm run dev
   ```

---

## 💡 Why Your First User Gets Admin

The auth code automatically gives the first user ADMIN privileges:

```typescript
// src/lib/auth.ts:153-163
if (trigger === "signIn" && user) {
  const userCount = await prisma.user.count();

  if (userCount === 1) {
    // First user gets ADMIN role
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });
    token.role = "ADMIN";
  }
}
```

This is intentional and secure for initial setup!

---

**Expected Time to Fix:** 2-3 minutes

Good luck! 🚀
