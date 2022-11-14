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
            {/* <Route path = '/login' component={Login}/> */}

          </Routes>
      </div>
      
        
      </>
  );
}

export default App;

{/* <div>
      Your account is: {account}
    <form onSubmit={(event) => {
      event.preventDefault()
      createAuctionInstance(newAuctionName, startingPrice)
    }}>
      <input type="text" value={newAuctionName} onChange = {({target: { value }}) => setNewAuctionName(value)} name="auctionName" />
      <input type="number" value={startingPrice} onChange = {({target: { value }}) => setStartingPrice(value)} name="startingPrice"/>
      <input type="submit" value="Create Auction" />
    </form>
    <ul id="auctionInstanceList" className="list-unstyled">
      { auctionInstances.map((auctionInstance, key) => {
        return(
          <div id="auctionInstanceTemplate" key={key}>
            <span className="content">{auctionInstance.content}</span>
            <span className="startingPrice">{auctionInstance.startingPrice}</span>
          </div>
        )
      })}
    </ul>
    </div> */}
