const express = require("express");


const app = express();


// Lendo JSON / Middleware

app.use(
    express.urlencoded({
        extended: true
    }),
)

app.use(express.json())

// Rota Inicial / EndPoint
app.get('/',(req, res)=>{
    res.json({
        message: 'Olá Mundo'
    })
}) 



// Entregar uma porta
app.listen(3000)
