const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i4bni.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;
console.log(process.env.DB_USER);

app.get("/", (req, res) => {
  res.send("Welcome to Volunteer Network Server");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const userActivitiesCollection = client.db("volunteerActivity").collection("userActivities");
  console.log('db connected');
  const eventsCollection = client.db("volunteerActivity").collection("events");

  app.post("/addActivity", (req, res) => {
    const events = req.body;
    eventsCollection.insertOne(events).then((result) => {
      res.send(result.insertedCount);
    });
  });

  app.get("/events", (req, res) => {
    eventsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addEvent", (req, res) => {
    const events = req.body;
    eventsCollection.insertOne(events).then((result) => {
      res.send(result.insertedCount);
    });
  });

  app.post("/addUserActivity", (req, res) => {
    const userActivity = req.body;
    userActivitiesCollection.insertOne(userActivity).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/userActivities", (req, res) => {
    userActivitiesCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/activityList", (req, res) => {
    userActivitiesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/selectedActivities/:_id", (req, res) => {
    userActivitiesCollection.deleteOne({ id: req.params.id }).then((result) => {
      console.log("Deleted Successfully");
    });
  });
});

app.listen(process.env.PORT || port);
