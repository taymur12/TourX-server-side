const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

//dotenv
require('dotenv').config()

//Middleware
app.use(cors())
app.use(express.json())

//connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o7kpe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('database connected')

        const database = client.db("tourx")
        const service = database.collection("service")
        const placeorder = database.collection("placeorder")
        
        //get api
        app.get('/service', async (req,res)=>{
            const cursor = service.find({})
            const services = await cursor.toArray();
            res.json(services)
        })

        //post api
        app.post('/placeorder', async(req,res)=>{
            const doc = req.body
            console.log('hit the api', doc)
            const result = await placeorder.insertOne(doc);
            res.json(result)
            console.log(result)
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('TourX Server is Running')
})

app.listen(port , ()=>{
    console.log('Running server on port', port)
})