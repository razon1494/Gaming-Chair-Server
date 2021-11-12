const express=require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors=require('cors');

const app = express()
const port=process.env.PORT||5000;
const ObjectId=require('mongodb').ObjectId;
//middleware
app.use(cors());
app.use(express.json());

const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yug9g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client=new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function run() {
  try {
      await client.connect();
      console.log('connected to databse from tour server');
      const database=client.db("chairDb");
      const productsCollection=database.collection("products");
      const usersCollection=database.collection("users");
      const reviewCollection=database.collection("reviews");
      const ordersCollection=database.collection("orders");
    //GET API to check mongo db is working fine or not *
      app.get('/users', async (req, res) => {
          const cursor=usersCollection.find({});
          const users=await cursor.toArray();
          res.send(users);
      })
    // Register user and add user ondatabase*
app.post('/users', async (req, res) => {
        const user=req.body;
      const result=await usersCollection.insertOne(user);
  res.json(result);
      });
//get all products from db
    app.get('/products', async (req, res) => {
      const cursor=productsCollection.find({});
      const products=await cursor.toArray();
      res.send(products)
    })

//get all reviews
app.get('/reviews', async (req, res) => {
      const cursor=reviewCollection.find({});
      const products=await cursor.toArray();
      res.send(products)
    })


      app.get('/managebookings', async (req, res) => {
          const cursor=ordersCollection.find({});
          const services=await cursor.toArray();
          res.send(services);
      })
      //GET Single Product *
      app.get('/products/:id', async (req, res) => {
          const id=req.params.id;
          console.log('got specific id', id);
          const query={_id: ObjectId(id)};
          const service=await productsCollection.findOne(query);
          res.json(service);
      })
    //add bookings POST API *
      app.post('/placeorder', async (req, res) => {
          const service=req.body;
          console.log('result hitted the post api', service);
          const result=await ordersCollection.insertOne(service);
          console.log(result);
          res.send(result);
      });
    //set admin
      app.put('/users/admin', async (req, res) => {
        const user=req.body;
            const filter={email: user.email};
            const updateDoc={$set: {role: 'admin'}}
            const result=await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
      })
    //add review
      app.post('/addreview', async (req, res) => {
      const review=req.body;
      const result=await reviewCollection.insertOne(review);
      res.json(result);
      })
    //finding admin
    //find admin
    app.get('/users/:email', async (req, res) => {
      const email=req.params.email;
      const query={email: email};
      const user=await usersCollection.findOne(query);
      let isAdmin=false;
      if(user?.role==='admin') {
        isAdmin=true;
      }
      res.json({admin: isAdmin});
    })
    //find user
    app.get('/user/:email', async (req, res) => {
  console.log('hitted')
      const email=req.params.email;
      const query={email: email};
      const user=await usersCollection.findOne(query);
  let isUser=false;
  console.log(user, 'hi');
      if(user?.role==='user') {
        isUser=true;
      }
      res.json({user: isUser});
    })
    //add new product
    app.post('/addservice', async (req, res) => {
      const service=req.body;
      const result=await productsCollection.insertOne(service);
      res.json(result);
    })

     // my orders

  app.get("/myorder/:email", async (req, res) => {
    const result = await ordersCollection.find({
      email: req.params.email,
    }).toArray();
    res.send(result);
  });

    //update Status
    app.put('/services/:id', async (req, res) => {
      const id=req.params.id;
      console.log('Updating', id);
      const filter= {_id: ObjectId(id)};
      const updateDoc={
        $set: {
          status: true
        },
      };
      const result=await ordersCollection.updateOne(filter, updateDoc);

      res.json(result);
    })
      //DELETE order from database
      app.delete('/deleteorder/:id', async (req, res) => {
        const id=req.params.id;
        console.log(id);
        const query={_id: ObjectId(id)};
        console.log(query);
          const result=await ordersCollection.deleteOne(query);
          res.json(result);
      })
      //DELETE product from database
      app.delete('/deleteproduct/:id', async (req, res) => {
        const id=req.params.id;
        console.log(id);
        const query={_id: ObjectId(id)};
        console.log(query);
          const result=await productsCollection.deleteOne(query);
          res.json(result);
      })
  } finally {
    // await client.close();
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