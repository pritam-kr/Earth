import React, { useState } from "react";
import styles from "./Home.module.scss";
import { Title } from "../../widgets";
import * as BiIcons from "react-icons/bi";
import { Map } from "../../components";
import { useDispatch } from "react-redux";
import { MAP_ACTIONS } from "../../redux/reducer/mapReducer";
 


const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch()

const searchHandler = () => {
  dispatch({type: MAP_ACTIONS.GET_CURRENT_COORDINATE, payload: "mmmm"})
}
  
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
              onChange={(e) => setSearchValue(e.target.value)}
            />{" "}
            <button className={styles.btnSearch} onClick={searchHandler}>
              <BiIcons.BiSearch />
            </button>
          </div>
        </div>
      </div>
      <Map searchValue={searchValue} />
    </div>
  );
};

export default Home;
