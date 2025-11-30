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

  const provider = process.env.NEXT_PUBLIC_REPOSITORY_PROVIDER;

  if (provider === 'browser') {
    console.warn('⚠️  You are using the BROWSER repository provider.');
    console.warn("   This script cannot write directly to your browser's IndexedDB.");
    console.log(
      '\nTo create an admin user, please open your browser console (F12) on the application page and run the following code:\n'
    );

    const snippet = `
(async () => {
  const DB_NAME = 'admin-dashboard-db';
  const DB_VERSION = 1;
  
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  
  request.onsuccess = async (event) => {
    const db = event.target.result;
    
    // Helper to add data
    const add = (storeName, data) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    };

    // Helper to get by index
    const getByIndex = (storeName, indexName, value) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.get(value);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    };

    try {
      // 1. Create ADMIN role
      let adminRole = await getByIndex('roles', 'by-name', 'ADMIN');
      if (!adminRole) {
        const roleId = crypto.randomUUID();
        adminRole = {
          id: roleId,
          name: 'ADMIN',
          description: 'Administrator with full access',
          isSystem: true,
          permissionIds: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await add('roles', adminRole);
        console.log('Created ADMIN role');
      } else {
        console.log('ADMIN role already exists');
      }

      // 2. Create User
      const email = '${email}';
      const password = '${password}'; // Note: In a real app, hash this! But for this demo we store plain/mock hash
      // Since we are using the Password value object in the app which expects a hash or handles comparison,
      // and our AuthService mock compares plain text if we want, OR we can use a simple hash.
      // But wait, IndexedDBUserRepository expects a Password value object which wraps the hash.
      // And AuthService.login compares using Password.compare.
      // If we store plain text here, Password.compare(plain) will fail if it expects a bcrypt hash.
      // However, our Password value object uses bcryptjs.
      // We can't easily use bcryptjs in the browser console without importing it.
      // For this demo, let's assume the user will use the UI to register if they want proper hashing,
      // OR we provide a pre-calculated hash for "password123" or similar if we want to be strict.
      // OR we update AuthService to handle legacy/plain passwords (bad practice).
      
      // Let's just warn the user that this is a demo script.
      // Actually, we can just import bcryptjs if we are in the app context, but in console we are not.
      // Let's just create the user and let them reset password or use a known hash.
      // For "password123", the hash is: $2a$12$cq/..
      // Let's just use a placeholder hash for now or tell them.
      
      // BETTER APPROACH:
      // The AuthService mock implementation I wrote:
      // const isValid = await user.password.compare(password);
      // Password.compare uses bcrypt.compare.
      // So we MUST store a bcrypt hash in IndexedDB.
      // I will generate the hash HERE in the node script and put it in the snippet.
      
      const existingUser = await getByIndex('users', 'by-email', email);
      if (existingUser) {
        console.error('User already exists');
        return;
      }

      const userId = crypto.randomUUID();
      const newUser = {
        id: userId,
        email: email,
        password: '${await bcrypt.hash(password, 12)}', // Hashed by the script!
        name: '${name}',
        image: null,
        status: 'ACTIVE',
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        roleIds: [adminRole.id]
      };

      await add('users', newUser);
      console.log('Admin user created successfully!');
      
    } catch (err) {
      console.error('Error:', err);
    }
  };
})();
    `;

    console.log(snippet);
    return;
  }

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
