//import required module
const express = require("express");
const path = require("path");
const Subscriber = require("./models/subscribers");
//express store references to the app
const app = express();
app.use(express.static(path.join(process.cwd(),"public")))
console.log(path.join(__dirname,"public"),process.cwd())
//import models of subscriber

//parse JSON bodies that API clients send.
app.use(express.json());


//we use Route

// API to get all data of subscribers
app.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET API for getting subscribers by name and Subscribed Channel
app.get("/subscribers/names", async (req, res) => {
  try {
    const subscriberByName = await Subscriber.find().select(
      "name subscribedChannel -_id"
    );
    //Response data
    res.status(200).send(subscriberByName);
  } catch (error) {
    res.status(404);
  }
});

// API to get subscribers by id
app.get("/subscribers/:id", async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(400).json({ meassge: "subscriber not found" });
    }
    res.json(subscriber);
  } catch (err) {
    res
      .status(400) //Error status code
      .json({
        // Error Message
        message: "subscriber not found",
      });
  }
});

module.exports = app;
