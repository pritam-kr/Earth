import React, { useState, useEffect, useRef } from "react";
import styles from "./Map.module.scss";
import maplibregl from "maplibre-gl";
import { useCurrentLanLat } from "../../customHookes";

const Map = ({ searchValue }) => {
  const { loading, latitude, longitude } = useCurrentLanLat();
 
  const mapContainer = useRef(null);
  const [mapProperties, setMapProperties] = useState({
    lat: null,
    lon: null,
    zoom: 1,
    style: "",
  });
 
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((coordinate) => {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=yu7UtJN0eOg536ACtL8z`,
        center: [
          mapProperties.lon ?? coordinate.coords.longitude,
          mapProperties.lat ?? coordinate.coords.latitude,
        ], // starting position [lng, lat]
        zoom: 3, // starting zoom
        maxZoom: 24,
        preserveDrawingBuffer: true,
        attributionControl: true,
        boxZoom: true,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      let marker = new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([
          mapProperties.lon ?? coordinate.coords.longitude,
          mapProperties.lat ?? coordinate.coords.latitude,
        ])
        .addTo(map);
      marker.addClassName("location-marker");

      // Add geolocate control to the map.
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );
    });

    console.log("ppp");
  }, [loading, latitude, longitude]);

  return (
    <div className={styles.mapContainer} ref={mapContainer}>
      <div className={styles.locationInfo}></div>
    </div>
  );
};

export default React.memo(Map);
