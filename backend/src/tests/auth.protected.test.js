const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

describe("Protected Route - JWT Authorization", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "User",
        email: "user@test.com",
        password: "123456",
        role: "user"
      });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "user@test.com",
        password: "123456"
      });

    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test("should deny access without token", async () => {
    const response = await request(app)
      .get("/api/protected");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Access denied");
  });

  test("should allow access with valid token", async () => {
    const response = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Protected content");
  });
});
