import React, { createElement, useEffect, useRef, useState } from "react";
import styles from "./Temprature.module.scss";
import { useCurrentLanLat } from "../../customHookes";
import maplibregl from "maplibre-gl";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../components";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import { findWeather } from "./constant";

const Temprature = () => {
  const mapContainer = useRef(null);
  const { getLonLatCoordinates } = useCurrentLanLat();
  const [mapStyle, setMapStyle] = useState(
    "https://api.maptiler.com/maps/streets-v2/style.json?key=yu7UtJN0eOg536ACtL8z"
  );

  // Redux States
  const { countryCoordinate, mapLoading, citiesCoordinates } = useSelector(
    (state) => state.mapReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getCoodinates = async () => {
      dispatch({ type: MAP_ACTIONS.RANDOM_LOADING, payload: true });

      const { longitude, latitude } =
        !countryCoordinate.lng &&
        !countryCoordinate.lat &&
        (await getLonLatCoordinates());

      if (longitude && latitude) {
        dispatch({ type: MAP_ACTIONS.RANDOM_LOADING, payload: false });
      }
      dispatch({ type: MAP_ACTIONS.RANDOM_LOADING, payload: false });

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [
          countryCoordinate.lng ?? longitude,
          countryCoordinate.lat ?? latitude,
        ], // starting position [lng, lat]
        zoom: 3, // starting zoom
        maxZoom: 24,
        preserveDrawingBuffer: true,
        attributionControl: true,
        boxZoom: true,
      });

      // -40 to -20 #B40682
      //  -20 to 0 #440289
      // 0 to 20 #0000FB
      // 20 to 40 #0EFFFE
      // 40 to 60 #FDE900
      // 60 to 80  #FD0100

      function getColorForTemperature(temperature) {
        switch (true) {
          case temperature >= -40 && temperature < -20:
            return "#B40682";
          case temperature >= -20 && temperature < 0:
            return "#440289";
          case temperature >= 0 && temperature < 20:
            return "#0000FB";
          case temperature >= 20 && temperature < 40:
            return "#0EFFFE";
          case temperature >= 40 && temperature < 60:
            return "#FDE900";
          case temperature >= 60 && temperature <= 80:
            return "#FD0100";
          default:
            return "#000000"; // Default color for temperatures outside the defined ranges
        }
      }

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      citiesCoordinates.data.forEach(async (item, i) => {
        const { data, status } = await findWeather({
          lat: item.lat,
          lon: item.lon,
        });

        const customMark = document.createElement("div");
        customMark.className = "customMarker";

        const celcius = Math.trunc(data.main.temp);
        // customMark.style.borderTopColor = `${getColorForTemperature(celcius)}`;

        const temp = document.createElement("p");
        temp.className = "temp";
        temp.textContent = `${celcius}°C`;
        customMark.appendChild(temp);

        let marker = new maplibregl.Marker({
          color: "#FF0000",
          element: customMark,
        })
          .setLngLat([item.lon, item.lat])
          .addTo(map);
      });

      // marker.addClassName("location-marker");
    };

    getCoodinates();
  }, [countryCoordinate, citiesCoordinates.data]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mapContainer} ref={mapContainer}></div>

      {(mapLoading || citiesCoordinates.isLoading) && (
        <div className={styles.mapLoader}>
          <Loader
            width={50}
            height={50}
            src={
              "https://res.cloudinary.com/dhqxln7zi/image/upload/v1679836774/FormalBewitchedIsabellinewheatear-max-1mb.gif"
            }
          />
        </div>
      )}
    </div>
  );
};

export default Temprature;
