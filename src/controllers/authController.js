// const jwt = require("jsonwebtoken")
const validator = require("validator")
// const bcrypt = require("bcryptjs");

const validateName = (req, res, next) => {
    const { body } = req
    if(body.name === undefined) {
        return res.status(400).json({message: "O campo 'nome' é necessario"})
    }
    if(body.name === ""){
        return res.status(400).json({message: "O campo 'nome' não pode estar vazio"})
    }
    next()
}

const validateEmail = (req, res, next) => {
    const { body } = req
    if(!validator.isEmail(body.email)) {
        return res.status(400).json({message: "O campo 'email' deve ter um formato válido"})
    }
    if(body.email === undefined){
        return res.status(400).json({message: "O campo 'email' é necessario"})
    }
    if(body.email === ""){
        return res.status(400).json({message: "O campo 'nome' não pode estar vazio"})
    }
    next()
}

const validatePassword = (req, res, next) => {
    const { body } = req
    if(body.password.length < 10){
        return res.status(400).json({message: "Deve ser abaixo de 10 caracteres"})
    }
    if(body.password === undefined) {
        return res.status(400).json({message: "O campo 'senha' é necessario"})
    }
    if(body.password === ""){
        return res.status(400).json({message: "O campo 'senha' não pode ser vazio"})
    }
    next()
}

module.exports = {
    validateName,
    validateEmail,
    validatePassword
}