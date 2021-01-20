const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8000;

const http = require('http');
const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const cors = require('cors');
const mongoose = require('mongoose');

const { registerUserController } = require('./api/user.controller');

const runServer = async () => {
    try {

        await mongoose.connect(process.env.DB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log("Database connection successful");
        const app = express();
        app.use(cors());
        app.use(express.json());
        const server = http.createServer(app);

        app.use('/', express.static(path.resolve(__dirname, 'static')));
        app.post('/registration', registerUserController)

        
        const socketServer = new WebSocket.Server({ server });
        socketServer.on('connection', ws => {
            ws.on('message', message => {
                socketServer.clients.forEach(client => {
                    if(client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    };
                });
            });
            ws.send(JSON.stringify({ name: 'Chatbot', message: 'Welcome to chat) Let\'s get acquainted, enter your name.' }));
        });

        server.listen(PORT, () => console.log(`start listening on port: ${PORT}`));
    } catch (error) {
        console.log("Database connection error(");
        process.exit(1);
    }
};

runServer();



