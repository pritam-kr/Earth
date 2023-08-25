import React, { useState } from "react";
import styles from "./SettingModal.module.scss";
import { useDispatch } from "react-redux";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import { useServices } from "../../services/useServices";

const SettingModal = () => {
  const dispatch = useDispatch();
  const [apiKey, setApiKey] = useState("f4a78f3a238bb1393d8e39a33b9a4361");
  const {setOpenWeatherApiKey} = useServices()

  const onClose = () => {
    dispatch({
      type: MAP_ACTIONS.GET_AIR_POLLUTION || MAP_ACTIONS.GET_LOCATION_LIST,
      payload: { error: false },
    });

    dispatch({
      type: MAP_ACTIONS.GET_LOCATION_LIST,
      payload: { error: false },
    });
  };

  const onSave = () => {
    onClose();
    setOpenWeatherApiKey(apiKey)
    localStorage.setItem("openWeatherAPIkey", apiKey);
  };

  return (
    <div className={styles.settingModalWrapper}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h3>Error: Expired or Invalid API Key</h3>
          </div>
          <div className={styles.close} onClick={onClose}>
            <h3>X</h3>
          </div>
        </div>
        <div className={styles.subContents}>
          <p>
            We've noticed that the API key you've been using to access our
            services has encountered an issue. This could be due to the key
            having expired or becoming invalid. Please follow the steps below to
            generate a new API key.
          </p>
        </div>

        <div className={styles.steps}>
          <li>
            To begin, open your preferred web browser and navigate to the
            OpenWeather website at{" "}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noreferrer"
            >
              www.openweathermap.org
            </a>
            .
          </li>
          <li>Log In to Your Account</li>
          <li>Navigate to API Key Settings</li>
          <li> Manage Your API Keys</li>
          <li>Generate a New API Key, and Copy Your New API Key</li>
          <li>Paste the New API Key, below in input field</li>
          <li>Verify and Save</li>
        </div>

        <div className={styles.footer}>
          <input
            placeholder="API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className={styles.input}
          />{" "}
          <button onClick={onSave} disabled={!apiKey}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
