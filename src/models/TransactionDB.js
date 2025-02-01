const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      amount: { type: Number, required: true },
      type: { type: String, enum: ["receita", "despesa"], required: true },
      category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria", required: true },
      description: { type: String, required: true },
      transaction_date: { type: Date, default: Date.now },
      deletedAt: { type: Date, default: null }  // 🔹 Adicionando o campo para soft delete
    },
    { timestamps: true }  
);

// 🔹 Criando um índice para otimizar buscas por data
transactionSchema.index({ transaction_date: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);

