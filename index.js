const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(
  "sk_test_51M7I5sJSKxqvc4gJEwnBELCjit3WXyDF3SIIK7suLXIxm6nrFvQDJRaqaOLey3jXLaKvINPZA14Tk3ewXadMfnuM00R7aOfiEO"
);

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
    const usersCollection = client.db("explore-bd").collection("users");
    const userscartCollection = client.db("explore-bd").collection("cart");
    const feedbackCollection = client.db("explore-bd").collection("feedback");
    const categoriesCollection = client
      .db("explore-bd")
      .collection("categories");
    const servicesCollection = client.db("explore-bd").collection("services");
    const tripsCollection = client.db("explore-bd").collection("trips");
    const aboutCollection = client.db("explore-bd").collection("about-desc");
    const teamsCollection = client.db("explore-bd").collection("teams");
    const packageCollection = client
      .db("explore-bd")
      .collection("package-desc");
    const scheduleCollection = client
      .db("explore-bd")
      .collection("schedule-desc");
    const snapCollection = client.db("explore-bd").collection("snap-desc");
    const tripPackageCollection = client
      .db("explore-bd")
      .collection("package-trip");
    const scheduleTripCollection = client
      .db("explore-bd")
      .collection("schedule-trip");
    const snapTripCollection = client.db("explore-bd").collection("snap-trip");
    const travelPlacePurchase = client.db("explore-bd").collection("payment");
    const bookedCollection = client.db("explore-bd").collection("booked");
    const adminCollection = client.db("explore-bd").collection("admin");
    const editorCollection = client.db("explore-bd").collection("editor");
    const editorCategoriesCollection = client
    .db("explore-bd")
    .collection("EditorCategories");



    app.post("/create-payment-intent", async (req, res) => {
      const booking = req.body;
      const price = booking.total;
      const amount = price * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    // Users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Get User  By Email
    app.get("/users", async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });



 app.get("/makeAdmin",async (req, res) => {
      const query = {};
      const users = await adminCollection.find(query).toArray();
      res.send(users);
    });

    app.post("/makeAdmin", async (req, res) => {
      const user = req.body;
      const result = await adminCollection.insertOne(user);
      res.send(result);
    });


 app.get("/editor",  async (req, res) => {
      const query = {};
      const editor = await editorCollection.find(query).toArray();
      res.send(editor);
    });

    app.post("/editor", async (req, res) => {
      const user = req.body;
      const result = await editorCollection.insertOne(user);
      res.send(result);
    });


    app.get("/users/editor/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isEditor: user?.role === "editor" });
    });


    app.get("/cart/:id", async (req, res) => {
      const query = {};
      const cart = await userscartCollection.find(query).toArray();
      res.send(cart);
    });

    // cart
    app.post("/cart", async (req, res) => {
      const cart = req.body;
      const query = {
        travel: cart.course,
        email: cart.email,
      };
      const alreadyAdded = await userscartCollection.find(query).toArray();
      if (alreadyAdded.length) {
        const message = `You already have adeed this`;
        return res.send({ acknowledged: false, message });
      }
      const result = await userscartCollection.insertOne(cart);
      res.send(result);
    });

    app.get("/cart", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cart = await userscartCollection.find(query).toArray();
      res.send(cart);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userscartCollection.deleteOne(query);
      res.send(result);
    });

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
      const categories = await cursor.toArray();
      res.send(categories);
    });

    app.get("/editor/editorCategories", async (req, res) => {
      let query = {};
      const cursor = editorCategoriesCollection.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });

    app.get("/booked", async (req, res) => {
      let query = {};
      const cursor = bookedCollection.find(query);
      const booked = await cursor.toArray();
      res.send(booked);
    });

    app.post("/booked", async (req, res) => {
      const booked = req.body;
      const result = await bookedCollection.insertOne(booked);
      res.send(result);
    });


    app.delete("/booked/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookedCollection.deleteOne(query);
      res.send(result);
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

    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
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

    app.delete("/trip/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tripsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/admin/about", async (req, res) => {
      let query = {};
      const cursor = aboutCollection.find(query);
      const about = await cursor.toArray();
      res.send(about);
    });

    app.post("/admin/about", async (req, res) => {
      const about = req.body;
      const result = await aboutCollection.insertOne(about);
      res.send(result);
    });

    app.delete("/aboutDesc/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await aboutCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/admin/packages", async (req, res) => {
      let query = {};
      const cursor = packageCollection.find(query);
      const package = await cursor.toArray();
      res.send(package);
    });

    app.post("/admin/packages", async (req, res) => {
      const package = req.body;
      const result = await packageCollection.insertOne(package);
      res.send(result);
    });

    app.delete("/packageDesc/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await packageCollection.deleteOne(query);
      res.send(result);
    });
    

    app.get("/admin/schedule", async (req, res) => {
      let query = {};
      const cursor = scheduleCollection.find(query);
      const schedule = await cursor.toArray();
      res.send(schedule);
    });

    app.post("/admin/schedule", async (req, res) => {
      const schedule = req.body;
      const result = await scheduleCollection.insertOne(schedule);
      res.send(result);
    });

    app.delete("/scheduleDesc/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await scheduleCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/scheduleTrip/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await scheduleTripCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/admin/snap", async (req, res) => {
      let query = {};
      const cursor = snapCollection.find(query);
      const snap = await cursor.toArray();
      res.send(snap);
    });

    app.post("/admin/snap", async (req, res) => {
      const snap = req.body;
      const result = await snapCollection.insertOne(snap);
      res.send(result);
    });

    app.get("/admin/teams", async (req, res) => {
      let query = {};
      const cursor = teamsCollection.find(query);
      const teams = await cursor.toArray();
      res.send(teams);
    });

    app.post("/admin/teams", async (req, res) => {
      const teams = req.body;
      const result = await teamsCollection.insertOne(teams);
      res.send(result);
    });

    app.delete("/teams/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await teamsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/admin/tripPackage", async (req, res) => {
      let query = {};
      const cursor = tripPackageCollection.find(query);
      const tripPackage = await cursor.toArray();
      res.send(tripPackage);
    });

    app.post("/admin/tripPackage", async (req, res) => {
      const tripPackage = req.body;
      const result = await tripPackageCollection.insertOne(tripPackage);
      res.send(result);
    });

    app.delete("/tripPackage/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tripPackageCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/admin/scheduleTrip", async (req, res) => {
      let query = {};
      const cursor = scheduleTripCollection.find(query);
      const scheduleTrip = await cursor.toArray();
      res.send(scheduleTrip);
    });

    app.post("/admin/scheduleTrip", async (req, res) => {
      const scheduleTrip = req.body;
      const result = await scheduleTripCollection.insertOne(scheduleTrip);
      res.send(result);
    });

    app.get("/admin/snapTrip", async (req, res) => {
      let query = {};
      const cursor = snapTripCollection.find(query);
      const snapTrip = await cursor.toArray();
      res.send(snapTrip);
    });

    app.post("/admin/snapTrip", async (req, res) => {
      const snapTrip = req.body;
      const result = await snapTripCollection.insertOne(snapTrip);
      res.send(result);
    });

    app.delete("/snapDesc/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await snapCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/snapTrip/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await snapTripCollection.deleteOne(query);
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
