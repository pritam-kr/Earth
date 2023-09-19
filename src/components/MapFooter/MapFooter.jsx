import React, { useState } from "react";
import styles from "./MapFooter.module.scss";
import * as MapIcons from "react-icons/fc";
import * as FaIcons from "react-icons/fa";
import { BASEMAP } from "../Map/constants";
import { useScreenShot } from "../../customHookes/useScreenShot";
import Loader from "../Loader/Loader";
import { useLocation } from "react-router-dom";
import { COLORS, GRAPH_AVAILABLE, PIECHART_AVAILABLE } from "./constants";
import PieChartCircle from "../PieChart/PieChart";
import Graph from "../Graph/Graph";
import { useMapContext } from "../../context/mapContext";

const MapFooter = ({ setMapStyle, mapContainerRef, loadingProp = false }) => {
  // Hooks
  const { loading, takeScreenShot } = useScreenShot();
  const { pathname } = useLocation();

  const {
    state: { airPollutionInfo },
  } = useMapContext();

  // States
  const [basemap, setBaseMap] = useState(false);
  const [isVisual, setIsVisual] = useState({ pieChart: false, graph: false });

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
        {(isVisual.pieChart || isVisual.graph) && (
          <div className={styles.pieChartGraphWrapper}>
            {loadingProp ? (
              <div className={styles.loaderWrapper}>
                <Loader width={40} height={40} />
              </div>
            ) : (
              <>
                {" "}
                {isVisual.pieChart && (
                  <div className={styles.pieChartCircleWrapper}>
                    <PieChartCircle colors={COLORS} />
                  </div>
                )}
                {isVisual.graph && (
                  <div
                    className={`${styles.pieChartCircleWrapper}  ${styles.graphWrapper}`}
                  >
                    <Graph />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {PIECHART_AVAILABLE.includes(pathname) && (
          <button
            disabled={!airPollutionInfo?.list?.length}
            className={`${styles.visulaizeWrapper} ${
              isVisual.pieChart ? styles.active : ""
            }`}
            onClick={() => {
              !loadingProp &&
                setIsVisual((prev) => ({
                  ...prev,
                  pieChart: !prev.pieChart,
                  graph: false,
                }));
            }}
          >
            {loadingProp ? (
              <Loader width={20} height={20} />
            ) : (
              <MapIcons.FcPieChart className={styles.mapIcon} />
            )}
          </button>
        )}

        {GRAPH_AVAILABLE.includes(pathname) && (
          <button
            disabled={!airPollutionInfo?.list?.length}
            className={`${styles.visulaizeWrapper}  ${
              isVisual.graph ? styles.active : ""
            }`}
            onClick={() => {
              !loadingProp &&
                setIsVisual((prev) => ({
                  ...prev,
                  pieChart: false,
                  graph: !prev.graph,
                }));
            }}
          >
            {loadingProp ? (
              <Loader width={20} height={20} />
            ) : (
              <MapIcons.FcLineChart className={styles.mapIcon} />
            )}
          </button>
        )}

        <div
          className={styles.visulaizeWrapper}
          onClick={() => takeScreenShot(mapContainerRef.current)}
        >
          {loading ? (
            <Loader width={20} height={20} />
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
