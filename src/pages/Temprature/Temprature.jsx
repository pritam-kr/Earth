import React, { useEffect, useRef, useState } from "react";
import styles from "./Temprature.module.scss";
import { useCurrentLanLat } from "../../customHookes";
import maplibregl from "maplibre-gl";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../components";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import MapFooter from "../../components/MapFooter/MapFooter";
import { useServices } from "../../services/useServices";
import { firstLetterUppercase } from "../../utils/firstLetterUppercase";
import { toast } from "react-hot-toast";

const Temprature = () => {
  const { getWeatherInfo, getWeatherForcast } = useServices();

  const mapContainer = useRef(null);
  const { getLonLatCoordinates } = useCurrentLanLat();
  const [mapStyle, setMapStyle] = useState(
    "https://api.maptiler.com/maps/streets-v2/style.json?key=yu7UtJN0eOg536ACtL8z"
  );

  // States
  const [forcastData, setForcastData] = useState({
    data: null,
    loading: false,
    error: "",
  });

  // Redux States
  const { countryCoordinate, mapLoading, citiesCoordinates } = useSelector(
    (state) => state.mapReducer
  );
  const dispatch = useDispatch();

  const weatherForcast = async ({ lon, lat }) => {
    try {
      setForcastData((prev) => ({ ...prev, loading: true }));
      if (lon && lat) {
        const { data, status } = await getWeatherForcast({ lon, lat });
        if (status === 200)
          setForcastData((prev) => ({
            ...prev,
            loading: false,
            error: "",
            data: data,
          }));
      }
    } catch (error) {
      setForcastData((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      toast.error(error.message);
    }
  };

  console.log(forcastData, "forcastData")

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
        zoom: 5, // starting zoom
        maxZoom: 24,
        preserveDrawingBuffer: true,
        attributionControl: true,
        boxZoom: true,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      const response = citiesCoordinates.data?.map((item) =>
        getWeatherInfo({ lat: item.lat, lon: item.lon })
      );
      const data = await Promise.allSettled(response);

      data
        ?.filter(
          (item) => item?.value?.status === 200 || item?.status === "rejected"
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

            weatherForcast({ lon, lat });
          });

          // create the popup
          const popup = new maplibregl.Popup({ offset: 25 }).setHTML(` <div>
         <p style="font-size:14px; display: flex; align-items: center; margin-top: -10px;">${
           weatherInfo.name
         } <img style="width:40px; object-fit: cover;"  src=https://openweathermap.org/img/wn/${
            weatherInfo.weather[0].icon
          }@2x.png /></p>
         <p style="font-size:10px; color: #808080; height: 0; margin-bottom: 15px;">lon: ${
           weatherInfo.coord.lon
         }, lat: ${weatherInfo.coord.lat}</p>
         <p style="font-size:10px; color: #808080; height: 0; margin-bottom: 15px;"">${firstLetterUppercase(
           weatherInfo.weather[0].description
         )}, ${weatherInfo.main.temp}°C</p>
      </div>`);

          let marker = new maplibregl.Marker({
            color: "#FF0000",
            element: customMark,
          })
            .setLngLat([weatherInfo.coord.lon, weatherInfo.coord.lat])
            .setPopup(popup)
            .addTo(map);
        });
    };

    getCoodinates();
  }, [countryCoordinate, citiesCoordinates.data, mapStyle]);

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

      <MapFooter setMapStyle={setMapStyle} mapContainerRef={mapContainer} />
    </div>
  );
};

export default Temprature;
