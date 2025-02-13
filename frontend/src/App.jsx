import { BrowserRouter, Route, Routes } from "react-router-dom";

import ChatApp from "./pages/chat"
import Signin from "./pages/signin"
import Signup from "./pages/signup"

function App() {
  return (

    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/chat' element={<ChatApp />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
