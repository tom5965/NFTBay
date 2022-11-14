import './App.css';
import { useEffect, useState } from 'react';

import React from 'react';
import {BrowserRouter, BrowserRouter as Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
// import Login from './pages/Login';

function App() {
  

  return(
    <>
      <div className = 'App'>

          <Routes>
      
            <Route exact path = '/' element={<Home />} />
            

          </Routes>
      </div>
      
        
      </>
  );
}

export default App;
