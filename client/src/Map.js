import React, { useState } from 'react';
import { MapContainer, Marker, ImageOverlay } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import testmap from './static/imgs/testMap.png';
import testmask from './static/imgs/testMask.png';

const { Image } = require('image-js');
let image = await Image.load(testmap);
let mask = await Image.load(testmask);
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

console.log('image', image.getPixelXY(300,300));
console.log('mask', mask.getPixelXY(300,300));

const bounds = [[0, 0], [image.height, image.width]];

let last_marker_pos = {lat:0,lng:0}
function MapPage(pros){ // args: [onChoose, cookies]
  
  const [markerPosition, setMarkerPosition] = useState({lat:0,lng:0});
  function handleMarkerDragend(e) {
    // Get the new marker position when dragged
    let markerpos = e.target.getLatLng();
    let x = Math.round(markerpos.lng)
    let y = Math.round(image.height - markerpos.lat)
    console.log(x, y);
    if (mask.getPixelXY(x,y)[0] === 0 || markerpos.lat < 0 || markerpos.lng < 0 || markerpos.lat > image.height || markerpos.lng > image.height){
      
      console.log(markerPosition)
      console.log("nein");
      setMarkerPosition({lat:last_marker_pos.lat,lng:last_marker_pos.lng})
    }
    else{
      setMarkerPosition(markerpos)
      last_marker_pos = markerpos
    }
  };
  function handleMarkerDrag(e){
    let markerpos = e.target.getLatLng();
    let x = Math.round(markerpos.lng)
    let y = Math.round(image.height - markerpos.lat)
    if (mask.getPixelXY(x,y)[0] !== 0 && markerpos.lat > 0 && markerpos.lng > 0 && markerpos.lat < image.height && markerpos.lng < image.width){
      last_marker_pos = markerpos
    }
  }
  return(
    <div className='MapPage'>
      <MapContainer
        className="test-map"
        center={[0, 0]}
        zoom={0}
        crs={L.CRS.Simple}
        maxBounds={bounds}
      >
        <ImageOverlay url={testmap} bounds={bounds} />
        <Marker position={markerPosition} draggable={true} eventHandlers={{drag:handleMarkerDrag, dragend: handleMarkerDragend}} bounds={bounds}></Marker>
      </MapContainer>
      <button onClick={() => {pros.onChoose(pros.args)}}>Confirm</button>
    </div>
  )
}



export default MapPage