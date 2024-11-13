import { BrowserRouter, Routes, Route } from "react-router-dom";


import Signup from "./pages/signup";
import Login from "./pages/login";
import Home from "./pages/Home";
import AllPosts from "./AllPosts";

const App = () => {

  return (
    <>

      <div className="text-md p-3 h-screen bg-zinc-900 text-white">

        <Routes>
          <Route exact path="/" element={<Home />} >
            <Route index element={<AllPosts />} />
          </Route>

          <Route path="/Signup" element={<Signup/>} />
          <Route path="/Login" element={<Login />} />

        </Routes>


      </div>
    </>
  )
}

export default App;