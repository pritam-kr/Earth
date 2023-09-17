import React, { useState } from "react";
import styles from "./Select.module.scss";
import * as BiIcons from "react-icons/bi";
import Loader from "../Loader/Loader";

const Select = ({
  value,
  setValue,
  placeholder = "Select",
  options = [],
  ref,
  className,
  disabled = false,
  loading = false,
  loaderW = 30,
  loaderH = 30,
}) => {
  const [suggestionBos, setSuggestionBox] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const optionHandler = (e) => {
    const optionInfo = JSON.parse(e.target.getAttribute("data"));

    if (typeof optionInfo === "string") {
      setValue(optionInfo);
      setSearchValue(optionInfo);
      setSuggestionBox(false);
    } else {
      setSuggestionBox(false);
      setValue(optionInfo);
      setSearchValue(optionInfo.label);
    }
  };

  return (
    <div
      className={`${styles.selectWrapper} ${className ? className : ""}`}
      ref={ref}
    >
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className={styles.input}
        placeholder={placeholder}
        onFocusCapture={() => {
          setSuggestionBox(true);
          setSearchValue("");
        }}
        disabled={disabled}
      />

      {suggestionBos && (
        <div className={styles.suggestionBox} onClick={(e) => optionHandler(e)}>
          {options?.length && !loading ? (
            options
              ?.filter(
                (item) =>
                  item?.label &&
                  item.label.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((item) => {
                return <Options option={item} />;
              })
          ) : (
            <div className={styles.noLocation}>
              {loading ? (
                <Loader width={loaderW} height={loaderH} />
              ) : (
                <>
                  <BiIcons.BiLocationPlus className={styles.locationIcon} />
                  <h4>No location found</h4>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {loading && (
        <Loader width={20} height={20} className={styles.smallLoader} />
      )}
    </div>
  );
};

export default Select;

const Options = ({ option }) => {
  return typeof option === "string" ? (
    <p className={styles.locationOption} data={option}>
      {option?.label}
    </p>
  ) : (
    <p className={styles.locationOption} data={JSON.stringify(option)}>
      {option?.label}
    </p>
  );
};
