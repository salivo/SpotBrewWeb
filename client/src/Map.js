import React, { useState } from 'react';
import { MapContainer, Marker, ImageOverlay } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'

import testmap from './static/imgs/testMap.jpg';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const bounds = [[-50, -50], [50, 50]];
const maxbounds = [[-100, -100], [100, 100]];

function MapPage(pros){ // args: [onChoose, cookies]
    const [markerPosition, setMarkerPosition] = useState([0, 0]);
    function handleMarkerDrag(e) {
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
    return(
        <div className='MapPage'>
            <MapContainer
                className="test-map"
                center={[50, 50]}
                minZoom={1}
                zoom={2}
                maxZoom={4}
                crs={L.CRS.Simple}
                maxBounds={maxbounds}
            >
                <ImageOverlay url={testmap} bounds={bounds} />
                <Marker position={markerPosition} draggable={true} eventHandlers={{drag: handleMarkerDrag}} bounds={bounds}></Marker>
            </MapContainer>
            <button onClick={() => {pros.onChoose(pros.args)}}>Confirm</button>
        </div>
    )
}



export default MapPage