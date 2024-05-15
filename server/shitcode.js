import React, { useState, useEffect} from 'react'
import { MapContainer, Marker, ImageOverlay } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'

import testmap from './static/imgs/testMap.jpg';
import './App.css'
import { useCookies } from 'react-cookie';
import { io } from 'socket.io-client';
import HomePage from './Home';

export const socket = io('http://localhost:5000');

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});



function BuyItem(props){
  return(
    <div className="Item2Buy">
        <img alt="Can, that you want buy." ></img>
        <div>
            <h1>hello</h1>
            <h3>30,-</h3>
        </div>
    </div>
)
}


function sendcanstobuy(canid, cookiesetter){
  console.log('hello');
  const data = {
    canid: canid
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
    cookiesetter("userid", data.userid, {sameSite: 'None',secure: true})
  })
  .catch(error => {
    console.error('There was an error with the POST request:', error);
  });
}



function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['isDelivering', 'product', 'userid']);
  const [products, SetProducts] = useState([{}])

  useEffect(() => {
    fetch("/products").then(
      res => res.json()
    ).then(
      data => {
        SetProducts(data)
        console.log(data)
      }
    );
    function onDeliver(value) {
      console.log("geted from socket:",value)
      console.log("saved to cookies:",cookies.userid);
      if (value === cookies.userid){
        console.log("it's me!");
        setCookie("isDelivering", false, {sameSite: 'None',secure: true})
        window.location.href = "/done"
      }
    }  
    socket.on('Delivered', onDeliver);
  }, [cookies.client_id, setCookie])

  
  
  let paypage = (
    <div className="PayPage">
      <div className="PaymentCard">
        <BuyItem />
      </div>
    </div>
  );
  const [markerPosition, setMarkerPosition] = useState([0, 0]);
  const bounds = [[-50, -50], [50, 50]];
  const maxbounds = [[-100, -100], [100, 100]];
  const handleMarkerDrag = (e) => {
    // Get the new marker position when dragged
    let markerpos = e.target.getLatLng()
    if ((markerpos.lat) > bounds[1][0]){
      markerpos.lat = 50
    }
    if ((markerpos.lat) < bounds[0][0]){
      markerpos.lat = -50
    }
    if ((markerpos.lng) > bounds[1][1]){
      markerpos.lng = 50
    }
    if ((markerpos.lng) < bounds[0][1]){
      markerpos.lng = -50
    }
    setMarkerPosition(markerpos)
    console.log(markerpos)
  };
  
  

  let donepage=(
    <div className='DonePage'>
      <h1>Spot Is Here</h1>
      <button onClick={() => {window.location.href = "/"}}>Return To Home Page</button>
    </div>
  )
  switch (window.location.pathname){
    case "/done":
      return donepage;
    case "/chooselocation":
      return mappage;
    case "/payment":
      return paypage;
    default:
      return <HomePage products={products}/>;
  }
}

export default App;