import React, { useEffect, useRef } from "react";
import styles from "./Map.module.scss";
import maplibregl from "maplibre-gl";
import { useCurrentLanLat, useMapStyle } from "../../customHookes";
import MapFooter from "../MapFooter/MapFooter";
import { useMapContext } from "../../context/mapContext";
import { useAirPollution } from "../../services/useAirPollution";
import { CONTEXT_ACTIONS } from "../../context/contextActions";

const Map = ({ setMapLoading }) => {

  // Hooks
  const { getLonLatCoordinates } = useCurrentLanLat();
  const { mapStyle, setMapStyle } = useMapStyle();

  // New
  const { getAirPollution, airPollutionLoading } = useAirPollution();

  //States
  const mapContainer = useRef(null);

  // Context State
  const {
    dispatch,
    state: { currentLocationCoordinate, locationCoordinate },
  } = useMapContext();

  const getCoodinates = async () => {
    // On the intial rendring
    setMapLoading(true);
    // Getting user current Location's coordinates
    const { longitude, latitude } = await getLonLatCoordinates();
    if (longitude && latitude) setMapLoading(false);

    if (!locationCoordinate.lon && !locationCoordinate.lat)
      getAirPollution(
        { lon: longitude, lat: latitude },
        {
          onSuccess: (data) => {
            dispatch({
              type: CONTEXT_ACTIONS.GET_AIRPOLLUTION,
              payload: { ...data, isLoading: airPollutionLoading },
            });
          },
        }
      );

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [
        locationCoordinate.lon ?? longitude,
        locationCoordinate.lat ?? latitude,
      ], // starting position [lng, lat]
      zoom: 3, // starting zoom
      maxZoom: 24,
      preserveDrawingBuffer: true,
      attributionControl: true,
      boxZoom: true,
    });

    new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([
        locationCoordinate.lon ?? longitude,
        locationCoordinate.lat ?? latitude,
      ])
      .addTo(map);

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("click", (e) => {
      getAirPollution(
        { lon: e.lngLat.lng, lat: e.lngLat.lat },
        {
          onSuccess: (data) => {
            dispatch({
              type: CONTEXT_ACTIONS.GET_AIRPOLLUTION,
              payload: { ...data, isLoading: airPollutionLoading },
            });
          },
        }
      );
    });
  };

  useEffect(() => {
    getCoodinates();
  }, [locationCoordinate, mapStyle]);

  return (
    <div className={styles.mapContainer} ref={mapContainer}>
      <MapFooter
        loadingProp={airPollutionLoading}
        setMapStyle={setMapStyle}
        mapContainerRef={mapContainer}
      />
    </div>
  );
};

export default React.memo(Map);
