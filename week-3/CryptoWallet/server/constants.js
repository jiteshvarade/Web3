require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;
const ETH_PUBLIC_URL = process.env.ETH_PUBLIC_URL;

module.exports = {PORT, MONGODB_URL, DB_NAME, ETH_PUBLIC_URL};