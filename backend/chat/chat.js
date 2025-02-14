const { WebSocketServer } = require("ws");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


function setUpWebsocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (socket, req) => {
        const token = req.url.split('?token=')[1]; // Extract the token from the query string
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
            socket.close(400, "Invalid token")

        }

    });

    console.log("WebSocket server started on port 3000");
    return wss;
}

module.exports = { setUpWebsocket };
