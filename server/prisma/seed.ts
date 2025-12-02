import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  // 1. Curățăm baza de date (ștergem datele vechi)
  // Ordinea contează din cauza relațiilor (Foreign Keys)
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Datele vechi au fost șterse.");

  // 2. Creăm un User Admin și un Client (cu parole hash-uite real)
  const adminPassword = await bcrypt.hash("admin123", 10);
  const clientPassword = await bcrypt.hash("client123", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "admin@gmail.com",
        name: "Admin1",
        passwordHash: adminPassword,
        role: "ADMIN",
      },
      {
        email: "client@gmail.com",
        name: "Client User",
        passwordHash: clientPassword,
        role: "USER",
      },
    ],
  });

  console.log("👤 Userii au fost creați (admin@gmail.com / admin123).");

  // 3. Creăm Produsele cu imaginile placeholder simple
  await prisma.product.createMany({
    data: [
      {
        name: "Blugi Tommy Hilfiger",
        description: "100% Bumbac, culoare bleumarin, mărimea XL, culoate bleumarin.",
        price: 250.00,
        stock: 4,
        imageUrl: "https://placehold.co/400x300/f4d9bd/8a4f32?text=Blugi",
        category: "Electronice",
      },
      {
        name: "iPhone 17 pro max",
        description: "Iphone 17 pro max stocare 256 GB, 256GB, Titan Natural.",
        price: 7500.00,
        stock: 5,
        imageUrl: "https://placehold.co/400x300/f4d9bd/8a4f32?text=iPhone+15",
        category: "Electronice",
      },
      {
        name: "Tricou Polo Ralph Lauren",
        description: "Tricou din bumbac 100%, culoare bleumarin, mărimea L.",
        price: 250.00,
        stock: 20,
        imageUrl: "https://placehold.co/400x300/f4d9bd/8a4f32?text=Tricou",
        category: "Haine",
      },
      {
        name: "Adidasi Nike Air Max",
        description: "Încălțăminte sport pentru alergare, foarte comozi.",
        price: 450.00,
        stock: 15,
        imageUrl: "https://placehold.co/400x300/f4d9bd/8a4f32?text=Adidasi",
        category: "Incaltaminte",
      },
      {
        name: "Puzzle 1000 Piese Peisaj",
        description: "Puzzle complex cu peisaj montan, ideal pentru relaxare.",
        price: 89.00,
        stock: 30,
        imageUrl: "https://placehold.co/400x300/f4d9bd/8a4f32?text=Puzzle",
        category: "Jucarii",
      },
      {
        name: "Turn Montessori Lemn",
        description: "Jucărie educativă din lemn pentru dezvoltarea motricității.",
        price: 120.00,
        stock: 12,
        imageUrl: "https://placehold.co/400x300/f4d9bd/8a4f32?text=Montessori",
        category: "Jucarii",
      },
      {
        name: "Smart TV Samsung 4K",
        description: "Televizor Ultra HD, diagonală 138 cm, funcții Smart.",
        price: 2499.99,
        stock: 10,
        imageUrl: "https://placehold.co/400x300/f4d9bd/8a4f32?text=Smart+TV",
        category: "Electronice",
      },
    ],
  });

  console.log("📦 Produsele au fost adăugate cu succes!");
  console.log("✅ Seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });