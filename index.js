const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ym6dsyl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const feedbackCollection = client.db("explore-bd").collection("feedback");
    const categoriesCollection = client.db("explore-bd").collection("categories");
    const servicesCollection = client.db("explore-bd").collection("services");
    const tripsCollection = client.db("explore-bd").collection("trips");

    app.get("/feedback", async (req, res) => {
      let query = {};
      const cursor = feedbackCollection.find(query);
      const feedback = await cursor.toArray();
      res.send(feedback);
    });

    app.post("/feedback", async (req, res) => {
      const feedback = req.body;
      const result = await feedbackCollection.insertOne(feedback);
      res.send(result);
    });

    app.get("/admin/categories", async (req, res) => {
      let query = {};
      const cursor = categoriesCollection.find(query);
      const about = await cursor.toArray();
      res.send(about);
    });

    app.get("/admin/services", async (req, res) => {
      let query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.post("/admin/services", async (req, res) => {
      const services = req.body;
      const result = await servicesCollection.insertOne(services);
      res.send(result);
    });

    app.get("/admin/trips", async (req, res) => {
      let query = {};
      const cursor = tripsCollection.find(query);
      const trips = await cursor.toArray();
      res.send(trips);
    });

    app.post("/admin/trips", async (req, res) => {
      const trips = req.body;
      const result = await tripsCollection.insertOne(trips);
      res.send(result);
    });
    
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", async (req, res) => {
  res.send("ExploreBD server is running");
});

app.listen(port, () => console.log(`ExploreBD running ${port}`));
