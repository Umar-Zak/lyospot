const request = require("supertest");
const mongoose = require("mongoose");
const { Shipping } = require("../../model/shipping");

let server;
let objectId;
let shipping;

describe("/api/shipping", () => {
  beforeEach(async () => {
    server = require("../../index");
    objectId = mongoose.Types.ObjectId();
    shipping = new Shipping({ type: "domestic shipping" });
    await shipping.save();
  });

  afterEach(async () => {
    await server.close();
    await Shipping.remove({});
  });

  describe("get", () => {
    it("should return with status 200 with all shippings present", async () => {
      const res = await request(server).get("/api/shipping");
      expect(res.status).toBe(200);
    });
  });

  describe("get/:id", () => {
    it("should return 400 if objectid is not valid", async () => {
      objectId = "6rhhjd";
      const res = await request(server).get(`/api/shipping/${objectId}`);
      expect(res.status).toBe(400);
    });
    it("should return 404 if shipping is not available", async () => {
      const res = await request(server).get(`/api/shipping/${objectId}`);
      expect(res.status).toBe(404);
    });
    it("should return 200 if shipping is available", async () => {
      objectId = shipping._id;
      const res = await request(server).get(`/api/shipping/${objectId}`);
      expect(res.status).toBe(200);
    });
  });

  describe("post", () => {
    it("should return with status 400 if shipping type is not posted", async () => {
      const res = await request(server)
        .post("/api/shipping")
        .send({});
      expect(res.status).toBe(400);
    });
    it("should return with status 200 if shipping type is  posted", async () => {
      const res = await request(server)
        .post("/api/shipping")
        .send({ type: "Domestic" });
      expect(res.status).toBe(200);
    });
  });

  describe("put", () => {
    it("should return 400 if objectid invalid", async () => {
      objectId = "6734ys";
      const res = await request(server)
        .put(`/api/shipping/${objectId}`)
        .send({ type: "Overseas" });
      expect(res.status).toBe(400);
    });
    it("should return 400 if shipping type is not posted", async () => {
      const res = await request(server)
        .put(`/api/shipping/${objectId}`)
        .send();
      expect(res.status).toBe(400);
    });
    it("should return 404 if shipping is not available", async () => {
      const res = await request(server)
        .put(`/api/shipping/${objectId}`)
        .send({ type: "International" });
      expect(res.status).toBe(404);
    });
    it("should return 200 if shipping is  available", async () => {
      objectId = shipping._id;
      const res = await request(server)
        .put(`/api/shipping/${objectId}`)
        .send({ type: "International" });
      expect(res.status).toBe(200);
    });
  });

  describe("delete/:id", () => {
    it("should return 400 if objectid is invalid", async () => {
      objectId = "64hhew";
      const res = await request(server).delete(`/api/shipping/${objectId}`);
      expect(res.status).toBe(400);
    });
    it("should return 404 if shipping is not available", async () => {
      const res = await request(server).delete(`/api/shipping/${objectId}`);
      expect(res.status).toBe(404);
    });
    it("should return 200 if shipping is  available", async () => {
      objectId = shipping._id;
      const res = await request(server).delete(`/api/shipping/${objectId}`);
      expect(res.status).toBe(200);
    });
  });
});
