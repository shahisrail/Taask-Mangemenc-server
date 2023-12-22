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

    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await Taskcollectoin.insertOne(task);
      res.send(result);
    });

    app.get("/task/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await Taskcollectoin.find(query).toArray();
      res.send(result);
    });

    app.get("/tasks/item/:id", async (request, response) => {
      const id = request.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Taskcollectoin.findOne(query);
      response.status(200).send(result);
    });
    app.patch("/task", async (req, res) => {
      const id = req.query.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: data.status,
        },
      };
      const result = await Taskcollectoin.updateOne(query, updatedDoc);
      res.send(result);
    });

    //   delete
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      try {
        const result = await Taskcollectoin.deleteOne(query);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Task deleted successfully" });
        } else {
          res.status(404).json({ message: "Task not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Update
    app.get("/updatetask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Taskcollectoin.findOne(query);
      res.send(result);
    });

    // update
    app.patch("/updatetask/:id", async (req, res) => {
      const id = req.params.id;
      const item = req.body;
      const filter = { _id: new ObjectId(id) };

      const updatedDoc = {
        $set: {
          titale: item.titale,
          Dedline: item.Dedline,
          Descriptoin: item.Descriptoin,
          priority: item.priority,
        },
      };
      const result = await Taskcollectoin.updateOne(filter, updatedDoc);
      res.send(result);
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
