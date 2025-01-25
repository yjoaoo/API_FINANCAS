const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      amount: { type: Number, required: true },
      type: { type: String, enum: ["receita", "despesa"], required: true },
      category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria", required: true },
      description: { type: String, required: true },
      transaction_date: { type: Date, required: true }  
    },
    { timestamps: true }  
  );

module.exports = mongoose.model("Transaction", transactionSchema);
