import React, { useEffect, useRef, useState } from "react";
import styles from "./Map.module.scss";
import maplibregl from "maplibre-gl";
import { useCurrentLanLat } from "../../customHookes";
import { useSelector, useDispatch } from "react-redux";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import Loader from "../Loader/Loader";
import * as MapIcons from "react-icons/fc";
import * as FaIcons from "react-icons/fa";
import { useMap } from "../../apiData/useMap";
import MapStats from "../MapStats/MapStats";
import { BASEMAP } from "./constants";

const Map = () => {
  const { findAirPollutionForLocation } = useMap();
  const { getLonLatCoordinates } = useCurrentLanLat();
  const mapContainer = useRef(null);

  // Redux States
  const { coordinates, airPollutionInfo } = useSelector(
    (state) => state.mapReducer
  );
  const dispatch = useDispatch();

  //States
  const [pieChart, showPieChart] = useState(false);
  const [basemap, setBaseMap] = useState(false);
  const [mapStyle, setMapStyle] = useState(
    "https://api.maptiler.com/maps/streets-v2/style.json?key=yu7UtJN0eOg536ACtL8z"
  );

  useEffect(() => {
    const getCoodinates = async () => {
      const { longitude, latitude } = await getLonLatCoordinates();
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
      <div className={styles.mapFooter}>
        <div className={styles.left}>
          <div className={styles.mapbaseWrapper}>
            <FaIcons.FaLayerGroup
              className={styles.mapIcon}
              onClick={() => setBaseMap((prev) => !prev)}
            />

            {basemap && (
              <div className={styles.mapTypes}>
                {BASEMAP.map((item) => (
                  <div onClick={() => setMapStyle(item.mapLink)}>
                    <img src={item.IMGlink} alt="basemap" />{" "}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <div
            className={styles.visulaizeWrapper}
            onClick={() => showPieChart((prev) => !prev)}
          >
            <MapIcons.FcPieChart className={styles.mapIcon} />
          </div>
          <div className={styles.visulaizeWrapper}>
            <MapIcons.FcLineChart className={styles.mapIcon} />
          </div>

          {pieChart && (
            <div className={styles.graphWrapper}>
              <MapStats pieChart={pieChart} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Map);
