const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { Hero } = require("../models/hero");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const { MongoMemoryServer } = require("mongodb-memory-server");

TEST_ID = "6475198b737ba2aa57385d81";
NOT_VALID_ID = "6475198b737ba2aa57385d8";
MISSING_ID = "6475198b737ba2aa57385d85";
TEST_HERO_NICKNAME = "Superman";
FILE_PATH = path.join(__dirname, "./test.png");

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
  await Hero.create({
    _id: TEST_ID,
    nickname: TEST_HERO_NICKNAME,
    real_name: " Clark Kent",
    origin_description:
      "he was born Kal-El on the planet Krypton, before being rocketed to\r\nEarth as an infant by his scientist father Jor-El, moments before Krypton's destruction…\r\nsuperpowers: solar energy absorption and healing factor, solar flare and heat vision,\r\nsolar invulnerability, flight…",
    catch_phrase:
      "“Look, up in the sky, it's a bird, it's a plane, it's Superman!”",
    images:
      "https://res.cloudinary.com/dh5uzghpd/image/upload/v1685352516/heroes/ocyqav3irpqnn1hfqusa.png",
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("GET /api/heroes", () => {
  it("should return all heroes", async () => {
    const res = await request(app).get("/api/heroes");
    expect(res.statusCode).toBe(200);
    expect(res.body.heroes[0].nickname).toBe(TEST_HERO_NICKNAME);
  });
  it("total field must correspond heroes array length", async () => {
    const res = await request(app).get("/api/heroes");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(res.body.heroes.length);
  });
  it("should return status 404 'not found', when collection is empty or request with errors", async () => {
    const res = await request(app).get("/api/heroe");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Not found");
  });
});

describe("GET /api/heroes/:id", () => {
  it("shouls return one hero info by id", async () => {
    const res = await request(app).get(`/api/heroes/${TEST_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.nickname).toBe(TEST_HERO_NICKNAME);
  });
  it("should return error with message 'There is no such Id'", async () => {
    const res = await request(app).get(`/api/heroes/${MISSING_ID}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("There is no such Id");
  });
  it("should return error with message 'NOT_VALID_ID is not valid id'", async () => {
    const res = await request(app).get(`/api/heroes/${NOT_VALID_ID}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(`${NOT_VALID_ID} is not valid id`);
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

  it("should create a new hero card and return created card with info", async () => {
    const res = await request(app)
      .post("/api/heroes")
      .field("nickname", body.nickname)
      .field("real_name", body.real_name)
      .field("origin_description", body.origin_description)
      .field("catch_phrase", body.catch_phrase)
      .attach("images", FILE_PATH);
    expect(res.status).toBe(201);
    expect(res.body.nickname).toBe(body.nickname);
    expect(res.body.real_name).toBe(body.real_name);
    expect(res.body.origin_description).toBe(body.origin_description);
    expect(res.body.catch_phrase).toBe(body.catch_phrase);
  });
  it("should return error of validation body failed (missing required fields or invalid data)", async () => {
    const res = await request(app)
      .post("/api/heroes")
      .field("real_name", body.real_name)
      .field("origin_description", body.origin_description)
      .field("catch_phrase", body.catch_phrase)
      .attach("images", FILE_PATH);
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
  it("should return object with changed text fields", async () => {
    const updatedHero = await Hero.findById(TEST_ID);
    const res = await request(app)
      .patch(`/api/heroes/${TEST_ID}`)
      .field("nickname", TEST_HERO_NICKNAME);

    expect(res.status).toBe(200);
    expect(res.body.nickname).toBe(TEST_HERO_NICKNAME);
    expect(res.body.images).toBe(updatedHero.images);
  });
  it("should return object with changed file field", async () => {
    const updatedHero = await Hero.findById(TEST_ID);
    const res = await request(app)
      .patch(`/api/heroes/${TEST_ID}`)
      .attach("images", FILE_PATH);
    expect(res.status).toBe(200);
    expect(res.body.nickname).toBe(TEST_HERO_NICKNAME);
    expect(res.body.images).not.toBe(updatedHero.images);
  });

  it("should return error with message 'There is no such Id'", async () => {
    const res = await request(app)
      .patch(`/api/heroes/${MISSING_ID}`)
      .field("nickname", TEST_HERO_NICKNAME);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("There is no such Id");
  });

  it("should return error with message 'NOT_VALID_ID is not valid id'", async () => {
    const res = await request(app)
      .patch(`/api/heroes/${NOT_VALID_ID}`)
      .field("nickname", TEST_HERO_NICKNAME);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(`${NOT_VALID_ID} is not valid id`);
  });
});

describe("DELETE /api/heroes/:id", () => {
  it("should return error with message 'Deleted'", async () => {
    const res = await request(app).delete(`/api/heroes/${TEST_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });

  it("should return error with message 'There is no such Id'", async () => {
    const res = await request(app).delete(`/api/heroes/${MISSING_ID}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("There is no such Id");
  });

  it("should return error with message 'NOT_VALID_ID is not valid id'", async () => {
    const res = await request(app).delete(`/api/heroes/${NOT_VALID_ID}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(`${NOT_VALID_ID} is not valid id`);
  });
});
