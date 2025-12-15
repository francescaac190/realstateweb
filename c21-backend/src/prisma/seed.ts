import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedRoles() {
  const roles = [
    { code: 'ADMIN', name: 'Administrador' },
    { code: 'AGENT', name: 'Agente' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {},
      create: role,
    });
  }
}

async function seedCurrencies() {
  const currencies = [
    { code: 'USD', name: 'Dólar estadounidense' },
    { code: 'BOB', name: 'Boliviano' },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency,
    });
  }
}

async function seedPropertyTypes() {
  const types = [
    { code: 'HOUSE', name: 'Casa' },
    { code: 'APARTMENT', name: 'Departamento' },
    { code: 'LAND', name: 'Terreno' },
    { code: 'OFFICE', name: 'Oficina' },
  ];

  for (const type of types) {
    await prisma.propertyType.upsert({
      where: { code: type.code },
      update: {},
      create: type,
    });
  }
}

async function seedPropertyStatuses() {
  const statuses = [
    { code: 'AVAILABLE', name: 'Disponible' },
    { code: 'RESERVED', name: 'Reservado' },
    { code: 'SOLD', name: 'Vendido' },
  ];

  for (const status of statuses) {
    await prisma.propertyStatus.upsert({
      where: { code: status.code },
      update: {},
      create: status,
    });
  }
}

async function seedAdminUser() {
  const email = 'admin@c21.com';

  const roleAdmin = await prisma.role.findUnique({
    where: { code: 'ADMIN' },
  });

  if (!roleAdmin) {
    throw new Error('Role ADMIN no existe, corre seedRoles primero');
  }

  const exists = await prisma.user.findUnique({ where: { email } });

  if (!exists) {
    const hashed = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
      data: {
        name: 'Admin',
        email,
        password: hashed,
        roleId: roleAdmin.id,
      },
    });

    console.log('Usuario admin creado:', email, '/ pass: admin123');
  } else {
    console.log('Usuario admin ya existe');
  }
}

async function main() {
  await seedRoles();
  await seedCurrencies();
  await seedPropertyTypes();
  await seedPropertyStatuses();
  await seedAdminUser();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
