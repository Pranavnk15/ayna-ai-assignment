const { WebSocketServer } = require("ws");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const express = require('express');
const http = require('http');
const cors = require('cors');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (socket, req) => {
    const token = req.url.split('?token=')[1]; 
    if (!token) {
        socket.close(400, "Authentication Required");
        return;
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        socket.username = data.username;
        console.log("User connected: ", socket.username);

        socket.on("message", (message) => {
            console.log("Received msg: " + message.toString());
            const msg = JSON.parse(message);

            socket.send(JSON.stringify({
                text: msg.text,
                user: "Server"
            }));
        });

        socket.send("WebSocket connected");
    } catch (e) {
        console.log("Invalid token: ", e.message);
        socket.close(400, "Invalid token");
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});
