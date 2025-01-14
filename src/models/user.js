const mongoose = require("mongoose")
// const { refreshToken } = require("../controllers/userController")

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true,},
    email: {type: String, required: true, unique:true,},
    password: {type: String, required: true,},
    refreshToken: {type: String, default: null}
})

module.exports = mongoose.model("User", userSchema)