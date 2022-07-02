const express = require("express");
const mongoose = require("mongoose")
require('dotenv').config()
const cors = require('cors')

const app = express();
const MONGO_DB_USER = process.env.MONGO_DB_USER
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD

// Lendo JSON / Middleware

app.use(
    express.urlencoded({
        extended: true
    }),
)

app.use(cors());

app.use(express.json())

// Rota Inicial / EndPoint
app.get('/',(req, res)=>{
    res.json({
        message: 'Seja bem vindo á Api do fisio App'
    })
})

//Rotas da aplicação

const exercisesRoutes = require('./routes/exercisesRoutes')

app.use('/exercises', exercisesRoutes)


// Entregar uma porta
mongoose.connect(`mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster0.2ahn3.mongodb.net/AppFisioDB?retryWrites=true&w=majority`)
    .then(()=>{
        console.log("Conectamos ao MongoDB")
        app.listen(process.env.PORT||9000)
    })
    .catch((err)=>{
        console.log(err)
    })

