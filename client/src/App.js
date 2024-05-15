
import React, { useState, useEffect} from 'react'
import { useCookies } from 'react-cookie';
import { io } from 'socket.io-client';

import './App.css'

import HomePage from './Home';
import MapPage from './Map';
import DonePage from './Done';




const flaskURI = "http://localhost:5000" 

export const socket = io(flaskURI);


function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['client_id','choosed_product']);
  const [products, SetProducts] = useState()
  useEffect(() => {
    fetch(flaskURI+"/products").then(
      res => res.json()
    ).then(
      data => {
        SetProducts(data)
      }
    ).catch(error => {
      console.error('Error fetching products:', error);
    });
    function onDeliver(value) {
      console.log("geted from socket:",value)
      console.log("saved to cookies:",cookies.client_id);
      if(cookies.client_id === value){
        removeCookie("client_id")
        window.location.href = "/done"
      }
    }  
    socket.on('Delivered', onDeliver);
  }, [SetProducts, cookies.client_id, removeCookie])
  return <ShowPages 
            products={products} 
            cookies={cookies} 
            setCookie={setCookie}
          />
}

function ShowPages(pros) { //args: [products, cookies, setCookie] 

  if (typeof pros.cookies.client_id !== "undefined"){
    if (window.location.pathname !== "/waitforspot")
    window.location.href = "/waitforspot"
  }
  switch (window.location.pathname){
    case "/done":
      return <DonePage />
    case "/waitforspot":
      return <p>Wait for spot</p>
    case "/chooselocation":
      return <MapPage 
                onChoose={sendProductsAndGetID}
                args = {{"cookies":pros.cookies, "setCookie":pros.setCookie}}
              />
    default:
      return <HomePage 
                products={pros.products} 
                onChoose={Handle_product_onchoose} 
                func_args={{"setCookie" : pros.setCookie}}
              />
  }
}

function Handle_product_onchoose(canid, args){ // args: [setCookie]
    console.log(canid);
    args.setCookie('choosed_product', canid);
    window.location.href = "/chooselocation"
}


function sendProductsAndGetID(args){ // args: [cookies, setCookie]
  console.log('hello');
  const data = {
    canid: args.cookies.choosed_product
  };
  fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Response from Flask:', data.userid);
    args.setCookie("client_id", data.userid)
  })
  .catch(error => {
    console.error('There was an error with the POST request:', error);
  });
}

export default App;