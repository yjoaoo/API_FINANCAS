// const express = require("express")
// const router = express.Router()

const Transaction = require("../models/TransactionDB")
    

const getTransaction = async (req, res) => {
    try{
        const transactions = await Transaction.find() // Busca todas as transações
        res.status(200).json(transactions)
    }catch(error){
        res.status(500).json({ message: "Erro ao buscar transações", error })
    }
}

const postTransaction = async (req, res) => {
    const { amount, description, date } = req.body;
    if (!amount || !description || !date) {
        return res.status(400).json({ message: "Por favor, forneça todos os campos" });
    }
    const user_id = req.user.id;  
    const type = amount >= 0 ? 'receita' : 'despesa';  // Define o tipo com base no valor
    const category_id = "60c72b2f5f1b2c001f1a2b3e";  // Categoria padrão (ajustar conforme necessário)
    const newTransaction = new Transaction({
        user_id,
        amount,
        type,
        category_id,
        description,
        date
    });
    try {
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar transação" });
    }
};

const putTransaction = async (req, res) => {
    const {id} = req.params
    const {amount, description, date} = req.body

    try{
        const updatedTransation = await Transaction.findByIdAndUpdate(
            id,
            {amount, description, date},
            {new: true, runValidators: true}
        )
        if(!updatedTransation) {
            return res.status(404).json({message: "Transação não encontrada"})
        }
        res.status(200).json(updatedTransation)
    }catch(error){ 
        res.status(500).json({message: "Erro ao atualizar transação", error})
    }
}

const deleteTransaction = async (req, res) => {
    const { id } = req.params
    try {
        const deleteTransaction = await Transaction.findByIdAndDelete(id)
        if(!deleteTransaction){
            return res.status(404).json({message: "Transação não encontrada"})
        }
        res.status(204).send()
    }catch (error){
        res.status(500).json({ message: "Erro ao deletar transação", error })
    }
}

module.exports = {
    getTransaction,
    postTransaction,
    putTransaction,
    deleteTransaction
}
