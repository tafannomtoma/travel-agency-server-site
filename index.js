const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yalph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('travelAgency');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        // GET API 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.send(result);
        })

        // GET ORDERS
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({})
            const order = await cursor.toArray();
            res.send(order);

        })

        // Post ORDER
        app.post('/order', async (req, res) => {
            const order = req.body;
            console.log('hit the post api', order)
            const result = await orderCollection.insertOne(order);
            // console.log(result);
            res.send(result);
        });

        // delete Ordeer
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        });

        // delete MYOrdeer
        app.delete('/myOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })


    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running travell agency');
});
app.listen(port, () => {
    console.log('Running travell agency ', port);
})