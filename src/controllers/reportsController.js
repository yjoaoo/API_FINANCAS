const Transaction = require("../models/TransactionDB")
const mongoose = require("mongoose")

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
        console.error("Erro detalhado:", error);
        res.status(500).json({ message: "Erro ao gerar relatorio mensal", error})
    }
}
// EXEMPLO DE URL : http://localhost:3000/reports/custom?start=2024-12-31T00:00:00.000Z&end=2025-02-01T23:59:59.999Z
const getCustomReport = async (req, res) => {
    const { start, end } = req.query;
    if (!start || !end) {
        return res.status(400).json({ message: "Os parâmetros 'start' e 'end' são obrigatórios" });
    }
    try {
        let startDate = new Date(start);
        let endDate = new Date(end);

        // Ajusta para o início e fim do dia, conforme necessário
        startDate.setHours(0, 0, 0, 0); // Início do dia
        endDate.setHours(23, 59, 59, 999); // Fim do dia

        // Ajuste para fuso horário (se necessário)
        startDate.setHours(startDate.getHours() - 3); // Ajuste para fuso UTC-3
        endDate.setHours(endDate.getHours() - 3); // Ajuste para fuso UTC-3

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: "As datas fornecidas são inválidas" });
        }

        // Buscar as transações dentro do intervalo de datas ajustado
        const transactions = await Transaction.find({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const report = generateReport(transactions);
        res.status(200).json(report);

    } catch (error) {
        console.error("Erro detalhado:", error);
        res.status(500).json({ message: "Erro ao gerar o relatório personalizado", error });
    }
};

const generateReport = (transactions) => {
    let totalInCome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
        const type = (transaction.type || '').toLowerCase();  

        const incomeKeywords = ["income", "salário", "venda", "ganho", "rendimento", "receita"];
        const expenseKeywords = ["expense", "gasto", "despesa", "compra", "pagamento"];

        console.log(`Processando transação: ${transaction._id} | Tipo: ${transaction.type} | Montante: ${transaction.amount}`);
        
        if (incomeKeywords.some(keyword => type.includes(keyword))) {
            totalInCome += transaction.amount;
        } 
        else if (expenseKeywords.some(keyword => type.includes(keyword))) {
            totalExpense += transaction.amount;
        } 
        else {
            console.log(`Tipo não categorizado encontrado: ${transaction.type}`);
        }
    });

    return {
        totalInCome,
        totalExpense,
        balance: totalInCome - totalExpense,
        transactionsCount: transactions.length
    };
};

module.exports = {
    getMonthlyReport,
    getCustomReport
};
