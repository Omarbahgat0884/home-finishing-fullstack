import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Step 1: Create Service Categories
  const paintingCategory = await prisma.serviceCategory.create({
    data: {
      name: 'Painting',
      description: 'Wall and ceiling painting services with various finishes',
    },
  });

  const tilingCategory = await prisma.serviceCategory.create({
    data: {
      name: 'Tiling',
      description: 'Floor and wall tile installation and repair services',
    },
  });

  const electricalCategory = await prisma.serviceCategory.create({
    data: {
      name: 'Electrical',
      description: 'Wiring, lighting installation, and electrical maintenance',
    },
  });

  const carpentryCategory = await prisma.serviceCategory.create({
    data: {
      name: 'Carpentry',
      description: 'Woodwork, door installation, and custom furniture building',
    },
  });

  // Step 2: Create Services
  const services = await prisma.service.createMany({
    data: [
      {
        name: 'Interior Wall Painting',
        description: 'Two coats with putty and primer included',
        price: 2500,
        categoryId: paintingCategory.id,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSItpNahcbA4k_-_aDD8abyaRLrLritLb3a-Q&s',
      },
      {
        name: 'Ceramic Tiling - Floor',
        description: 'Standard ceramic tiles with grout',
        price: 4000,
        categoryId: tilingCategory.id,
        imageUrl: 'https://images.pexels.com/photos/7245511/pexels-photo-7245511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      {
        name: 'Electrical Wiring - Full Apartment',
        description: 'Full wiring and breaker installation for 3-bedroom flat',
        price: 12000,
        categoryId: electricalCategory.id,
        imageUrl: 'https://cdn.prod.website-files.com/643dd13153ce80ea0a9ceae9/66bcfa65cd99cbcce70e919c_Untitled%20(98).jpg',
      },
      {
        name: 'Custom Kitchen Cabinets',
        description: 'Made from MDF with waterproof laminate',
        price: 15000,
        categoryId: carpentryCategory.id,
        imageUrl: 'https://21stcenturycd.com/wp-content/uploads/2025/02/Aspen-kitchen-2-1.webp',
      },
    ],
  });

  // Step 3: Create Contractors
  const contractors = await prisma.contractor.createMany({
    data: [
      {
        name: 'Omar Bahgat',
        phone: '01012345678',
        email: 'omar@gmail.com',
        specialization: 'Painting',
        rating: 4.6,
      },
      {
        name: 'Mostafa Khaled',
        phone: '01122334455',
        email: 'mostafa@finishing.com',
        specialization: 'Tiling',
        rating: 4.3,
      },
      {
        name: 'Nader Fouad',
        phone: '01233445566',
        email: 'nader.electric@finishing.com',
        specialization: 'Electrical',
        rating: 4.8,
      },
      {
        name: 'Mohamed Magdy',
        phone: '01099887766',
        email: 'mohamed.wood@finishing.com',
        specialization: 'Carpentry',
        rating: 4.5,
      },
    ],
  });

  // Step 4: Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Omar Bahgat',
      email: 'omar.bahgat@example.com',
      phone: '01067891234',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Salma Youssef',
      email: 'salma.youssef@example.com',
      phone: '01178901234',
    },
  });

  // Step 5: Create Bookings
  const service = await prisma.service.findFirst({ where: { name: 'Interior Wall Painting' } });
  const contractor = await prisma.contractor.findFirst({ where: { specialization: 'Painting' } });

  if (service && contractor) {
    await prisma.booking.create({
      data: {
        serviceId: service.id,
        customerId: customer1.id,
        contractorId: contractor.id,
        date: new Date('2025-06-01T10:00:00Z'),
        status: 'CONFIRMED',
      },
    });
  }
}

main()
  .then(() => {
    console.log('🌱 Seed complete');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
