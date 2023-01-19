import app from "../config/app";
import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";

describe("Signup Routes", () => {
  beforeAll(async () => MongoHelper.connect(process.env.MONGO_URL));
  afterAll(async () => MongoHelper.disconnect());
  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

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
