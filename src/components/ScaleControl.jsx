import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css'; // Ensure you have Leaflet CSS

const ScaleControl = () => {
    const map = useMap();
    // var scale = L.control.scale().addTo(map);
    // var metres = scale._getRoundNum(map.containerPointToLatLng([0, map.getSize().y / 2]).distanceTo(map.containerPointToLatLng([scale.options.maxWidth, map.getSize().y / 2])))
    // const label = metres < 1000 ? metres + ' m' : (metres / 1000) + ' km';

    // console.log(label);

    useEffect(() => {
        // Create and add scale control
        const scale = L.control.scale({
            position: 'bottomright',
            maxWidth: 150,
            imperial: false,
            metric: true,
            updateWhenIdle: true
        }).addTo(map);

        // Cleanup on unmount
        return () => {
            map.removeControl(scale);
        };
    }, [map]);

    return null;
};

export default ScaleControl;
