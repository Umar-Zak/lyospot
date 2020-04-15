const request = require("supertest");
const mongoose = require("mongoose");
const { Store } = require("../../model/store");
const { User } = require("../../model/user");
let server;
let token;
let objectId;
let store;
let payload;
describe("/api/store", () => {
  beforeEach(async () => {
    payload = {
      name: "mystore",
      address: "myaddress",
      contact: "mycontact",
      account: "myaccount",
      country: "mycountry",
      owner: "umarabanga78@gmail.com",
      description: "mydesc"
    };
    server = require("../../index");
    store = new Store({
      name: "mystore",
      address: "myaddress",
      contact: "mycontact",
      account: "myaccount",
      country: "mycountry",
      owner: {
        _id: mongoose.Types.ObjectId(),
        name: "myname",
        profile: "myprofile",
        email: "umarabanga78@gmail.com"
      },
      description: "mydesc"
    });
    await store.save();
    const user = new User({
      email: "umarabanga78@gmail.com",
      password: "0201348856",
      name: "myname"
    });
    token = user.genAuthToken();
    await user.save();
    objectId = mongoose.Types.ObjectId();
  });

  afterEach(async () => {
    await server.close();
    await Store.remove({});
  });

  describe("get", () => {
    it("it should return 401 if not logged in", async () => {
      const res = await request(server).get("/api/store");
      expect(res.status).toBe(401);
    });
    it("it should return 403 if logged in but not an admin", async () => {
      const res = await request(server)
        .get("/api/store")
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    it("it should return 200 if logged in and an admin", async () => {
      token = new User({ isAdmin: true }).genAuthToken();
      const res = await request(server)
        .get("/api/store")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe("get/:id", () => {
    it("should return a status 400 if objectid is not valid", async () => {
      objectId = "64hdjd";
      const res = await request(server).get(`/api/store/${objectId}`);
      expect(res.status).toBe(400);
    });
    it("should return a status 404 if store is not available", async () => {
      const res = await request(server).get(`/api/store/${objectId}`);
      expect(res.status).toBe(404);
    });
    it("should return a status 200 if store available", async () => {
      objectId = store._id;
      const res = await request(server).get(`/api/store/${objectId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name");
    });
  });

  describe("post", () => {
    it("should return 401 if not logged in", async () => {
      const res = await request(server)
        .post("/api/store")
        .send(payload);
      expect(res.status).toBe(401);
    });
    it("should return 400 if logged in but request contains bad data", async () => {
      delete payload.name;
      const res = await request(server)
        .post("/api/store")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(400);
    });
    it("should return 404 if logged in and user not available", async () => {
      payload.owner = "umar@gmail.com";
      const res = await request(server)
        .post("/api/store")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return 200 if logged in and user valid", async () => {
      const res = await request(server)
        .post("/api/store")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(200);
    });
  });

  describe("put", () => {
    it("should return 401 if not logged in", async () => {
      const res = await request(server)
        .put(`/api/store/${objectId}`)
        .send(payload);
      expect(res.status).toBe(401);
    });
    it("should return 400 if logged in but objectId invalid", async () => {
      objectId = "ger637";
      const res = await request(server)
        .put(`/api/store/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(400);
    });
    it("should return 400 if logged in but data invalid", async () => {
      delete payload.name;
      const res = await request(server)
        .put(`/api/store/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(400);
    });
    it("should return 404 if logged in but store unavailable", async () => {
      const res = await request(server)
        .put(`/api/store/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return 404 if logged in and valid data but user unavailable", async () => {
      payload.owner = "umar@gmail.com";
      const res = await request(server)
        .put(`/api/store/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return 200 if logged in and valid data", async () => {
      objectId = store._id;
      const res = await request(server)
        .put(`/api/store/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(200);
    });
  });

  describe("delete/:d", () => {
    it("should return 401 if not logged in", async () => {
      const res = await request(server).delete(`/api/store/${objectId}`);
      expect(res.status).toBe(401);
    });
    it("should return 400 if logged in but objectid invalid", async () => {
      objectId = "53637dd";
      const res = await request(server)
        .delete(`/api/store/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return 404 if logged in but store not available", async () => {
      const res = await request(server)
        .delete(`/api/store/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return 200 if logged in and store available", async () => {
      objectId = store._id;
      const res = await request(server)
        .delete(`/api/store/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });
  describe("post/follow", () => {
    it("should return 401 if not logged in ", async () => {
      const res = await request(server)
        .post("/api/store/follow")
        .send({ store: objectId, user: "umarabanga78@gmail.com" });
      expect(res.status).toBe(401);
    });
    it("should return 400 if logged in but objectId invalid ", async () => {
      objectId = "53hhwkd";
      const res = await request(server)
        .post("/api/store/follow")
        .set("x-auth-token", token)
        .send({ store: objectId, user: "umarabanga78@gmail.com" });
      expect(res.status).toBe(400);
    });
    it("should return 400 if logged in but email invalid ", async () => {
      const res = await request(server)
        .post("/api/store/follow")
        .set("x-auth-token", token)
        .send({ store: objectId, user: "umarabanga78" });
      expect(res.status).toBe(400);
    });
    it("should return 404 if logged in but store not available ", async () => {
      const res = await request(server)
        .post("/api/store/follow")
        .set("x-auth-token", token)
        .send({ store: objectId, user: "umarabanga78@gmail.com" });
      expect(res.status).toBe(404);
    });
    it("should return 200 if logged in and data valid ", async () => {
      objectId = store._id;
      const res = await request(server)
        .post("/api/store/follow")
        .set("x-auth-token", token)
        .send({ store: objectId, user: "umarabanga78@gmail.com" });
      expect(res.status).toBe(200);
    });
  });

  describe("/profile", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server)
        .post("/api/store/profile")
        .send({ email: "umarabanga78@gmail.com" });
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if logged in but invalid data posted", async () => {
      const res = await request(server)
        .post("/api/store/profile")
        .set("x-auth-token", token)
        .send({});
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if logged in but store not available", async () => {
      const res = await request(server)
        .post("/api/store/profile")
        .set("x-auth-token", token)
        .send({ email: "umar@gmail.com" });
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if logged in and store available", async () => {
      const res = await request(server)
        .post("/api/store/profile")
        .set("x-auth-token", token)
        .send({ email: "umarabanga78@gmail.com" });
      expect(res.status).toBe(200);
    });
  });
});
