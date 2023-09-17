import React, { useEffect, useRef } from "react";
import styles from "./Map.module.scss";
import maplibregl from "maplibre-gl";
import { useCurrentLanLat, useMapStyle } from "../../customHookes";
import { useSelector, useDispatch } from "react-redux";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import MapFooter from "../MapFooter/MapFooter";
import { useServices } from "../../services/useServices";

const Map = () => {
  // Hooks
  const { findAirPollutionForLocation } = useServices();
  const { getLonLatCoordinates } = useCurrentLanLat();
  const { mapStyle, setMapStyle } = useMapStyle();

  // Redux states
  const { coordinates } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();

  //States
  const mapContainer = useRef(null);

  const getCoodinates = async () => {
    // On the in
    dispatch({ type: MAP_ACTIONS.RANDOM_LOADING, payload: true });
    // Getting user current Location's coordinates
    const { longitude, latitude } = await getLonLatCoordinates();
    if (longitude && latitude)
      dispatch({ type: MAP_ACTIONS.RANDOM_LOADING, payload: false });

    if (!coordinates.lon && !coordinates.lat)
      findAirPollutionForLocation(longitude, latitude);

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

    new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([coordinates.lon ?? longitude, coordinates.lat ?? latitude])
      .addTo(map);

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("click", (e) => {
      findAirPollutionForLocation(e.lngLat.lng, e.lngLat.lat);
    });
  };

  useEffect(() => {
    getCoodinates();
  }, [coordinates, mapStyle]);

  return (
    <div className={styles.mapContainer} ref={mapContainer}>
      <MapFooter setMapStyle={setMapStyle} mapContainerRef={mapContainer} />
    </div>
  );
};

export default React.memo(Map);
