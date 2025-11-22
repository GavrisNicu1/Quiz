import { PrismaClient } from "@prisma/client";

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

  // 2. Creăm un User Admin și un Client (ca să te poți loga)
  // Notă: Parolele ar trebui hash-uite în mod real (bcrypt), aici punem text simplu doar pt demo
  await prisma.user.createMany({
    data: [
      {
        email: "admin@quizshop.local",
        name: "Admin User",
        passwordHash: "$2b$10$P.DummyHashForAdmin123", // Parola simulată
        role: "ADMIN",
      },
      {
        email: "client@quizshop.local",
        name: "Client User",
        passwordHash: "$2b$10$P.DummyHashForClient123", // Parola simulată
        role: "USER",
      },
    ],
  });

  console.log("👤 Userii au fost creați.");

  // 3. Creăm Produsele cu Categoriile și Subcategoriile cerute
  await prisma.product.createMany({
    data: [
      // --- CATEGORIA: ELECTROCASNICE ---
      {
        name: "Smart TV Samsung 4K",
        description: "Televizor Ultra HD, diagonală 138 cm, funcții Smart.",
        price: 2499.99,
        stock: 10,
        imageUrl: "/uploads/tv_samsung.jpg",
        category: "Electrocasnice",
        subcategory: "TV",
      },
      {
        name: "iPhone 15 Pro",
        description: "Telefon mobil Apple, 256GB, Titan Natural.",
        price: 5999.99,
        stock: 5,
        imageUrl: "/uploads/iphone15.jpg",
        category: "Electrocasnice",
        subcategory: "Telefoane",
      },

      // --- CATEGORIA: HAINE ---
      {
        name: "Tricou Polo Ralph Lauren",
        description: "Tricou din bumbac 100%, culoare bleumarin, mărimea L.",
        price: 350.00,
        stock: 20,
        imageUrl: "/uploads/tricou_polo.jpg",
        category: "Haine",
        subcategory: "Imbracaminte",
      },
      {
        name: "Adidasi Nike Air Max",
        description: "Încălțăminte sport pentru alergare, foarte comozi.",
        price: 450.00,
        stock: 15,
        imageUrl: "/uploads/nike_air.jpg",
        category: "Haine",
        subcategory: "Incaltaminte",
      },

      // --- CATEGORIA: JUCARII ---
      {
        name: "Puzzle 1000 Piese Peisaj",
        description: "Puzzle complex cu peisaj montan, ideal pentru relaxare.",
        price: 89.00,
        stock: 30,
        imageUrl: "/uploads/puzzle.jpg",
        category: "Jucarii",
        subcategory: "Puzzle",
      },
      {
        name: "Turn Montessori Lemn",
        description: "Jucărie educativă din lemn pentru dezvoltarea motricității.",
        price: 120.00,
        stock: 12,
        imageUrl: "/uploads/montessori.jpg",
        category: "Jucarii",
        subcategory: "Montessori",
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