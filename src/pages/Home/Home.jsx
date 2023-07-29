import React, { useEffect, useState, useRef } from "react";
import styles from "./Home.module.scss";
import { Map } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useMap } from "../../apiData/useMap";

const Home = ({ setModal }) => {
  const { findAirPollutionForLocation } = useMap();

  const suggestionRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { locationList, currentUserLocationInfo, airPollutionInfo, isLoading } =
    useSelector((state) => state.mapReducer);
  const userCurrentInfoLoading = currentUserLocationInfo?.userInfoDataLoading;
  const airPollutionLoding = airPollutionInfo?.airPoluttionLoading;
  const [suggestionBox, setSuggestionBox] = useState(false);
  const [stats, setShowStats] = useState(false);
  const features = JSON.parse(localStorage.getItem("features"));

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target !== suggestionRef.current && e.target !== inputRef.current) {
        setSuggestionBox(false);
      }
    });

    return () => {
      window.removeEventListener("click", () => {});
    };
  });

  const airPollutionHandler = (e) => {
    const locationInfo = JSON.parse(e.target.getAttribute("data"));
    if (locationInfo) {
      findAirPollutionForLocation(locationInfo.lon, locationInfo.lat);
      // Locate on map firstly
      inputRef.current.value = `${locationInfo?.name}${
        locationInfo?.state !== undefined && ", "
      }${locationInfo?.state ?? ""}`;
    }
  };

  const showStatsHandler = (e) => {
    setShowStats(e.target.checked);
  };

  return (
    <div className={styles.pageContainer}>
      <Map />
    </div>
  );
};

export default Home;
