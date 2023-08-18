import React, { useEffect, useRef, useState } from "react";
import styles from "./Map.module.scss";
import maplibregl from "maplibre-gl";
import { useCurrentLanLat } from "../../customHookes";
import { useSelector, useDispatch } from "react-redux";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import { useMap } from "../../apiData/useMap";
import { useSearchParams } from "react-router-dom";
import MapFooter from "../MapFooter/MapFooter";

const Map = () => {
  const { findAirPollutionForLocation } = useMap();
  const { getLonLatCoordinates } = useCurrentLanLat();
  const mapContainer = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams({});
  const { coordinates } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();

  //States
  const [mapStyle, setMapStyle] = useState(
    "https://api.maptiler.com/maps/streets-v2/style.json?key=yu7UtJN0eOg536ACtL8z"
  );

  useEffect(() => {
    const getCoodinates = async () => {
      dispatch({ type: MAP_ACTIONS.RANDOM_LOADING, payload: true });
      const { longitude, latitude } = await getLonLatCoordinates();

      if (longitude && latitude) {
        dispatch({ type: MAP_ACTIONS.RANDOM_LOADING, payload: false });
      }

      if (!coordinates.lon && !coordinates.lat)
        findAirPollutionForLocation(longitude, latitude);

      setSearchParams({
        longitude: coordinates.lon ?? longitude,
        latitude: coordinates.lat ?? latitude,
      });
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [coordinates.lon ?? longitude, coordinates.lat ?? latitude], // starting position [lng, lat]
        zoom: 3, // starting zoom
        maxZoom: 24,
        preserveDrawingBuffer: true,
        attributionControl: true,
        boxZoom: true,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      let marker = new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([coordinates.lon ?? longitude, coordinates.lat ?? latitude])
        .addTo(map);
      marker.addClassName("location-marker");
    };

    getCoodinates();
  }, [coordinates, mapStyle]);

  return (
    <div className={styles.mapContainer} ref={mapContainer}>
      <MapFooter setMapStyle={setMapStyle} mapContainerRef={mapContainer} />
    </div>
  );
};

export default React.memo(Map);
