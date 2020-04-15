const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../model/user");
const { Testimonial } = require("../../model/testimonial");

let token;
let objectId;
let server;
let testimonial;
let payload;

describe("/api/testimonial", () => {
  beforeEach(async () => {
    server = require("../../index");
    const user = new User({
      email: "umarabanga78@gmail.com",
      password: "0201348856",
      name: "umar"
    });
    await user.save();
    token = user.genAuthToken();
    testimonial = new Testimonial({
      user: {
        email: "umarabanga78@gmail.com",
        name: "Umar",
        profile: "/image"
      },
      message: "That was a good new feature added"
    });
    await testimonial.save();
    objectId = mongoose.Types.ObjectId();
    payload = {
      email: "umarabanga78@gmail.com",
      message: "That was a nice offer"
    };
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
    await Testimonial.remove({});
  });

  describe("/get", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).get("/api/testimonials");
      expect(res.status).toBe(401);
    });
    it("should return with status 200 if logged in", async () => {
      const res = await request(server)
        .get("/api/testimonials")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe("/get/:id", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).get(`/api/testimonials/${objectId}`);
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if logged in but objectid not valid", async () => {
      objectId = "tee947nd";
      const res = await request(server)
        .get(`/api/testimonials/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if logged in but testimonial not available", async () => {
      const res = await request(server)
        .get(`/api/testimonials/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if logged in and testimonial available", async () => {
      objectId = testimonial._id;
      const res = await request(server)
        .get(`/api/testimonials/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });

  describe("/post", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server)
        .post("/api/testimonials")
        .send(payload);
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if logged in but invalid data posted", async () => {
      delete payload.email;
      const res = await request(server)
        .post("/api/testimonials")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if logged in but user not available", async () => {
      payload.email = "umar@gmail.com";
      const res = await request(server)
        .post("/api/testimonials")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if logged in and user available with valid data", async () => {
      const res = await request(server)
        .post("/api/testimonials")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(200);
    });
  });
  describe("delete/:id", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).delete(`/api/testimonials/${objectId}`);
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if logged in but objectid not valid", async () => {
      objectId = "64ydhdjeu8";
      const res = await request(server)
        .delete(`/api/testimonials/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if logged in but testimonial not available", async () => {
      const res = await request(server)
        .delete(`/api/testimonials/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if logged in and testimonial available", async () => {
      objectId = testimonial._id;
      const res = await request(server)
        .delete(`/api/testimonials/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });
});
