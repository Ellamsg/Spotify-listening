import React from "react";
import "./App.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Songdetails from "./pages/Songdetails";

import Home from "./pages/Home";
import About from "./pages/About";
import RootL from "./RootL";
import Intro from "./pages/intro";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootL/>}>
         <Route index path="/" element={< Intro/>} />
      <Route  path="/Home" element={<Home />} />
      <Route path="/about"  element={<About/>} />
      <Route path="/Songdetails/:id" element={< Songdetails/>} />
   
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
