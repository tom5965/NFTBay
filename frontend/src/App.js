import './App.css';
import { useEffect, useState } from 'react';

import React from 'react';
import {BrowserRouter, BrowserRouter as Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import MyList from './pages/MyList';

function App() {
  

  return(
    <>
      <div className = 'App'>

          <Routes>
      
            <Route exact path = '/' element={<Home />} />
            <Route exact path = '/Detail' element={<Detail />} />
            <Route exact path = '/MyList' element = {<MyList />}/>

          </Routes>
      </div>
      
        
      </>
  );
}

export default App;
