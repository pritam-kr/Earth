import React, { useEffect, useRef, useState } from "react";
import styles from "./Temprature.module.scss";
import { useCurrentLanLat } from "../../customHookes";
import maplibregl from "maplibre-gl";
import { useSelector } from "react-redux";

const Temprature = () => {
  const mapContainer = useRef(null);
  const { getLonLatCoordinates } = useCurrentLanLat();
  const [mapStyle, setMapStyle] = useState(
    "https://api.maptiler.com/maps/streets-v2/style.json?key=yu7UtJN0eOg536ACtL8z"
  );

  // Redux States

  const { countryCoordinate } = useSelector((state) => state.mapReducer);

  console.log(countryCoordinate, "countryCoordinate");

  useEffect(() => {
    const getCoodinates = async () => {
      const { longitude, latitude } =
        !countryCoordinate.lng &&
        !countryCoordinate.lat &&
        (await getLonLatCoordinates());

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [
          countryCoordinate.lng ?? longitude,
          countryCoordinate.lat ?? latitude,
        ], // starting position [lng, lat]
        zoom: 4, // starting zoom
        maxZoom: 24,
        preserveDrawingBuffer: true,
        attributionControl: true,
        boxZoom: true,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      let marker = new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([
          countryCoordinate.lng ?? longitude,
          countryCoordinate.lat ?? latitude,
        ])
        .addTo(map);
      marker.addClassName("location-marker");
    };

    getCoodinates();
  }, [countryCoordinate]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mapContainer} ref={mapContainer}></div>
    </div>
  );
};

export default Temprature;
