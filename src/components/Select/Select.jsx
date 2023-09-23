import React, { useEffect, useRef, useState } from "react";
import styles from "./Select.module.scss";
import * as BiIcons from "react-icons/bi";
import Loader from "../Loader/Loader";

const Select = ({
  value,
  setValue,
  placeholder = "Select",
  options = [],
  className,
  disabled = false,
  loading = false,
  loaderW = 30,
  loaderH = 30,
}) => {
  //States
  const [suggestionBos, setSuggestionBox] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  //refs
  const inputRef = useRef(null);

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

  useEffect(() => {
    if (disabled) {
      setSearchValue("");
    }
  }, [disabled]);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target !== inputRef.current) {
        setSuggestionBox(false);
      }
    });

    return () => {
      window.removeEventListener("click", () => {});
    };
  });

  return (
    <div className={`${styles.selectWrapper} ${className ? className : ""}`}>
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
        ref={inputRef}
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

      {loading ? (
        <Loader width={20} height={20} className={styles.smallLoader} />
      ) : (
        searchValue && (
          <BiIcons.BiXCircle
            className={styles.btnClose}
            onClick={() => {
              setSuggestionBox(false);
              setSearchValue("");
            }}
          />
        )
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
