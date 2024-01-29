const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app"); // Import your Express app
const Subscriber = require("../src/models/subscribers"); // Import your model
const mongoose=require('mongoose')

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("API Routes", () => {
  before(async () => {
    // Connect to a test database or perform any setup you need
    // This will depend on your testing environment and strategy
    await mongoose.connect('mongodb+srv://ashahnawaz010:WkrqkxVLaDvEZnE7@cluster0.dzgsqgw.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  
  after(async () => {
    // Disconnect from the test database or perform any cleanup
    await mongoose.disconnect();
  });

  describe("GET /subscribers", () => {
    it("should get all subscribers", (done) => {
      chai.request(app)
        .get("/subscribers")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          //res.body.length.should.be.eql(0); // Assuming no subscribers initially
          done();
        });
    });
  });

  describe("GET /subscribers/names", () => {
    it("should get subscribers by name and subscribedChannel", (done) => {
      chai.request(app)
        .get("/subscribers/names")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          // Add more assertions based on your expected response
          done();
        });
    });
  });

  describe("GET /subscribers/:id", () => {
    it("should get a subscriber by id", (done) => {
      const newSubscriber = new Subscriber({
        name: "John Doe",
        subscribedChannel: "Example Channel",
      });

      newSubscriber.save((err, subscriber) => {
        chai.request(app)
          .get(`/subscribers/${subscriber.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("name").eql("John Doe");
            // Add more assertions based on your expected response
            done();
          });
      });
    });

    it("should return an error if subscriber is not found", (done) => {
      chai.request(app)
        .get("/subscribers/invalid_id")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("message").eql("subscriber not found");
          done();
        });
    });
  });
});