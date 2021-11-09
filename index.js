//to run : node filename.js
const express = require('express')
const app=express();
const cors=require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port=process.env.PORT||5000;

//middleware
app.use(cors())
app.use(express.json());

//database call
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yug9g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client=new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function run() {
    try {
        await client.connect();

      const database=client.db("chairDb");
      const productsCollection=database.collection("products");
      const usersCollection=database.collection("users");
      const ordersCollection=database.collection("orders");
console.log('connected to databse from chair server');
    }
    finally {
        await client.close();
    }
}
run().catch(console.dir);
//for checking database is working or not
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})