const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

describe("Sweets API - Get All Sweets", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email: "admin@test.com",
        password: "123456",
        role: "admin"
      });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",
        password: "123456"
      });

    token = loginRes.body.token;

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Barfi",
        category: "Milk-based",
        price: 15,
        quantity: 30
      });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test("should return list of sweets for authenticated user", async () => {
    const response = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("name");
  });
});
