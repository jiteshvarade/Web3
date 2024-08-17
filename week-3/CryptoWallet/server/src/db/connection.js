const mongoose = require("mongoose");
const {MONGODB_URL,DB_NAME} = require('../../constants');

const ConnectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${MONGODB_URL}/${DB_NAME}`);
        console.log("MongoDB connection established!", connectionInstance.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = ConnectDB;