const express = require("express");
const app = express();
// const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(express.static("public"));
app.use(express.json());

// middale ware
app.use(cors());
app.use(express.json());
    const uri =
    "mongodb+srv://Task-mangement:8cn2mJaMJCBh62YB@cluster0.bkdyuro.mongodb.net/?retryWrites=true&w=majority";
// const uri =
//   "mongodb+srv://<username>:<password>@cluster0.bkdyuro.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const Taskcollectoin = client.db("Task").collection("Addtasks");

    //  post task in database
    app.post("/tasks", async (request, response) => {
        const task = request.body;
        const result = await Taskcollectoin.insertOne(task);
        response.status(200).send(result);
      })
    
    app.get("/tasks/:email", async (request, response) => {
        const email = request.params.email;
        const query = { loggedInUserEmail: email };
        const result = await Taskcollectoin.find(query).toArray();
        response.status(200).send(result);
      });
  
      app.get("/tasks/item/:id", async (request, response) => {
        const id = request.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await Taskcollectoin.findOne(query);
        response.status(200).send(result);
      });



    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("task mangement running");
});

app.listen(port, () => {
  console.log(`Task manegment server is running${port}`);
});
