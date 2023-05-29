const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");

beforeEach(async () => {
  await mongoose.connect(process.env.DB_HOST);
});

afterEach(async () => {
  await mongoose.connection.close();
});

TEST_ID = "6475198b737ba2aa57385d81";

describe("GET /api/heroes", () => {
  it("should return all heroes", async () => {
    const res = await request(app).get("/api/heroes");
    expect(res.statusCode).toBe(200);
    expect(res.body.heroes[0].nickname).toBe("Superman");
  });
  it("total field must correspond heroes array length", async () => {
    const res = await request(app).get("/api/heroes");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(res.body.heroes.length);
  });
});

describe("GET /api/heroes/:id", () => {
  it("shouls return one hero info by id", async () => {
    const res = await request(app).get(`/api/heroes/${TEST_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.nickname).toBe("Superman");
  });
  it("should return error with message 'There is no such Id'", async () => {
    const res = await request(app).get(`/api/heroes/64747044109a855933805eb5`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("There is no such Id");
  });
  it("should return error with message '64747044109a855933805eb is not valid id'", async () => {
    const res = await request(app).get(`/api/heroes/64747044109a855933805eb`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("64747044109a855933805eb is not valid id");
  });
});

describe("POST  /api/heroes", () => {
  const body = {
    nickname: "Superman",
    real_name: " Clark Kent",
    origin_description:
      "he was born Kal-El on the planet Krypton, before being rocketed to\r\nEarth as an infant by his scientist father Jor-El, moments before Krypton's destruction…\r\nsuperpowers: solar energy absorption and healing factor, solar flare and heat vision,\r\nsolar invulnerability, flight…",
    catch_phrase:
      "“Look, up in the sky, it's a bird, it's a plane, it's Superman!”",
    images:
      "https://res.cloudinary.com/dh5uzghpd/image/upload/v1685352516/heroes/ocyqav3irpqnn1hfqusa.png",
  };
  const filePath = path.join(__dirname, "./test.png");
  //   it("should create a new hero card and return created card with info", async () => {
  //     const res = await request(app)
  //       .post("/api/heroes")
  //       .field("nickname", body.nickname)
  //       .field("real_name", body.real_name)
  //       .field("origin_description", body.origin_description)
  //       .field("catch_phrase", body.catch_phrase)
  //       .attach("images", filePath);
  //     expect(res.status).toBe(201);
  //     expect(res.body.nickname).toBe(body.nickname);
  //     expect(res.body.real_name).toBe(body.real_name);
  //     expect(res.body.origin_description).toBe(body.origin_description);
  //     expect(res.body.catch_phrase).toBe(body.catch_phrase);
  //   });
  it("should return error of validation body failed (missing required fields or invalid data)", async () => {
    const res = await request(app)
      .post("/api/heroes")
      .field("real_name", body.real_name)
      .field("origin_description", body.origin_description)
      .field("catch_phrase", body.catch_phrase)
      .attach("images", filePath);
    expect(res.status).toBe(400);
    expect(res.body.error).toStrictEqual(["Path `nickname` is required."]);
  });
  it("should return error of validation body failed with message 'Image is required'", async () => {
    const res = await request(app)
      .post("/api/heroes")
      .field("nickname", body.nickname)
      .field("real_name", body.real_name)
      .field("origin_description", body.origin_description)
      .field("catch_phrase", body.catch_phrase);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Image is required");
  });
});

describe("PATCH  /api/heroes/:id", () => {
  it("should return object with changed fields", async () => {
    const res = await request(app)
      .patch(`/api/heroes/${TEST_ID}`)
      .field("nickname", "Spider-Man");

    expect(res.status).toBe(200);
    expect(res.body.nickname).toBe("Spider-Man");
  });
});
