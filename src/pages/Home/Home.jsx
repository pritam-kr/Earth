import React, { useState } from "react";
import styles from "./Home.module.scss";
import { Title } from "../../widgets";
import * as BiIcons from "react-icons/bi";
import { Map } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MAP_ACTIONS } from "../../redux/actions/actions";
const apiKey = "ad09d41295facd76d3932305350f3282";

const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestionBox, setSuggestionBox] = useState(true);
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  console.log(selector);

  const getLocations = async (searchValue) => {
    try {
      const { data, status } = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=${apiKey}`
      );

      if (status === 200) {
        dispatch({ type: MAP_ACTIONS.GET_LOCATION_LIST, payload: data });
      }
    } catch (error) {
      console.log(`Something error occured ${error.message}`);
    }
  };

  const searchHandler = (searchValue) => {
    getLocations(searchValue);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title text={"Air pollution"} />
        </div>
        <div className={styles.right}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search"
              className={styles.input}
              onChange={(e) => searchHandler(e.target.value)}
            />{" "}
            {/* <button className={styles.btnSearch} onClick={searchHandler}>
              <BiIcons.BiSearch />
            </button> */}
            {suggestionBox && (
              <div className={styles.searchSuggestion}>
                <li>lllldck ii ihie </li>
                <li>lllldck ii ihie </li>
                <li>lllldck ii ihie </li>
                <li>lllldck ii ihie </li>
                <li>lllldck ii ihie </li>
                <li>lllldck ii ihie </li>

                <li>lllldck ii ihie </li>
                <li>lllldck ii ihie </li>
                <li>lllldck ii ihie </li>
                <li>lllldck ii ihie </li>
                <li>lllldck ii ihie </li>
                <li>lllldck ii ihie </li>
              </div>
            )}
          </div>
        </div>
      </div>
      <Map searchValue={searchValue} />
    </div>
  );
};

export default Home;
