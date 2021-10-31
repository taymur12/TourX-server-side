const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

//dotenv
require('dotenv').config()

//Middleware
app.use(cors())
app.use(express.json())

//connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o7kpe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)
async function run(){
    try{
        await client.connect();
        console.log('database connected')

        const database = client.db("tourx")
        const service = database.collection("service")
        const placeorder = database.collection("placeorder")
        
        //get service api
        app.get('/service', async (req,res)=>{
            const cursor = service.find({})
            const services = await cursor.toArray();
            res.json(services)
        })

        //post order api
        app.post('/placeorder', async(req,res)=>{
            const doc = req.body
            console.log('hit the api', doc)
            const result = await placeorder.insertOne(doc);
            res.json(result)
        })

        //Get order api
        app.get('/myorder', async(req,res)=>{
            const cursor = placeorder.find({})
            const order = await cursor.toArray();
            res.json(order)
        })

        //Delete order api
        app.delete('/myorder/:id', async(req,res)=>{
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const result = await placeorder.deleteOne(query)
            res.json(result)
        })

        //get Manage order Api
        app.get('/manageorder', async(req, res)=>{
            const cursor = placeorder.find({})
            const manageorder = await cursor.toArray();
            res.json(manageorder)
        })

        //delete manage order admin
        app.delete('/manageorder/:id', async(req,res)=>{
            const id = req.params.id
            const manageQuery = {_id:ObjectId(id)}
            const manageResult = await placeorder.deleteOne(manageQuery)
            res.json(manageResult)
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