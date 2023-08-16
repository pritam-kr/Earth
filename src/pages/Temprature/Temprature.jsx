import React, {  useEffect, useRef, useState } from "react";
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

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      citiesCoordinates.data?.length > 0 &&
        citiesCoordinates.data.forEach(async (item, i) => {
          const { data, status } = await findWeather({
            lat: item.lat,
            lon: item.lon,
          });

          const customMark = document.createElement("div");
          customMark.className = "customMarker";

          const celcius = Math.trunc(data.main.temp);

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
