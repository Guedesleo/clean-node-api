import app from "../config/app";
import request from "supertest";

describe("Cors Middleware", () => {
  test("Should enalbe Cors", async () => {
    app.get("/test_cors", (req, resp) => {
      resp.send();
    });
    await request(app)
      .get("/test_cors")
      .expect("access-controll-allow-origin", "*")
      .expect("access-controll-allow-methods", "*")
      .expect("access-controll-allow-headers", "*");
  });
});
