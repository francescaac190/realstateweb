import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function seedRoles() {
  const roles = [
    { code: 'ADMIN', name: 'Administrador' },
    { code: 'AGENT', name: 'Agente' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name },
      create: role,
    });
  }
}

async function seedCurrencies() {
  const currencies = [
    { code: 'USD', name: 'Dolar estadounidense' },
    { code: 'BOB', name: 'Boliviano' },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: { name: currency.name },
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
      update: { name: type.name },
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
      update: { name: status.name },
      create: status,
    });
  }
}

async function seedCitiesAndZones() {
  const cities = [
    { name: 'Santa Cruz', zones: ['Centro', 'Equipetrol'] },
    { name: 'La Paz', zones: ['Centro', 'Zona Sur'] },
    { name: 'Cochabamba', zones: ['Centro', 'Queru Queru'] },
  ];

  for (const city of cities) {
    const cityRecord = await prisma.city.upsert({
      where: { name: city.name },
      update: {},
      create: { name: city.name },
    });

    for (const zoneName of city.zones) {
      await prisma.zone.upsert({
        where: {
          cityId_name: {
            cityId: cityRecord.id,
            name: zoneName,
          },
        },
        update: {},
        create: { name: zoneName, cityId: cityRecord.id },
      });
    }
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
  if (exists) {
    console.log('Usuario admin ya existe');
    return;
  }

  const hashed = await bcrypt.hash('admin123', 10);
  const username = email.split('@')[0];
  const city = await prisma.city.findFirst();

  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'C21',
      email,
      username,
      passwordHash: hashed,
      roleId: roleAdmin.id,
      cityId: city?.id,
      status: 'ACTIVE',
      isVerified: true,
    },
  });

  console.log('Usuario admin creado:', email, '/ pass: admin123');
}

async function main() {
  await seedRoles();
  await seedCurrencies();
  await seedPropertyTypes();
  await seedPropertyStatuses();
  await seedCitiesAndZones();
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
