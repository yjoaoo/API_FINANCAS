// controllers/userController.js
require("dotenv").config()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
// const { authenticationToken } = require('../middlewares/userMiddlewares')
const { generateAcessToken, generateRefreshToken } = require("../utils/authUtils")
const { JWT_SECRET, REFRESH_SECRET } = process.env
// const JWT_SECRET = process.env.JWT_SECRET;
// const REFRESH_SECRET = process.env.REFRESH_SECRET;

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" })
        }
        // verifica se já existe um usuário e email
        const existUser = await User.findOne({ $or: [{ username }, { email }] })
        if (existUser) {
            return res.status(409).json({ error: "Usuário ou email já existe" })
        }
        // criptografar a senha
        const saltRound = 10
        const hashPassword = await bcrypt.hash(password, saltRound)
        // criar um novo usuário
        const newUser = new User({
            username,
            email,
            password: hashPassword
        })
        // salvar no banco de dados
        await newUser.save()
        res.status(201).json({ message: "Usuário criado com sucesso" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro ao criar usuário" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!password || !email) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" })
        }
        // Buscar o usuário no banco de dados
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" })
        }
        // Comparar a senha fornecida com senha hasheada
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciais inválidas" })
        }
        // Gerar token JWT
        // Gerar o Refresh Token (com maior validade)
        const token = generateAcessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)
        // Salvar o refreshToken no banco de dados
        user.refreshToken = refreshToken
        await user.save()
        res.json({
            token,
            refreshToken,
            user: {
                id: user._id,
                email: user.email
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro ao realizar login" })
    }
}

const logout = async(req, res) => {
    try{
        const { refreshToken } = req.body
        if(!refreshToken){
            return res.status(400).json({ message: "Refresh token é necessário"})
        }
        // remover o refreshtoken do banco de dados
        const user = await User.findOneAndUpdate(
            { refreshToken },
            { refreshToken: null }
        )
        if(!user){
            return res.status(403).json({ message: "Usuário não encontrado" });
        }
        res.json({ message: "Logout realizado com sucesso"})
    }catch (error){
        console.error(error)
        res.status(500).json({ message: "Erro ao fazer logout"})
    }
}

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token é necessário" });
        }
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = await User.findOne({ _id: decoded.userId, refreshToken });
        if (!user) {
            return res.status(403).json({ message: "Refresh token inválido ou não encontrado no banco de dados" });
        }
        const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: "2h" });
        const newRefreshToken = jwt.sign({ userId: decoded.userId }, REFRESH_SECRET, { expiresIn: "2d" });
        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error("Erro ao validar refresh token:", error);
        return res.status(403).json({ message: "Refresh token inválido ou expirado" });
    }
};

const getProfile = async (req, res) => {
    try {
      console.log("Decoded User:", req.user); // Loga o conteúdo do token decodificado
      const user = await User.findById(req.user.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      res.status(500).json({ message: "Erro ao buscar perfil" });
    }
  };

module.exports = {
    register,
    login,
    getProfile,
    refreshToken,
    logout
}
