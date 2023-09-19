import React from "react";
import styles from "./Graph.module.scss";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useMapContext } from "../../context/mapContext";

const Graph = () => {
  const {
    state: { airPollutionInfo },
  } = useMapContext();

  const data2 = airPollutionInfo?.list
    ?.map((item) =>
      Object.keys(item.components)?.map((item2) => ({
        name: item2,
        value: item.components[item2],
      }))
    )
    .flat();

  const dataGraph = data2
    ?.map((item) => ({
      name: item.name,
      amt: item.value,
    }))
    ?.sort((a, b) => b.amt - a.amt);

  return (
    <>
      <ResponsiveContainer
        width="100%"
        height="100%"
        className={styles.lineContainer}
      >
        <AreaChart
          width={400}
          height={400}
          data={dataGraph}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            // type="monotone"
            dataKey="amt"
            stroke="#0e72c9"
            fill="#0e72c9"
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default Graph;
