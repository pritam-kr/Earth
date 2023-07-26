import React, { useState } from "react";
import styles from "./SettingModal.module.scss";
import Toggle from "react-toggle";

const SettingModal = ({ setModal }) => {
  const [toggleData, setToggleData] = useState(
    !JSON.parse(localStorage.getItem("features"))
      ? {
          air_pollution: true,
          map_with_stats: false,
          co2_emission: false,
          water_pollution: false,
          heat_wave: false,
        }
      : JSON.parse(localStorage.getItem("features"))
  );

  const showStatsHandler = (name, e) => {
    setToggleData((prev) => ({ ...prev, [name]: e.target.checked }));
  };

  const localStorageHandler = () => {
    setModal(false);
    localStorage.setItem("features", JSON.stringify(toggleData));
  };

  const FEATURES_LIST = [
    { id: 1, label: "Air pollution", name: "air_pollution" },
    { id: 2, label: "Map with statistics", name: "map_with_stats" },
    { id: 3, label: "Co2 Emission", name: "co2_emission" },
    { id: 4, label: "Water pollution", name: "water_pollution" },
    { id: 5, label: "Heat wave", name: "heat_wave" },
  ];

  const DEFAULT_FEATURES = [
    "air_pollution",
    "co2_emission",
    "water_pollution",
    "heat_wave",
  ];

  return (
    <div className={styles.settingModalWrapper}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h3>Settings</h3>
          </div>
          <div className={styles.close} onClick={() => localStorageHandler()}>
            <h3>X</h3>
          </div>
        </div>
        <div className={styles.subContents}>
          <p>
            To optimize performance and minimize unnecessary API calls, This
            feature will allow users to selectively access and utilize specific
            functionalities, listed below.
          </p>
          {/* <p>
            Basically, users will have the option to choose which features they
            want to interact with, enabling them to focus only on the
            functionalities they need, such as viewing particular content or
            performing specific actions.
          </p> */}
        </div>

        <div className={styles.featuresWrapper}>
          {FEATURES_LIST.map((item) => {
            return (
              <div className={styles.feature} key={item?.id}>
                <p className={styles.featureTitle}>{item?.label}</p>
                <div className={styles.toggleWrapper}>
                  <Toggle
                    disabled={DEFAULT_FEATURES.includes(item?.name)}
                    defaultChecked={item?.name && toggleData[item?.name]}
                    icons={false}
                    onChange={(e) => showStatsHandler(item?.name, e)}
                    className={"statsToggle"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
