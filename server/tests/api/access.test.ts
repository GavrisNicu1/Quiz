import request from "supertest";

import app from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { hashPassword } from "../../src/utils/password";
import { signAccessToken } from "../../src/services/tokenService";
import type { RoleType } from "../../src/types/express";

describe("Role-based access control", () => {
  const adminEmail = `admin.test.${Date.now()}@quizshop.local`;
  const userEmail = `user.test.${Date.now()}@quizshop.local`;
  let adminToken: string;
  let userToken: string;
  let adminId: string;
  let userId: string;

  beforeAll(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany({ where: { name: { startsWith: "Test" } } });
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, userEmail] } } });

    const admin = await prisma.user.create({
      data: {
        name: "Admin Test",
        email: adminEmail,
        passwordHash: await hashPassword("Admin123!"),
        role: "ADMIN",
      },
    });
    adminId = admin.id;
    adminToken = signAccessToken({ id: admin.id, email: admin.email, role: admin.role as RoleType });

    const user = await prisma.user.create({
      data: {
        name: "User Test",
        email: userEmail,
        passwordHash: await hashPassword("User123!"),
        role: "USER",
      },
    });
    userId = user.id;
    userToken = signAccessToken({ id: user.id, email: user.email, role: user.role as RoleType });
  });

  afterAll(async () => {
    await prisma.cartItem.deleteMany({ where: { userId: { in: [adminId, userId] } } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.product.deleteMany({ where: { name: { startsWith: "Test" } } });
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, userEmail] } } });
  });

  it("blocks product creation for regular users", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Test Gadget",
        description: "Un gadget de test.",
        price: 123.45,
        imageUrl: "https://example.com/test.png",
        stock: 10,
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/unauthorized/i);
  });

  it("allows admins to create products", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test Laptop",
        description: "Laptop creat de admin.",
        price: 1999.99,
        imageUrl: "https://example.com/laptop.png",
        stock: 5,
      });

    expect(response.status).toBe(201);
    expect(response.body.product).toBeDefined();
  });

  it("permite utilizatorului să plaseze o comandă și adminul să o vadă", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Watch",
        description: "Ceas pentru comanda de test",
        price: 499.99,
        imageUrl: "https://example.com/watch.png",
        stock: 3,
      },
    });

    await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId: product.id, quantity: 1 })
      .expect(201);

    const checkoutRes = await request(app)
      .post("/api/orders/checkout")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ shippingAddress: "Strada Exemplu 10, București" });

    expect(checkoutRes.status).toBe(201);
    const orderId = checkoutRes.body.order.id as string;

    const adminOrders = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(adminOrders.status).toBe(200);
    expect(adminOrders.body.orders.some((order: { id: string }) => order.id === orderId)).toBe(true);
  });
});
