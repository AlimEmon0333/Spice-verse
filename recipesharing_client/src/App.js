import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/signup/signup";
import Startup from "./pages/startup/startup";
import "./App.css"
import Login from "./pages/login/login";
import Loading from "./pages/loading/loading";
import Dashboard from "./pages/dashboard/dashboard";
import Home from "./pages/allhome/home";
import SingleRecipe from "./pages/singleRecipe/singleRecipe";
import AddRecipe from "./pages/addRecipe/addRecipe";
import AddShoppingList from "./pages/Shoppinglist/addShoppingList";
import ShoppingList from "./pages/ShoppingLists/shoppingList";


function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Startup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/singleRecipe/:id" element={<SingleRecipe />} />
          <Route path="/addRecipe" element={<AddRecipe />} />
          <Route path="/addShoppingList" element={<AddShoppingList />} />
          <Route path="/shoppingList" element={<ShoppingList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

