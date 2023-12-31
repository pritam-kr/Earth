import React, { useEffect, useState, useRef } from "react";
import styles from "./Home.module.scss";
import { Loader, Map } from "../../components";
 

const Home = ({mapLoading, setMapLoading}) => {
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);
 
  const [suggestionBox, setSuggestionBox] = useState(false);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target !== suggestionRef.current && e.target !== inputRef.current) {
        setSuggestionBox(false);
      }
    });

    return () => {
      window.removeEventListener("click", () => {});
    };
  });

  return (
    <div className={styles.pageContainer}>
      <Map setMapLoading={setMapLoading} />

      {mapLoading && (
        <div className={styles.mapLoader}>
          <Loader
            width={50}
            height={50}
            src={
              "https://res.cloudinary.com/dhqxln7zi/image/upload/v1679836774/FormalBewitchedIsabellinewheatear-max-1mb.gif"
            }
          />
        </div>
      )}
    </div>
  );
};

export default Home;
