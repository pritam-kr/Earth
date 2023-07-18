import React, { useState, useEffect, useRef } from "react";
import styles from "./Map.module.scss";
import maplibregl from "maplibre-gl";

const Map = ({ searchValue }) => {
  const MAP_API_KEY = process.env.REACT_APP_MAP_KEY;
  const map = useRef(null);
  const mapContainer = useRef(null);
  const [mapProperties, setMapProperties] = useState({
    lat: 35.6846,
    lang: 139.7525,
    zoom: 1,
    style: "",
  });

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=yu7UtJN0eOg536ACtL8z`,
      center: [mapProperties.lang, mapProperties.lat], // starting position [lng, lat]
      zoom: 3, // starting zoom
      maxZoom: 20,
      preserveDrawingBuffer: true,
      attributionControl: true,
      boxZoom: true,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-left");
    let marker = new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([mapProperties.lang, mapProperties.lat])

      .addTo(map.current);
    marker.addClassName("location-marker");

    map.current.on("load", function () {
      map.current.resize();
    });
  }, [searchValue]);

  return (
    <div className={styles.mapContainer} ref={mapContainer}>
      <div className={styles.locationInfo}></div>
    </div>
  );
};

export default Map;
