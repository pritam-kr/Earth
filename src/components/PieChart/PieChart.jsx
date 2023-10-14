import React, { useState } from "react";
import styles from "./PieChart.module.scss";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { AIR_COMPONENTS } from "./constants";
import { useMapContext } from "../../context/mapContext";
import * as BiIcons from "react-icons/bi";

const PieChartCircle = ({ isPieChart, colors }) => {
  const {
    state: { airPollutionInfo },
  } = useMapContext();

  const data = airPollutionInfo?.list
    ?.map((item) =>
      Object.keys(item.components)?.map((item2) => ({
        name: item2,
        value: item.components[item2],
      }))
    )
    .flat()
    ?.sort((a, b) => b.value - a.value);

  const { aqi } = airPollutionInfo?.list[0].main || {};
  const [info, setInfo] = useState(false);

  const getAirInfo = (aqi) => {
    if (!aqi) return "";

    switch (aqi) {
      case 5:
        return "Very Poor";
      case 4:
        return "Poor";
      case 3:
        return "Moderate";
      case 2:
        return "Fair";
      case 1:
        return "Good";
      default:
        return "";
    }
  };

  return (
    <>
      <ResponsiveContainer
        width={"100%"}
        height={"100%"}
        className={styles.pieChart}
      >
        <PieChart width={400} height={400}>
          <Pie
            data={data ?? []}
            cx="50%"
            cy="50%"
            labelLine={false}
            isAnimationActive={true}
            //label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className={styles.colorWrapper}>
        {info && <p className={styles.airType}>{getAirInfo(aqi) + " air"}</p>}
        {aqi && (
          <p className={styles.aqi}>
            AQI: {aqi}{" "}
            <BiIcons.BiInfoCircle
              style={{ color: "red" }}
              className={styles.aqiInfo}
              onMouseLeave={() => setInfo(false)}
              onMouseEnter={() => setInfo(true)}
            />{" "}
          </p>
        )}
        {data?.length > 0 &&
          data?.map((item, index) => (
            <Colors item={item} index={index} colors={colors} styles={styles} />
          ))}
      </div>
    </>
  );
};

export default PieChartCircle;

const Colors = ({ item, index, colors, styles }) => {
  const [amt, setAmt] = useState(false);

  return (
    <div>
      <p
        className={styles.color}
        onMouseEnter={() => setAmt(true)}
        onMouseLeave={() => setAmt(false)}
      >
        <span style={{ backgroundColor: colors[index] }}></span>
        {item.name.toUpperCase()} - {`${item.value} μg/m3`}
      </p>

      {amt && (
        <p
          className={styles.info}
          style={{
            backgroundColor: colors[index],
            opacity: 0.95,
            color: "#fff",
          }}
        >
          {AIR_COMPONENTS[item.name]}
        </p>
      )}
    </div>
  );
};
