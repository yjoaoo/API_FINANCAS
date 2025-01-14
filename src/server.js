const app = require("./app")
require("dotenv").config()
// console.log(process.env)
const jwtSecret = process.env.JWT_SECRET;
const mongoUri = process.env.MONGO_URI;

console.log("JWT Secret: ", jwtSecret)
console.log("Mongo URI: ", mongoUri)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));