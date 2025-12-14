const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

describe("Sweets API - Search Sweets", () => {
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
        name: "Gulab Jamun",
        category: "Milk-based",
        price: 12,
        quantity: 40
      });

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Ladoo",
        category: "Dry",
        price: 8,
        quantity: 25
      });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test("should search sweets by name", async () => {
    const response = await request(app)
      .get("/api/sweets/search?name=Gulab")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe("Gulab Jamun");
  });

  test("should search sweets by category", async () => {
  const response = await request(app)
    .get("/api/sweets/search?category=Dry")
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].category).toBe("Dry");
});

test("should search sweets by price range", async () => {
  const response = await request(app)
    .get("/api/sweets/search?minPrice=9&maxPrice=13")
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].name).toBe("Gulab Jamun");
});

});
