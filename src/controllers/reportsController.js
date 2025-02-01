const Transaction = require("../models/TransactionDB")
const mongoose = require("mongoose")

// Função para calcular o resumo financeiro do mês atual

const getMonthlyReport = async(req, res) => {
    try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        
        const transactions = await Transaction.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth}
        })
        const report = generateReport(transactions)
        res.status(200).json(report)
    } catch (error) {
        res.status(500).json({ message: "Erro ao gerar relatorio mensal", error})
    }
}

// Função para gerar um relatório financeiro personalizado entre duas datas

const getCustomReport = async (req, res) => {
    const { start, end} = req.query

    if(!start || !end) {
        return res.status(400).json({ message: "Os parametros 'start' e 'end' sao obrigatorios"})
    }

    try {
        const startDate = new Date (start)
        const endDate = new Date (end)

        if (!isNaN(startDate.getTime()) || isNaN(endDate.getTime())){
            return res.status(400).json({ message: "As datas fornecidas sao invalidas"})
        }

        const transactions = await Transaction.find({
            createdAt: { $gte: startDate, $lte: endDate }
        })
        const report = generateReport(transactions)
        res.status(200).json(report)
    } catch (error) {
        res.status(500).json({ message: "Erro ao gerar o relatorio personalizado", error})
    }
}

// Função auxiliar para processar o relatório

const generateReport = (transactions) => {
    const totalInCome = 0
    const totalExpense = 0
    transactions.array.forEach(transaction => {
        if (transaction.type === "income"){
            totalInCome += transaction.amount
        } else if (transaction.type === "expense"){
            totalExpense += transaction.amount
        }
    });

    return{
        totalInCome,
        totalExpense,
        balance: totalInCome - totalExpense,
        transactionsCount: transactions.length
    }
}

module.exports = {
    getMonthlyReport,
    getCustomReport
};





