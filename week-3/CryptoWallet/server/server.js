const {PORT} = require('./constants');
const express = require('express');
const cors = require('cors');
const ConnectDB = require('./src/db/connection');
const authMiddleware = require('./src/middleware/auth');
const dashboardRouter = require('./src/routes/dashboard');

if(require.main === module) {

    ConnectDB();

    const app = express();
    app.use(express.json());
    app.use(cors({
        origin : true
    }));

    app.listen(PORT, ()=>{
        console.log("Server started succeessfully at ",PORT);
    });

    app.get("/",(req,res)=>{
        res.send("Welcome to crypto server");
    });

    app.use("/auth",authMiddleware);
    app.use("/dashboard",dashboardRouter);
}