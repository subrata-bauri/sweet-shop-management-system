const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

describe("Auth API - Register", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test("should not allow duplicate email registration", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "User",
        email: "user@test.com",
        password: "123456",
        role: "user"
      });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "user@test.com",
        password: "abcdef",
        role: "user"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Email already exists");
  });

});
