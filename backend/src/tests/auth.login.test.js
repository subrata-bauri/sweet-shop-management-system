const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

describe("Auth API - Login", () => {

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test("should login with correct credentials and return token", async () => {

  await request(app)
    .post("/api/auth/register")
    .send({
      name: "User",
      email: "user@test.com",
      password: "123456",
      role: "user"
    });

  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "user@test.com",
      password: "123456"
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("Login successful");
  expect(response.body).toHaveProperty("token");
});


  test("should fail login with wrong password", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "user@test.com",
        password: "wrongpassword"
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

});
