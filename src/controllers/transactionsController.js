// const express = require("express")
// const router = express.Router()
const mongoose = require('mongoose');
const Transaction = require("../models/TransactionDB")
const { authenticationToken } = require("../middlewares/userMiddlewares");

const getTransaction = async (req, res) => {
    try{
        const transactions = await Transaction.find() // Busca todas as transações
        res.status(200).json(transactions)
    }catch(error){
        res.status(500).json({ message: "Erro ao buscar transações", error })
    }
}

const postTransaction = async (req, res) => {
    try {
        const { amount, type, category_id, description, transaction_date } = req.body;
        const user_id = req.user.userId;  // O user_id vem do token
        if (!user_id || !amount || !type || !category_id || !description) {
            return res.status(400).json({ message: "Por favor, forneça todos os campos" });
        }
        // Converta category_id para ObjectId, caso seja necessário
        if (!mongoose.Types.ObjectId.isValid(category_id)) {
            return res.status(400).json({ message: "category_id inválido" });
        }
        // Se transaction_date não for fornecido, atribui a data atual
        const transactionDate = transaction_date || new Date(); 
        const transaction = new Transaction({
            user_id,
            amount,
            type,
            category_id: new mongoose.Types.ObjectId(category_id),  // Converte para ObjectId
            description,
            transaction_date: transactionDate,
        });
        await transaction.save();
        res.status(201).json({ message: "Transação criada com sucesso.", transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar transação." });
    }
};

const putTransaction = async (req, res) => {
    try {
        const { id } = req.params;  // Recebe o ID da transação a ser atualizada
        const { amount, type, category_id, description } = req.body; // Dados para atualização
        // Verifica se o ID é válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        // Verifica se os campos obrigatórios foram fornecidos
        if (!amount || !type || !category_id || !description) {
            return res.status(400).json({ message: "Por favor, forneça todos os campos" });
        }
        // Encontra e atualiza a transação
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,  // ID da transação
            { amount, type, category_id, description }, // Dados a serem atualizados
            { new: true }  // Retorna o documento atualizado
        );
        // Se a transação não for encontrada
        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transação não encontrada" });
        }
        // Retorna a transação atualizada
        res.status(200).json({
            message: "Transação atualizada com sucesso",
            transaction: updatedTransaction
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar transação", error });
    }
};

const deleteTransaction = async (req, res) => {
    const { id } = req.params
    // Verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }
    try {
        const deleteTransaction = await Transaction.findByIdAndDelete(id)
        if(!deleteTransaction){
            return res.status(404).json({message: "Transação não encontrada"})
        }
        res.status(200).json({ message: "Transação excluída com sucesso" });
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
