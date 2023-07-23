import React, { useState, useEffect, useRef } from "react";
import styles from "./Map.module.scss";
import maplibregl from "maplibre-gl";
import { useCurrentLanLat } from "../../customHookes";
import axios from "axios";
import { apiKey } from "../../apiData/useMap";
import { useDispatch, useSelector } from "react-redux";
import { MAP_ACTIONS } from "../../redux/actions/actions";

const Map = ({ searchValue }) => {
  const { getLonLatCoordinates } = useCurrentLanLat();
  const mapContainer = useRef(null);
  const dispatch = useDispatch();
  const { airPollutionInfo, currentUserLocationInfo, locationList } =
    useSelector((state) => state.mapReducer);

  const userInfoData = currentUserLocationInfo?.userInfoData;

  const [mapProperties, setMapProperties] = useState({
    lat: null,
    lon: null,
    zoom: 1,
    style: "",
  });

  const findAirPollutionForLocation = async (lon, lat) => {
    try {
      dispatch({
        type: MAP_ACTIONS.GET_AIR_POLLUTION,
        payload: { isLoading: true, data: null },
      });
      const { data, status } = await axios.get(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );

      if (status === 200)
        dispatch({
          type: MAP_ACTIONS.GET_AIR_POLLUTION,
          payload: {
            isLoading: false,
            data: {
              ...data,
            },
          },
        });
    } catch (error) {
      dispatch({
        type: MAP_ACTIONS.GET_AIR_POLLUTION,
        payload: { isLoading: false, data: null },
      });
      console.log(`Something went wrong ${error.message}`);
    }
  };

  useEffect(() => {
    const getCoodinates = async () => {
      const { longitude, latitude } = await getLonLatCoordinates();

      if (!mapProperties.lon && !mapProperties.lat) {
        findAirPollutionForLocation(longitude, latitude);
      }

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=yu7UtJN0eOg536ACtL8z`,
        center: [mapProperties.lon ?? longitude, mapProperties.lat ?? latitude], // starting position [lng, lat]
        zoom: 3, // starting zoom
        maxZoom: 24,
        preserveDrawingBuffer: true,
        attributionControl: true,
        boxZoom: true,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      let marker = new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([
          mapProperties.lon ?? longitude,
          mapProperties.lat ?? latitude,
        ])
        .addTo(map);
      marker.addClassName("location-marker");

      // Add geolocate control to the map.
      // map.addControl(
      //   new maplibregl.GeolocateControl({
      //     positionOptions: {
      //       enableHighAccuracy: true,
      //     },
      //     trackUserLocation: true,
      //   })
      // );
    };

    getCoodinates();
  }, []);

  return (
    <div className={styles.mapContainer} ref={mapContainer}>
      {airPollutionInfo && (
        <div className={styles.locationInfo}>
          <div className={styles.header}>
            <h2>
              {userInfoData?.city}, {userInfoData?.state}
            </h2>

            <p className={styles.lonLat}>
              {airPollutionInfo?.coord?.lon}, {airPollutionInfo?.coord?.lat}
            </p>

            {/* <p className={styles.dateTime}>
          {new Date(airPollutionInfo?.list[0]?.dt)}
        </p> */}
          </div>

          <div className={styles.footer}>
            <h3>Components in Air </h3>

            <ul>
              {airPollutionInfo?.list?.map((item) => (
                <li className={styles?.aqi}>AQI: {item.main.aqi}</li>
              ))}
              {airPollutionInfo?.list?.map((item) =>
                Object.keys(item.components).map((item2) => (
                  <li>
                    {item2}: {item.components[item2]}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Map);
