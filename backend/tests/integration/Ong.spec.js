const request = require("supertest");
const app = require("../../src/app");
const connection = require("../../src/database/connection");

describe("Ong", () => {
  beforeEach(async() => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("should be able to create a new Ong", async () => {
    const response = await request(app)
      .post("/ongs")
      .send({
        name: "APAD 3",
        email: "email@email.com",
        whatsapp: "1192932323",
        city: "São Paulo",
        uf: "sp"
      });

      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toHaveLength(8);
  });
});