const mongoose = require("mongoose")
const Category = require("../models/categoryDB")
const Transaction = require("../models/TransactionDB")

// GET /categories: Lista todas as categorias
const getCategories = async (req, res) => {
    try {
        const categorias = await Category.find()
        res.status(200).json(categorias)
    } catch (error){
        res.status(500).json({ message: "Erro ao buscar categorias", error})
    }
}

// POST /categories: Adiciona uma nova categoria
const postCategory = async (req, res) => {
    const { name, description } = req.body
    if (!name){
        return res.status(400).json({ message: "O nome da categoria e obrigatorio"})
    }
    try {
        const newCategory = new Category({ name, description})
        await newCategory.save()
        res.status(201).json({ message: "Categoria criada com sucesso", category: newCategory})
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar categoria", error})
    }
}

// DELETE /categories/{id}: Remove uma categoria (se não estiver vinculada a nenhuma transação)
const deleteCategory = async (req, res) => {
    const { id } = req.params
    try {
        const transactions = await Transaction.find({ category_id: id })
        if (transactions.length > 0){
            return res.status(400).json({ message: "Categoria nao encontrada"})
        }
        res.status(204).send()
    } catch (error){
        res.status(500).json({ message: "Erro ao deletar categoria", error})
    }
}

module.exports = {
    getCategories,
    postCategory,
    deleteCategory
}