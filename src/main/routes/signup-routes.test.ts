import app from "../config/app";
import request from "supertest";

describe("Signup Routes", () => {
  test("Should return an account on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Leonardo",
        email: "leonardo.guedes@gmail.com",
        password: "123",
        passwordConfirmation: "123",
      })
      .expect(200);
  });
});
