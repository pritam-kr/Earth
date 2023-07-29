import React, { useEffect, useRef } from "react";
import styles from "./Map.module.scss";
import maplibregl from "maplibre-gl";
import { useCurrentLanLat } from "../../customHookes";
import { useSelector, useDispatch } from "react-redux";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import Loader from "../Loader/Loader";

const Map = ({ searchValue }) => {
  const { getLonLatCoordinates } = useCurrentLanLat();
  const dispatch = useDispatch();
  const mapContainer = useRef(null);

  const { airPollutionInfo, currentUserLocationInfo, coordinates, isLoading } =
    useSelector((state) => state.mapReducer);
  const userCurrentInfoLoading = currentUserLocationInfo?.userInfoDataLoading;

  useEffect(() => {
    const getCoodinates = async () => {
      dispatch({ type: MAP_ACTIONS.RANDOM_LOADING, payload: true });
      // Co-ordinate on map
      const { longitude, latitude } = await getLonLatCoordinates();
      if (longitude && latitude) {
        dispatch({ type: MAP_ACTIONS.RANDOM_LOADING, payload: false });
      }

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=yu7UtJN0eOg536ACtL8z`,
        center: [longitude, latitude], // starting position [lng, lat]
        zoom: 3, // starting zoom
        maxZoom: 24,
        preserveDrawingBuffer: true,
        attributionControl: true,
        boxZoom: true,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      let marker = new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([longitude, latitude])
        .addTo(map);
      marker.addClassName("location-marker");
    };

    getCoodinates();
  }, [coordinates?.lat, coordinates?.lon]);

  console.log(airPollutionInfo, "airPollutionInfo", coordinates)

  return (
    <div className={styles.mapContainer} ref={mapContainer}>
      {airPollutionInfo && (
        <div className={styles.locationInfo}>
          {userCurrentInfoLoading || isLoading ? (
            <div className={styles.loaderWrapper}>
              <Loader
                src={
                  "https://res.cloudinary.com/dhqxln7zi/image/upload/v1679836774/FormalBewitchedIsabellinewheatear-max-1mb.gif"
                }
                width={40}
                height={40}
              />
            </div>
          ) : (
            <>
              <div className={styles.header}>
                <h2>
                  {coordinates?.location}
                  {coordinates?.cityState && `, ${coordinates?.cityState}`}
                </h2>

                <p className={styles.lonLat}>
                  {airPollutionInfo?.coord?.lon}
                  {airPollutionInfo?.coord?.lat &&
                    `, ${airPollutionInfo?.coord?.lat}`}
                </p>
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(Map);
