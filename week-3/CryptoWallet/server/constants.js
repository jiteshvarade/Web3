require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;

module.exports = {PORT, MONGODB_URL, DB_NAME};