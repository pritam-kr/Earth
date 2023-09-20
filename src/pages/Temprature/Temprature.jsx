import React, { useEffect, useRef, useState } from "react";
import styles from "./Temprature.module.scss";
import { useCurrentLanLat, useMapStyle } from "../../customHookes";
import maplibregl from "maplibre-gl";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../components";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import MapFooter from "../../components/MapFooter/MapFooter";
import { useServices } from "../../services/useServices";
import { getPopup, weatherForcast } from "./constant";
import { useWeatherContext } from "../../context/weatherContext";

const Temprature = () => {
  // Hooks
  const { mapStyle, setMapStyle } = useMapStyle();
  const { getWeatherInfo, getWeatherForcast } = useServices();
  const { getLonLatCoordinates } = useCurrentLanLat();

  // Redux States
  const { weatherReducer } = useSelector((state) => state);
  const { countryCoordinate, mapLoading } = weatherReducer;
  const dispatch = useDispatch();

  // New

  const { state: weatherContextState, dispatch: weatherContextDispath } =
    useWeatherContext();

  console.log(weatherContextState);

  // States
  const [forcastData, setForcastData] = useState({
    data: null,
    loading: false,
    error: "",
  });

  const mapContainer = useRef(null);

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
        zoom: 4, // starting zoom
        maxZoom: 24,
        preserveDrawingBuffer: true,
        attributionControl: true,
        boxZoom: true,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      const response =
        weatherContextState?.citiesCoordinates?.citiesCoordinatesList?.map(
          (item) => getWeatherInfo({ lat: item.lat, lon: item.lon })
        );

      const data = response && (await Promise.allSettled(response));

      data &&
        data
          ?.filter(
            (item) =>
              item?.value?.status === 200 || item?.status === "fulfilled"
          )
          .forEach((item) => {
            const weatherInfo = item?.value?.data;
            const customMark = document.createElement("div");
            customMark.className = "customMarker";
            const celcius = Math.trunc(weatherInfo.main.temp);
            const temp = document.createElement("p");
            temp.className = "temp";
            temp.textContent = `${celcius}°C`;
            customMark.appendChild(temp);

            customMark.addEventListener("click", (e) => {
              const {
                value: {
                  data: {
                    coord: { lon, lat },
                  },
                },
              } = item;

              weatherForcast({ lon, lat, setForcastData, getWeatherForcast });
            });

            new maplibregl.Marker({
              color: "#FF0000",
              element: customMark,
            })
              .setLngLat([weatherInfo.coord.lon, weatherInfo.coord.lat])
              .setPopup(getPopup({ weatherInfo }))
              .addTo(map);
          });
    };

    getCoodinates();
  }, [
    countryCoordinate,
    weatherContextState?.citiesCoordinates?.citiesCoordinatesList,
    mapStyle,
  ]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mapContainer} ref={mapContainer}></div>

      {mapLoading && (
        <div className={styles.mapLoader}>
          <Loader width={50} height={50} />
        </div>
      )}

      <MapFooter setMapStyle={setMapStyle} mapContainerRef={mapContainer} />
    </div>
  );
};

export default Temprature;
