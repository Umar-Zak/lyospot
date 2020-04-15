const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../model/user");
const { Order } = require("../../model/order");
const { Rejected } = require("../../model/rejectedOrder");
let objectId;
let order;
let user;
let token;
let server;
let payload;
let reject;

describe("/api/orders", () => {
  beforeEach(async () => {
    server = require("../../index");
    objectId = mongoose.Types.ObjectId();
    reject = new Rejected({
      orderCode: "order123",
      address: "pty67",
      orderBy: {
        _id: objectId,
        email: "umarabanga78@gmail.com"
      },
      product: {
        name: "milk",
        price: 12,
        quantity: 90,
        store: {
          _id: objectId,
          name: "mystore"
        },
        category: {
          _id: objectId,
          title: "mycat"
        },
        shipping: {
          _id: objectId,
          type: "domestic"
        },
        description: "mydesc",
        profile1: "pro1",
        profile2: "pro2",
        profile3: "pro3",
        profile4: "pro4",
        amount: 6789
      }
    });
    await reject.save();

    (payload = {
      orderCode: "order123",
      address: "pty67",
      orderBy: "umarabanga78@gmail.com",
      products: [
        {
          name: "milk",
          price: 12,
          quantity: 90,
          store: {
            _id: objectId,
            name: "mystore"
          },
          category: {
            _id: objectId,
            title: "mycat"
          },
          shipping: {
            _id: objectId,
            type: "domestic"
          },
          description: "mydesc",
          profile1: "pro1",
          profile2: "pro2",
          profile3: "pro3",
          profile4: "pro4",
          amount: 6789
        },
        {
          name: "milk",
          price: 12,
          quantity: 90,
          store: {
            _id: objectId,
            name: "mystore1"
          },
          category: {
            _id: objectId,
            title: "mycat1"
          },
          shipping: {
            _id: objectId,
            type: "domestic1"
          },
          description: "mydesc1",
          profile1: "pro1",
          profile2: "pro2",
          profile3: "pro3",
          profile4: "pro4",
          amount: 67891
        }
      ]
    }),
      (user = new User({
        email: "umarabanga78@gmail.com",
        password: "0201348856"
      }));
    await user.save();

    token = user.genAuthToken();
    order = new Order({
      orderCode: "order123",
      address: "pty67",
      orderBy: {
        _id: objectId,
        email: "umarabanga78@gmail.com"
      },
      product: {
        name: "milk",
        price: 12,
        quantity: 90,
        store: {
          _id: objectId,
          name: "mystore"
        },
        category: {
          _id: objectId,
          title: "mycat"
        },
        shipping: {
          _id: objectId,
          type: "domestic"
        },
        description: "mydesc",
        profile1: "pro1",
        profile2: "pro2",
        profile3: "pro3",
        profile4: "pro4",
        amount: 6789
      }
    });
    await order.save();
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
    await Order.remove({});
    await Rejected.remove({});
  });

  describe("get", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).get("/api/orders");
      expect(res.status).toBe(401);
    });
    it("should return with status 200 if  logged in", async () => {
      const res = await request(server)
        .get("/api/orders")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });

  describe("get/:id", () => {
    it("should return 401 status code if not logged in", async () => {
      const res = await request(server).get(`/api/orders/${objectId}`);
      expect(res.status).toBe(401);
    });
    it("should return 400 status code if  logged in but objectid not valid", async () => {
      objectId = "64yhejhs";
      const res = await request(server)
        .get(`/api/orders/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return 404 status code if  logged in but order not found", async () => {
      const res = await request(server)
        .get(`/api/orders/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return 200 status code if  logged in and order available", async () => {
      objectId = order._id;
      const res = await request(server)
        .get(`/api/orders/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });

  describe("delete/:id", () => {
    it("should return 401 if not logged in", async () => {
      const res = await request(server).delete(`/api/orders/${objectId}`);
      expect(res.status).toBe(401);
    });
    it("should return 400 if  logged in but objectid not valid", async () => {
      objectId = "5672378hdh";
      const res = await request(server)
        .delete(`/api/orders/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return 404 if  logged in but order not available", async () => {
      const res = await request(server)
        .delete(`/api/orders/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return 200 if  logged in and order available", async () => {
      objectId = order._id;
      const res = await request(server)
        .delete(`/api/orders/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });

  describe("post", () => {
    it("should return status 401 if not logged in", async () => {
      const res = await request(server)
        .post("/api/orders")
        .send(payload);
      expect(res.status).toBe(401);
    });
    it("should return status 400 if  logged in but data posted invalid", async () => {
      delete payload.orderCode;
      const res = await request(server)
        .post("/api/orders")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(400);
    });
    it("should return status 404 if  logged in but user not available", async () => {
      payload.orderBy = "umar@gmail.com";
      const res = await request(server)
        .post("/api/orders")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return status 200 if  logged in and valid data posted", async () => {
      const res = await request(server)
        .post("/api/orders")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(200);
    });
  });

  describe("get/rejects", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).get("/api/orders/sellers/rejects");
      expect(res.status).toBe(401);
    });
    it("should return with status 200 if  logged in", async () => {
      const res = await request(server)
        .get("/api/orders/sellers/rejects")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });

  describe("get/rejects/:id", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).get(
        `/api/orders/sellers/rejects/${objectId}`
      );
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if  logged in but objectid not valid", async () => {
      objectId = "gdg67729";
      const res = await request(server)
        .get(`/api/orders/sellers/rejects/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if  logged in but rejected order not available", async () => {
      const res = await request(server)
        .get(`/api/orders/sellers/rejects/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if  logged in and rejected order available", async () => {
      objectId = reject._id;
      const res = await request(server)
        .get(`/api/orders/sellers/rejects/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });
});
