import React from 'react';
import './App.css';
import {EnterAddressForm} from "./enter-address/enter-address";


function App() {
  return (
    <div className="App">
    <EnterAddressForm onSendCoords={()=>{}}/>
    </div>
  );
}

export default App;
