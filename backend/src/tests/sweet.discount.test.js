const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

describe("GET /api/sweets with discount", () => {
  let adminToken;
  const price = 100;

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");

    // Register admin
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email: "admin@test.com",
        password: "123456",
        role: "admin",
      });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",
        password: "123456",
      });

    adminToken = loginRes.body.token;

    // Create a sweet with known price
    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Peda",
        category: "Milk-based",
        price,
        quantity: 20,
      });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return discountedPrice without changing original price", async () => {
    const res = await request(app)
      .get("/api/sweets?discount=10")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const sweet = res.body.find((s) => s.name === "Peda") || res.body[0];

    expect(sweet).toHaveProperty("price");
    expect(sweet).toHaveProperty("discountedPrice");

    expect(sweet.price).toBe(price);
    expect(sweet.discountedPrice).toBe(price - (price * 10) / 100);
  });
});
