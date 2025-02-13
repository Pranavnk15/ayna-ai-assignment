const {WebSocketServer} = require('ws');


function setUpWebsocket(server) {
    const wss = new WebSocketServer({ server });
    
    wss.on("connection",function (socket) {
        console.log("New Websocket Connection");
        
        socket.on("message", function (message) {
            console.log("Received msg: "+message.toString());
            socket.send(JSON.stringify({
                message: message.toString()
            }));
        })
        socket.send("Websocket connected");
    })
    
    console.log("Websocket server started n port 3000");
    return wss;
}


module.exports = {
    setUpWebsocket
}