// scripts/set-admin-role.ts
import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function setAdminRole() {
  try {
    console.log('🔍 Fetching all users...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    console.log('📋 Current users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'} (${user.email}) - Role: ${user.role}`);
    });
    console.log('');

    // Update the first user (or you can modify this to update a specific user)
    const userToUpdate = users[0];

    if (userToUpdate.role === 'ADMIN') {
      console.log(`✅ User "${userToUpdate.name}" already has ADMIN role`);
      return;
    }

    console.log(`🔄 Updating ${userToUpdate.name || userToUpdate.email} to ADMIN role...`);

    const updatedUser = await prisma.user.update({
      where: { id: userToUpdate.id },
      data: { role: 'ADMIN' },
    });

    console.log(`✅ Successfully updated ${updatedUser.name} to ADMIN role!`);
    console.log(`\n🎉 You can now access /admin routes`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setAdminRole();
