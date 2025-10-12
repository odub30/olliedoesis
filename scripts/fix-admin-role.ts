// Script to check and fix user roles
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixAdminRole() {
  try {
    console.log("🔍 Checking current users...\n");

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    console.log(`Found ${users.length} user(s):\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || "No name"} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log("");
    });

    // Promote all users to ADMIN (for development)
    console.log("🔧 Promoting all users to ADMIN role...\n");

    const updateResult = await prisma.user.updateMany({
      where: {
        role: "PUBLIC",
      },
      data: {
        role: "ADMIN",
      },
    });

    console.log(`✅ Updated ${updateResult.count} user(s) to ADMIN role\n`);

    // Show updated users
    const updatedUsers = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        role: true,
      },
    });

    console.log("📊 Updated users:");
    updatedUsers.forEach((user) => {
      console.log(`   ${user.name || "No name"} (${user.email}) - Role: ${user.role}`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminRole();
