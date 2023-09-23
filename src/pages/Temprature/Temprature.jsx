import React, { useEffect, useRef, useState } from "react";
import styles from "./Temprature.module.scss";
import { useCurrentLanLat, useMapStyle } from "../../customHookes";
import maplibregl from "maplibre-gl";
import { Loader } from "../../components";
import MapFooter from "../../components/MapFooter/MapFooter";
import { useServices } from "../../services/useServices";
import { getPopup, weatherForcast } from "./constant";
import { useWeatherContext } from "../../context/weatherContext";
import { useErrorContext } from "../../context/errorContext";

const Temprature = () => {
  // Custom hooks
  const { mapStyle, setMapStyle } = useMapStyle();
  const { getWeatherInfo, getWeatherForcast } = useServices();
  const { getLonLatCoordinates } = useCurrentLanLat();
  const { setIsError } = useErrorContext();

  // States
  const [mapLoading, setMapLoading] = useState(false);

  // Context states
  const {
    state: {
      currentCountryCoordinate,
      citiesCoordinates: {
        citiesCoordinatesList,
        isLoading: citiesCoordinatesListLoading,
      },
    },
    dispatch,
  } = useWeatherContext();

  // States
  const [forcastData, setForcastData] = useState({
    data: null,
    loading: false,
    error: "",
  });

  const mapContainer = useRef(null);

  const getCoodinates = async () => {
    setMapLoading(true);

    const { longitude, latitude } =
      !currentCountryCoordinate?.lon &&
      !currentCountryCoordinate?.lat &&
      (await getLonLatCoordinates());

    if (longitude && latitude) {
      setMapLoading(false);
    }

    setMapLoading(false);

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [
        currentCountryCoordinate?.lon ?? longitude,
        currentCountryCoordinate?.lat ?? latitude,
      ], // starting position [lng, lat]
      zoom: 4, // starting zoom
      maxZoom: 24,
      preserveDrawingBuffer: true,
      attributionControl: true,
      boxZoom: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const response = citiesCoordinatesList?.map((item) =>
      getWeatherInfo({ lat: item.lat, lon: item.lon })
    );

    const data = response && (await Promise.allSettled(response));

    if (data?.some((item) => item.status === "rejected")) {
      setIsError((prev) => ({ ...prev, openWeatherApi: true }));
    } else {
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
    }
  };

  useEffect(() => {
    getCoodinates();
  }, [citiesCoordinatesList, mapStyle, currentCountryCoordinate]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mapContainer} ref={mapContainer}></div>

      {(mapLoading || citiesCoordinatesListLoading) && (
        <div className={styles.mapLoader}>
          <Loader width={50} height={50} />
        </div>
      )}

      <MapFooter setMapStyle={setMapStyle} mapContainerRef={mapContainer} />
    </div>
  );
};

export default Temprature;
