import React, { useState, useEffect, useRef } from "react";
import styles from "./Map.module.scss";
import maplibregl from "maplibre-gl";

const Map = () => {
  const MAP_API_KEY = process.env.REACT_APP_MAP_KEY;
  const map = useRef(null);
  const mapContainer = useRef(null);
  const [mapProperties, setMapProperties] = useState({
    lat: 0,
    lang: 0,
    zoom: 1,
    style: "",
  });

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=yu7UtJN0eOg536ACtL8z`,
      center: [mapProperties.lang, mapProperties.lat], // starting position [lng, lat]
      zoom: 1, // starting zoom
      maxZoom: 20,
      preserveDrawingBuffer: true,
      attributionControl: true,
      maplibreLogo: true,
      boxZoom: true,
    });
  });

  return <div className={styles.mapContainer} ref={mapContainer}>
    
  </div>;
};

export default Map;
