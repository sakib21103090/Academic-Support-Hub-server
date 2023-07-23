const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const app = express();
const port = process.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.as0dvvq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const collegeCollection=client.db('SupportHub').collection('collegeData')


    app.get("/popularCollegeData", async (req, res) => {
        const popularCollegeData = await collegeCollection
          .find({})
          .limit(3)
          .sort({ college_rating: -1 })
          .toArray();
        // .sort({ createdAt: -1 })
      
        res.send(popularCollegeData);
      });

      app.get("/popularCollegeData/:id", async (req, res) => {
        const id= req.params.id;
         const query={_id: new ObjectId(id)}
         console.log(query);
         const result = await collegeCollection.findOne(query);
         res.send(result);
       });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('my server is running')
})


app.listen(port, () => {
    console.log(`Academic supporthub is running on port ${port}`);
  });