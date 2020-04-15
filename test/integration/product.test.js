const request = require("supertest");
const mongoose = require("mongoose");
const { Shipping } = require("../../model/shipping");
const { Category } = require("../../model/category");
const { Store } = require("../../model/store");
const { Product } = require("../../model/product");
const { User } = require("../../model/user");
let objectId;
let server;
let store;
let cat;
let shipping;
let product;
let token;
let payload;

describe("/api/products", () => {
  beforeEach(async () => {
    server = require("../../index");
    objectId = mongoose.Types.ObjectId();

    token = new User().genAuthToken();
    cat = new Category({
      title: "sport"
    });
    await cat.save();
    shipping = new Shipping({
      type: "Domestic shipping"
    });
    await shipping.save();
    store = new Store({
      name: "mystore",
      contact: "0201348856",
      address: "pt64e",
      account: "myaccount",
      country: "mycountry",
      owner: {
        email: "umarabanga78@gmail.com",
        profile: "myprofile",
        name: "myname"
      },
      description: "mydesc"
    });
    await store.save();

    product = new Product({
      name: "proname",
      price: 45,
      quantity: 690,
      store: {
        _id: objectId,
        name: "mystore"
      },
      category: cat,
      shipping: shipping,
      description: "mydesc",
      profile1: "pro1",
      profile2: "pro2",
      profile3: "pro3",
      profile4: "pro"
    });
    await product.save();

    payload = {
      name: "proname",
      price: 56,
      quantity: 100,
      store: "umarabanga78@gmail.com",
      categoryId: cat._id,
      shippingId: shipping._id
    };
  });

  afterEach(async () => {
    await server.close();
    await Store.remove({});
    await Category.remove({});
    await Shipping.remove({});
  });

  describe("get", () => {
    it("should return with status 200 with products", async () => {
      const res = await request(server).get("/api/products");
      expect(res.status).toBe(200);
    });
  });

  describe("get/:id", () => {
    it("should return with status 400 if objectid is invalid", async () => {
      objectId = "yrskse344";
      const res = await request(server).get(`/api/products/${objectId}`);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if product is not available", async () => {
      const res = await request(server).get(`/api/products/${objectId}`);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if product is  available", async () => {
      objectId = product._id;
      const res = await request(server).get(`/api/products/${objectId}`);
      expect(res.status).toBe(200);
    });
  });

  describe("delete/:id", () => {
    it("should return with status 400 if objectid is not valid", async () => {
      objectId = "64hdhe3";
      const res = await request(server).delete(`/api/products/${objectId}`);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if product is not available", async () => {
      const res = await request(server).delete(`/api/products/${objectId}`);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if product is available", async () => {
      objectId = product._id;
      const res = await request(server).delete(`/api/products/${objectId}`);
      expect(res.status).toBe(200);
    });
  });

  describe("post", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server)
        .post("/api/products")
        .send(payload);
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if logged in but data posted not valid", async () => {
      payload.shippingId = "56hhsu6";
      const res = await request(server)
        .post("/api/products")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if logged in but shipping not available", async () => {
      payload.shippingId = objectId;
      const res = await request(server)
        .post("/api/products")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return with status 404 if logged in but category not available", async () => {
      payload.categoryId = objectId;
      const res = await request(server)
        .post("/api/products")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return with status 404 if logged in but store not available", async () => {
      payload.store = "umar@gmail.com";
      const res = await request(server)
        .post("/api/products")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if logged in and valid data posted", async () => {
      const res = await request(server)
        .post("/api/products")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(200);
    });
  });

  describe("put", () => {
    it("should return with status 401 if not logged in", async () => {
      objectId = product._id;
      const res = await request(server)
        .put(`/api/products/${objectId}`)
        .send(payload);
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if  logged in but objectid is not valid", async () => {
      objectId = "gdg63nsk";
      const res = await request(server)
        .put(`/api/products/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(400);
    });
    it("should return with status 400 if  logged in but invalid data posted", async () => {
      objectId = product._id;
      payload.shippingId = "45";
      const res = await request(server)
        .put(`/api/products/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if  logged in but product is not available", async () => {
      const res = await request(server)
        .put(`/api/products/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return with status 404 if  logged in but shipping type not available", async () => {
      payload.shippingId = objectId;
      objectId = product._id;
      const res = await request(server)
        .put(`/api/products/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return with status 404 if  logged in but category not available", async () => {
      payload.categoryId = objectId;
      objectId = product._id;
      const res = await request(server)
        .put(`/api/products/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return with status 404 if  logged in but store not available", async () => {
      objectId = product._id;
      payload.store = "umar@gmail.com";
      const res = await request(server)
        .put(`/api/products/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if  logged in and all data posted valid", async () => {
      objectId = product._id;
      const res = await request(server)
        .put(`/api/products/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(200);
    });
  });

  describe("get/:product/:id", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).get(
        `/api/products/product/${objectId}`
      );
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if logged in but objectid invalid", async () => {
      objectId = "54t889e";
      const res = await request(server)
        .get(`/api/products/product/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return with status 200 if logged in and objectid valid", async () => {
      objectId = objectId;
      const res = await request(server)
        .get(`/api/products/product/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });
});
