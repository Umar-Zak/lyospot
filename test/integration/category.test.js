const request = require("supertest");
const { Category } = require("../../model/category");
const { User } = require("../../model/user");
const mongoose = require("mongoose");

let objectId;
let server;
let cat;
let token;
describe("/api/categories", () => {
  beforeEach(async () => {
    server = require("../../index");
    cat = new Category({
      title: "Food"
    });
    await cat.save();
    objectId = mongoose.Types.ObjectId();
    token = new User().genAuthToken();
  });

  afterEach(async () => {
    await server.close();
    await Category.remove({});
  });

  describe("get", () => {
    it("should return 200 with data", async () => {
      const res = await request(server).get("/api/categories");
      expect(res.status).toBe(200);
    });
  });

  describe("get/:id", () => {
    it("should return 400 if objectid is not valid", async () => {
      objectId = "64ydsjd";
      const res = await request(server).get(`/api/categories/${objectId}`);
      expect(res.status).toBe(400);
    });
    it("should return 404 if category not available", async () => {
      const res = await request(server).get(`/api/categories/${objectId}`);
      expect(res.status).toBe(404);
    });
    it("should return 200 if category available", async () => {
      objectId = cat._id;
      const res = await request(server).get(`/api/categories/${objectId}`);
      expect(res.status).toBe(200);
    });
  });

  describe("post", () => {
    it("should return with status 400 if bad data posted", async () => {
      const res = await request(server)
        .post("/api/categories")
        .send({});
      expect(res.status).toBe(400);
    });
    it("should return with status 200 if valid data posted", async () => {
      const res = await request(server)
        .post("/api/categories")
        .send({ title: "Food & Pleasure" });
      expect(res.status).toBe(200);
    });
  });

  describe("put", () => {
    it("should return with status 400 if title not posted", async () => {
      const res = await request(server)
        .put(`/api/categories/${objectId}`)
        .send({});
      expect(res.status).toBe(400);
    });
    it("should return with status 400 if objectid is not valid", async () => {
      objectId = "64yrys";
      const res = await request(server)
        .put(`/api/categories/${objectId}`)
        .send({ title: "Food & Life" });
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if category not available", async () => {
      const res = await request(server)
        .put(`/api/categories/${objectId}`)
        .send({ title: "Food & Life" });
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if category available and title posted", async () => {
      objectId = cat._id;
      const res = await request(server)
        .put(`/api/categories/${objectId}`)
        .send({ title: "Category one" });
      expect(res.status).toBe(200);
    });
  });

  describe("delete/:id", () => {
    it("should return with status 400 if objetid is not valid", async () => {
      objectId = "5uywu8";
      const res = await request(server).delete(`/api/categories/${objectId}`);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if category is not available", async () => {
      const res = await request(server).delete(`/api/categories/${objectId}`);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if category is available", async () => {
      objectId = cat._id;
      const res = await request(server).delete(`/api/categories/${objectId}`);
      expect(res.status).toBe(200);
    });
  });
});
