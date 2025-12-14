const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

describe("Sweets API - Delete Sweet (Admin Only)", () => {
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
        name: "Kaju Katli",
        category: "Dry",
        price: 20,
        quantity: 15
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

  test("should allow admin to delete a sweet", async () => {
    const response = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Sweet deleted successfully");

    const deletedSweet = await mongoose.connection.db
      .collection("sweets")
      .findOne({ _id: new mongoose.Types.ObjectId(sweetId) });

    expect(deletedSweet).toBeNull();
  });
});
