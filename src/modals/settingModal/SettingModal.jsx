import React, { useState } from "react";
import styles from "./SettingModal.module.scss";
import { useApiKey } from "../../customHookes/useApiKey";
import { useErrorContext } from "../../context/errorContext";

const SettingModal = () => {
  
  // Custom hooks
  const { setOpenWeatherApiKey, setStateCityApikey } = useApiKey();
  const { isError, setIsError } = useErrorContext();
  const [apiKey, setApiKey] = useState(
    isError?.openWeatherApi
      ? process.env.REACT_APP_OPENWEATHERKEY
      : process.env.REACT_APP_STATE_CITY_KEY
  );

  const onClose = () => {
    setIsError((prev) => ({
      ...prev,
      openWeatherApi: false,
      stateCityApi: false,
    }));
  };

  const onSave = () => {
    if (isError?.openWeatherApi) {
      setOpenWeatherApiKey(apiKey.trim());
      localStorage.setItem("openWeatherAPIkey", apiKey.trim());
    } else {
      setStateCityApikey(apiKey.trim());
      localStorage.setItem("stateCityAPIKey", apiKey.trim());
    }
    onClose();
    window.location.reload();
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
            {isError?.openWeatherApi
              ? "Open Weather"
              : "Country State City API"}{" "}
            website at{" "}
            {isError?.openWeatherApi ? (
              <a
                href="https://openweathermap.org/"
                target="_blank"
                rel="noreferrer"
              >
                www.openweathermap.org
              </a>
            ) : (
              <a
                href="https://countrystatecity.in/"
                target="_blank"
                rel="noreferrer"
              >
                www.countrystatecity.in
              </a>
            )}
            .
          </li>
          {isError?.openWeatherApi ? (
            <>
              {" "}
              <li>Log In to Your Account</li>
              <li>Navigate to API Key Settings</li>
              <li> Manage Your API Keys</li>
              <li>Generate a New API Key, and Copy Your New API Key</li>
              <li>Paste the New API Key, below in input field</li>
              <li>Verify and Save</li>
            </>
          ) : (
            <>
              {" "}
              <li>And, Request for an api key</li>
            </>
          )}
        </div>

        <div className={styles.footer}>
          <input
            placeholder="API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className={styles.input}
          />{" "}
          <button onClick={onSave} disabled={!apiKey.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
