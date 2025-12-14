const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

describe("Sweets API - Update Sweet (Admin Only)", () => {
  let adminToken;
  let sweetId;

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");

    // Register admin
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

    adminToken = loginRes.body.token;

    // Create sweet
    const sweetRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Peda",
        category: "Milk-based",
        price: 10,
        quantity: 20
      });

    // Fetch sweet to get ID
    const sweets = await mongoose.connection.db
      .collection("sweets")
      .find()
      .toArray();

    sweetId = sweets[0]._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test("should allow admin to update a sweet", async () => {
    const response = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        price: 15,
        quantity: 40
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Sweet updated successfully");

    const updatedSweet = await mongoose.connection.db
      .collection("sweets")
      .findOne({ _id: new mongoose.Types.ObjectId(sweetId) });

    expect(updatedSweet.price).toBe(15);
    expect(updatedSweet.quantity).toBe(40);
  });
});
