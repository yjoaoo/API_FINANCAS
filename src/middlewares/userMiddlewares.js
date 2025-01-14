const jwt = require("jsonwebtoken")
require("dotenv").config()
// const { verifyToken } = require("../utils/authUtils");

const authenticationToken = (req, res, next) => {
    // const token = req.header("Authorization")?.replace("Bearer ", ""); Pega o token do cabeçalho
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }
    const token = authHeader.split(" ")[1]
    try {
        // Verifica o token e decodifica
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Adiciona o usuário decodificado ao objeto `req`
        next();  // Passa para o próximo middleware ou controlador
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Token inválido ou expirado." });
    }
};

module.exports = { authenticationToken };