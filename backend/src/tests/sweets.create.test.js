const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

describe("Sweets API - Create Sweet (Admin Only)", () => {

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test("should deny sweet creation for non-admin user", async () => {

    // Register normal user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "User",
        email: "user@test.com",
        password: "123456",
        role: "user"
      });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "user@test.com",
        password: "123456"
      });

    const token = loginRes.body.token;

    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Ladoo",
        category: "Dry",
        price: 5,
        quantity: 20
      });
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Admin access required");
  });

  test("should allow sweet creation for admin user", async () => {
    // Register admin user
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

    const token = loginRes.body.token;

    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Rasgulla",
        category: "Milk-based",
        price: 10,
        quantity: 50
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Sweet added successfully");
  });

});
