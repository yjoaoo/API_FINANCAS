const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/financas", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conectado ao mongoDB local!")
}).catch((erro) => {
    console.log(`Erro ao se conectar ao MongoDB: ${erro}`)
})

const transacaoSchema = new mongoose.Schema({
    descricao: String,
    valor: Number,
    tipo: { type: String, enum: ["entrada", "saida"]},
    data: { type: Date, default: Date.now}
})

const Transacao = mongoose.model("Transacao", transacaoSchema)

const novaTransacao = new Transacao({
    descricao: "Compra de material de escrítorio",
    valor: 150,
    tipo: "saida"
})

novaTransacao.save().then(() => {
    console.log("Transação salva")
}).catch((erro) => {
    console.log(`Erro ao salvar transação ${erro}`)
})