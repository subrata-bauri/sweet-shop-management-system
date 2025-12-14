const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

describe("Inventory - Purchase Sweet", () => {
  let token;
  let sweetId;

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");

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

    token = loginRes.body.token;

    // Register admin
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email: "admin@test.com",
        password: "123456",
        role: "admin"
      });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",
        password: "123456"
      });

    const adminToken = adminLogin.body.token;

    // Create sweet with quantity = 5
    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Jalebi",
        category: "Fried",
        price: 6,
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

  test("should reduce sweet quantity by 1 when purchased", async () => {
    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Sweet purchased successfully");

    const updatedSweet = await mongoose.connection.db
      .collection("sweets")
      .findOne({ _id: new mongoose.Types.ObjectId(sweetId) });

    expect(updatedSweet.quantity).toBe(4);
  });

  test("should not allow purchase when sweet is out of stock", async () => {

  await mongoose.connection.db
    .collection("sweets")
    .updateOne(
      { _id: new mongoose.Types.ObjectId(sweetId) },
      { $set: { quantity: 0 } }
    );

  const response = await request(app)
    .post(`/api/sweets/${sweetId}/purchase`)
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Sweet out of stock");

  const sweetAfterAttempt = await mongoose.connection.db
    .collection("sweets")
    .findOne({ _id: new mongoose.Types.ObjectId(sweetId) });

  expect(sweetAfterAttempt.quantity).toBe(0);
});

});
