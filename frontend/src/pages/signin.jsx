import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    async function handleSubmit() {
        try {
            const response = await axios.post("https://chat-app-backend-two-lime.vercel.app/api/v1/user/signin", {
                username,
                password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                alert(response.data.message);
                navigate("/chat");
            } else {
                alert("User not registered, try again.");
            }
        } catch (e) {
            alert("Error Signing In. Please try again later.", e);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="w-full max-w-sm bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

                
                <div className="mb-4">
                    <label className="block text-gray-300 mb-1" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                
                <div className="mb-6">
                    <label className="block text-gray-300 mb-1" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-200"
                >
                    Sign In
                </button>

                
                <div className="text-center mt-4 text-gray-400">
                    <p>
                        Don't have an account?{" "}
                        <Link className="text-blue-400 hover:underline" to={"/"}>Sign Up</Link>
                        {/* <a href="/signup" className="">
                            Sign Up
                        </a> */}
                    </p>
                </div>
            </div>
        </div>
    );
}
