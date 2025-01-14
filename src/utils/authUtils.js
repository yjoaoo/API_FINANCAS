require("dotenv").config()
const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if(!JWT_SECRET || !REFRESH_SECRET){
    throw new Error("JTW_SECRET ou REFRESH_SECRET não estão definidos no arquivo .env")
}
const generateAcessToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, {expiresIn: "2h"})
}

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "2d" });
};

module.exports = {
    generateAcessToken,
    generateRefreshToken
}