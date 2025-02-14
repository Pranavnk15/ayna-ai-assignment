import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatApp() {
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [wsStatus, setWsStatus] = useState("Connecting...");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const socketRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedSessions = JSON.parse(localStorage.getItem("chatSessions")) || [];
        setSessions(storedSessions);

        if (storedSessions.length > 0) {
            setCurrentSession(storedSessions[0].id);
            loadMessages(storedSessions[0].id);
        }
    }, []);

    useEffect(() => {
        if (!currentSession) return;

        connectWebSocket();
        loadMessages(currentSession);

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [currentSession]);

    const connectWebSocket = () => {
        if (socketRef.current) {
            socketRef.current.close();
        }

        setWsStatus("Connecting...");
        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in to chat");
            navigate("/signin");
        }
        socketRef.current = new WebSocket(`wss://chat-app-backend-two-lime.vercel.app/?token=${token}`);

        socketRef.current.onopen = () => {
            setWsStatus("Connected");
        };

        socketRef.current.onclose = () => {
            setWsStatus("Closed");
        };

        socketRef.current.onerror = () => {
            setWsStatus("Failed");
        };

        socketRef.current.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);

            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, receivedMessage];
                localStorage.setItem(`messages_${currentSession}`, JSON.stringify(updatedMessages));
                return updatedMessages;
            });
        };
    };

    const createNewSession = () => {
        const newSession = { id: Date.now(), name: `Session ${sessions.length + 1}` };
        const updatedSessions = [...sessions, newSession];

        setSessions(updatedSessions);
        localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));

        setCurrentSession(newSession.id);
        setMessages([]);
    };

    const loadMessages = (sessionId) => {
        const storedMessages = JSON.parse(localStorage.getItem(`messages_${sessionId}`)) || [];
        setMessages(storedMessages);
    };

    const sendMessage = () => {
        if (input.trim() === "") return;

        const newMessage = { text: input, user: "User 1", sessionId: currentSession };

        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage];
            localStorage.setItem(`messages_${currentSession}`, JSON.stringify(updatedMessages));
            return updatedMessages;
        });

        if (socketRef.current) {
            socketRef.current.send(JSON.stringify(newMessage));
        }

        setInput("");
    };

    const logout = () => {
        localStorage.removeItem("token"); 
        navigate("/signin"); 
    };

    return (
        <div className="flex  flex-col md:flex-row h-screen bg-gray-900 text-white">
            <button
                className="md:hidden p-3 bg-gray-800 text-white w-full text-left"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? "Close Sessions" : "Open Sessions"}
            </button>

            <div
                className={`absolute md:static md:w-1/4 p-4 bg-gray-800 transition-all ${sidebarOpen ? "w-full h-full z-50" : "hidden md:block"
                    } relative`}
            >
                <div>
                    <h3 className="text-lg font-bold mb-4">Chat Sessions</h3>
                    <button
                        onClick={createNewSession}
                        className="w-full mb-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                        + New Session
                    </button>
                    <ul>
                        {sessions.map((session) => (
                            <li
                                key={session.id}
                                onClick={() => {
                                    setCurrentSession(session.id);
                                    loadMessages(session.id);
                                    setSidebarOpen(false); // Close sidebar on selection (for mobile)
                                }}
                                className={`cursor-pointer p-2 rounded ${session.id === currentSession ? "bg-green-700" : "hover:bg-gray-600"
                                    }`}
                            >
                                {session.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={logout}
                    className="absolute bottom-4 left-4 w-full md:w-auto bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                    Log Out
                </button>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="p-2 bg-gray-700 text-center text-sm">
                    WebSocket Status:{" "}
                    <span className={wsStatus === "Connected" ? "text-green-400" : "text-red-400"}>
                        {wsStatus}
                    </span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded-lg mb-2 max-w-xs ${msg.user === "User 1"
                                ? "bg-blue-500 text-right ml-auto"
                                : "bg-gray-700 text-left mr-auto"
                                }`}
                        >
                            {msg.user}: {msg.text}
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-gray-800 flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 rounded bg-gray-700 text-white"
                    />
                    <button
                        onClick={sendMessage}
                        className="ml-2 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
