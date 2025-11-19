import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

const products = [
  {
    name: "Laptop Ultraportabil",
    description: "Laptop de 14'' cu procesor performant și autonomie mare.",
    price: 5999.99,
    imageUrl: "https://source.unsplash.com/featured/?laptop",
    stock: 25,
  },
  {
    name: "Căști Wireless",
    description: "Căști wireless cu anulare activă a zgomotului și autonomie 30h.",
    price: 899.5,
    imageUrl: "https://source.unsplash.com/featured/?headphones",
    stock: 80,
  },
  {
    name: "Smartwatch Sport",
    description: "Smartwatch rezistent la apă cu monitorizare detaliată a activității.",
    price: 1299.0,
    imageUrl: "https://source.unsplash.com/featured/?smartwatch",
    stock: 50,
  },
];

async function main() {
  console.log("Reset tables...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("Create admin and user...");
  const admin = await prisma.user.create({
    data: {
      name: "Admin Shop",
      email: "admin@quizshop.local",
      passwordHash: await hashPassword("Admin123!"),
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Client Demo",
      email: "client@quizshop.local",
      passwordHash: await hashPassword("Client123!"),
      role: "USER",
    },
  });

  console.log("Insert products...");
  await prisma.product.createMany({ data: products });

  console.log("Seed completed", { admin: admin.email, user: user.email });
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
