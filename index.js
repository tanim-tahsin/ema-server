const  express = require('express')
const app = express()
const port =5000
const cors = require('cors')
require('dotenv').config()
app.use(express.json())
app.use(cors())
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bybis.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(`${process.env.DB_NAME}`).collection("products");
 app.post('/addProduct' , (req,res) => {
     const product= req.body
     collection.insertMany(product)
    .then(result=>{
       res.send(result.insertedCount)
    })
 })


 app.get('/products' , (req, res)=>{
     collection.find({})
     .toArray((err,docs)=>{
         res.send(docs)
     })
 })
 app.get('/product/:key' , (req, res)=>{
    collection.find({key:req.params.key})
    .toArray((err,docs)=>{
        res.send(docs[0])
    })
})

app.post('/productsByKeys' , (req, res)=>{
    const productKeys =req.body
    collection.find({key:{$in:productKeys}})
    .toArray((err,docs)=>{
        res.send(docs)
    })
})

  console.log('connected');
});



app.get('/',  (req, res) =>{
  res.send('hello world')
})
app.listen(process.env.PORT || port)