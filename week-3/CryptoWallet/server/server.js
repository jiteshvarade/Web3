const { PORT, ETH_PUBLIC_URL } = require('./constants');
const express = require('express');
const cors = require('cors');
const ConnectDB = require('./src/db/connection');
const authMiddleware = require('./src/middleware/auth');
const dashboardRouter = require('./src/routes/dashboard');
const WebSocket = require('ws');
const {ethers} = require('ethers');

if (require.main === module) {
    ConnectDB();

    const app = express();
    app.use(express.json());
    app.use(cors({
        origin: true
    }));

    const wss = new WebSocket.Server({ noServer: true });

    wss.on('connection', (ws) => {
        console.log('New WebSocket connection established.');

        const provider = new ethers.JsonRpcProvider(ETH_PUBLIC_URL);
        provider.on('block', async (blockNumber) => {
            console.log(`New block: ${blockNumber}`);
            
            const block = await provider.getBlock(blockNumber);
            
            for (const txHash of block.transactions) {
                const tx = await provider.getTransaction(txHash);
                console.log(tx);
                ws.send(JSON.stringify(tx));
            }
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed.');
        });
    });

    const server = app.listen(PORT, () => {
        console.log("Server started successfully at ", PORT);
    });

    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    app.get("/", (req, res) => {
        res.send("Welcome to crypto server");
    });

    app.use("/auth", authMiddleware);
    app.use("/dashboard", dashboardRouter);
}
