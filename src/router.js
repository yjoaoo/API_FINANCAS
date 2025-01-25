const express = require("express")
const router = express.Router()
const userController = require("./controllers/userController")
const userTransactions = require("./controllers/transactionsController")
const userCategory = require("./models/categoryDB")
const { authenticationToken } = require("./middlewares/userMiddlewares");
const { getProfile, getCategories, postCategory, deleteCategory } = require("./controllers/categoriesController");


router.post("/register", userController.register)
router.post("/login", userController.login)
router.get("/profile", authenticationToken, userController.getProfile, /*getProfile*/);
router.post("/refresh", userController.refreshToken)
router.post("/logout", userController.logout)

router.get("/transactions", authenticationToken, userTransactions.getTransaction)
router.post("/transactions", authenticationToken, userTransactions.postTransaction)
router.put("/transactions/:id", authenticationToken, userTransactions.putTransaction) // (:id) substituir pelo id do produto
router.delete("/transactions/:id", authenticationToken, userTransactions.deleteTransaction) // (:id) substituir pelo id do produto

router.get("/categories", getCategories)
router.post("/categories", postCategory)
router.delete("/categories/:id", deleteCategory)





// router.get("/profile", userController.getProfile)
// Rota de perfil protegida

router.get("/financas", (req, res) => {
    res.send("Página de finanças")
})

router.get("/", (req, res) => {
    res.send("Página inicial")
})

module.exports = router