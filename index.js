const express = require("express");
require("dotenv").config();
const corse = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = 5000;


//middleware
app.use(corse());
app.use(express.json());




const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbv6h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


async function run() {

  try {
    await client.connect();
    const database = client.db("watchOfSwitzerland");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");

    app.get('/products', async (req, res) => {
      const products = await productsCollection.find().toArray();
      res.json(products);
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.json(product);
    })


    app.get('/orders', async (req, res) => {
      const orders = await ordersCollection.find().toArray();
      res.json(orders);
    })

    app.post('/order', async (req, res) => {
      const order = req.body;
      console.log(order);
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    })

    }
    finally {
        //await client.close();
    }
    
}

run().catch(console.dir);






app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
