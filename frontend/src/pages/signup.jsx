import { useState } from "react"
import axios from 'axios';

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    async function handleSubmit() {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                username, password
            })

            if (response) {
                alert("User Sign up successfull")
            } else {

                alert("User not registered, try again")
            }

        } catch (e) {
            alert("Error Signing Up, try again later", e);
        }
    }


    return (
        <div className="h-screen w-screen text-white bg-gray-900 flex justify-center items-center">

            <div className="mt-30 rounded-md bg-gray-700 p-2 w-[384px] h-[356px]">
                <div className="p-4">
                    <div>
                        <h2 className="mt-2 text-lg text-center">Sign Up</h2>
                    </div>
                    <div className="w-full pb-2">
                        <div className="m-2">
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="rounded-md text-white p-2 w-full bg-gray-500">
                            <input
                                className="w-full bg-gray-500 text-white outline-none border-none focus:ring-0"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full ">
                        <div className="m-2">
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="rounded-md text-white p-2 w-full bg-gray-500">
                            <input
                                className="w-full bg-gray-500 text-white outline-none border-none focus:ring-0"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-2 text-center">
                    <button onClick={handleSubmit} className="w-full p-2 bg-blue-300 rounded-md">
                        Sign Up
                    </button>
                </div>
                <div className="flex justify-evenly">
                    <div>
                        <p>Already Have an Account?</p>
                    </div>
                    <div>
                        <p className="text-blue-300"><a href="">Sign In</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}