import React from "react";
import styles from "./Home.module.scss";
import { Title } from "../../widgets";
import * as BiIcons from "react-icons/bi";
import { Map } from "../../components";
import { useFetchApi } from "../../customHookes";
 

const Home = () => {

  const data = useFetchApi()
  console.log(data)

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title text={"Air pollution"} />
        </div>
        <div className={styles.right}>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search" className={styles.input} />{" "}
            <button className={styles.btnSearch}>
              <BiIcons.BiSearch />
            </button>
          </div>
        </div>
      </div>
      <Map />
    </div>
  );
};

export default Home;
