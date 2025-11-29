import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { parseArgs } from 'node:util';

const prisma = new PrismaClient();

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      email: {
        type: 'string',
        short: 'e',
      },
      password: {
        type: 'string',
        short: 'p',
      },
      name: {
        type: 'string',
        short: 'n',
      },
    },
  });

  if (!values.email || !values.password) {
    console.error('Error: --email and --password are required');
    process.exit(1);
  }

  const email = values.email;
  const password = values.password;
  const name = values.name || 'Admin User';

  console.log(`Creating admin user: ${email}`);

  try {
    // 1. Ensure ADMIN role exists
    const adminRoleName = 'ADMIN';
    let adminRole = await prisma.role.findUnique({
      where: { name: adminRoleName },
    });

    if (!adminRole) {
      console.log(`Role ${adminRoleName} not found, creating it...`);
      adminRole = await prisma.role.create({
        data: {
          name: adminRoleName,
          description: 'Administrator with full access',
          isSystem: true,
        },
      });
    }

    // 2. Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error(`Error: User with email ${email} already exists`);
      process.exit(1);
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        status: 'ACTIVE',
        emailVerified: new Date(),
        userRoles: {
          create: {
            roleId: adminRole.id,
          },
        },
      },
    });

    console.log(`Admin user created successfully: ${user.id}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
