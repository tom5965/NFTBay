import React, { Component }  from 'react';
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
// import Login from "./pages/Login";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="Login" element={<Login />} /> */}
    </Routes>
  </BrowserRouter>,
  rootElement
);