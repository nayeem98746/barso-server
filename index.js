const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASS}@cluster0.t8ils.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect()
      console.log('database successfully');
      const database = client.db('barso-assigment');
      const usersCollection = database.collection('users')


        // user post
        app.post('/users' , async (req, res)=> {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            console.log(result)
            res.send(result)
          }) 

          app.put('/users/admin' , async (req, res)=> {
            const user = req.body
            console.log('put', user)
            const filter = {email: user.email};
            const updateDoc = {$set: { role:'admin' }};
            const result = await usersCollection.updateOne(filter,updateDoc)
            res.json(result)
          })

          app.get('/users/:email', async(req, res)=> {
            const email= req.params.email
            const query = {email: email}
            const user = await usersCollection.findOne(query)
            let isAdmin = false;
            if(user?.role === 'admin'){
              isAdmin = true;
            }
            res.json({admin : isAdmin})
          })


// 









     
    } finally {
      
    //   await client.close();
    }
  }
  run().catch(console.dir);


  app.get('/', (req, res) => {
    res.send('Hello admin system !')
  })
  
  app.listen(port, () => {
    console.log(` listening at ${port}`)
  })