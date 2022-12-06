import React, { Component }  from 'react';
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import MyList from './pages/MyList';


const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path = '/Detail' element={<Detail />} />
      <Route path = '/MyList' element = {<MyList />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);