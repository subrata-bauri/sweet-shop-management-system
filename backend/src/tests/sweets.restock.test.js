const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

describe("Inventory - Restock Sweet (Admin Only)", () => {
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
    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Soan Papdi",
        category: "Dry",
        price: 10,
        quantity: 5
      });

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

  test("should allow admin to restock sweet quantity", async () => {
    const response = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 10 });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Sweet restocked successfully");

    const updatedSweet = await mongoose.connection.db
      .collection("sweets")
      .findOne({ _id: new mongoose.Types.ObjectId(sweetId) });

    expect(updatedSweet.quantity).toBe(15);
  });

  test("should not allow restocking with zero or negative amount", async () => {
  const response = await request(app)
    .post(`/api/sweets/${sweetId}/restock`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ amount: -5 });

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Invalid restock amount");

  const sweetAfterAttempt = await mongoose.connection.db
    .collection("sweets")
    .findOne({ _id: new mongoose.Types.ObjectId(sweetId) });

  expect(sweetAfterAttempt.quantity).toBe(15);
});

});
