const express = require("express")
const router = require("./router")
require("dotenv").config()

const mongoose = require("mongoose")

const app = express()

app.use(express.json())
app.use("/", router)

// Conexão ao banco de dados (descomente e configure caso use MongoDB)
mongoose.connect("mongodb://localhost:27017/register")
        .then(() => console.log("Conectado ao MongoDB"))
        .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));



app.use((erro, req, res, next) => {
    console.log(erro.stack)
    res.status(500).send("Alguma coisa deu erro")
})

module.exports = app