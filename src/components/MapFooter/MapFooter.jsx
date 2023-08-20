import React, { useState } from "react";
import styles from "./MapFooter.module.scss";
import * as MapIcons from "react-icons/fc";
import * as FaIcons from "react-icons/fa";
import { BASEMAP } from "../Map/constants";
import { useScreenShot } from "../../customHookes/useScreenShot";
import Loader from "../Loader/Loader";
import { useLocation } from "react-router-dom";
import { GRAPH_AVAILABLE, PIECHART_AVAILABLE } from "./constants";
import PieChartCircle from "../PieChart/PieChart";
import Graph from "../Graph/Graph";

const MapFooter = ({ setMapStyle, mapContainerRef }) => {
  const [basemap, setBaseMap] = useState(false);
  const { loading, takeScreenShot } = useScreenShot();
  const [isVisual, setIsVisual] = useState({ pieChart: false, graph: false });
  const { pathname } = useLocation();

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#skyblue",
    "red",
    "pink",
    "grey",
  ];

  return (
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
        {PIECHART_AVAILABLE.includes(pathname) && (
          <div
            className={`${styles.visulaizeWrapper} ${styles.pieChartWrapper}`}
            onClick={() => {
              setIsVisual((prev) => ({
                ...prev,
                pieChart: true,
                graph: false,
              }));
            }}
          >
            <MapIcons.FcPieChart className={styles.mapIcon} />

            {isVisual.pieChart && (
              <div className={styles.pieChartCircleWrapper}>
                <PieChartCircle colors={COLORS} />
              </div>
            )}
          </div>
        )}

        {GRAPH_AVAILABLE.includes(pathname) && (
          <div
            className={`${styles.visulaizeWrapper} ${styles.graph}`}
            onClick={() => {
              setIsVisual((prev) => ({
                ...prev,
                pieChart: false,
                graph: true,
              }));
            }}
          >
            <MapIcons.FcLineChart className={styles.mapIcon} />

            {isVisual.graph && (
              <div
                className={`${styles.pieChartCircleWrapper} ${styles.graphWrapper}`}
              >
                <Graph />
              </div>
            )}
          </div>
        )}

        <div
          className={styles.visulaizeWrapper}
          onClick={() => takeScreenShot(mapContainerRef.current)}
        >
          {loading ? (
            <Loader
              width={20}
              height={20}
              src={
                "https://res.cloudinary.com/dhqxln7zi/image/upload/v1679836774/FormalBewitchedIsabellinewheatear-max-1mb.gif"
              }
            />
          ) : (
            <FaIcons.FaCamera
              className={`${styles.mapIcon} ${styles.downloadIcon}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MapFooter;
