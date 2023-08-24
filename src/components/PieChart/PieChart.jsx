import React, { useState } from "react";
import styles from "./PieChart.module.scss";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { AIR_COMPONENTS } from "./constants";

const PieChartCircle = ({ isPieChart, colors }) => {
  const { airPollutionInfo } = useSelector((state) => state.mapReducer);

  const data = airPollutionInfo?.list
    ?.map((item) =>
      Object.keys(item.components)?.map((item2) => ({
        name: item2,
        value: item.components[item2],
      }))
    )
    .flat();

  const RADIAN = Math.PI / 180;

  console.log(data, colors);

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
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className={styles.colorWrapper}>
        {data?.length > 0 &&
          [...data]
            .sort((a, b) => b.value - a.value)
            ?.map((item, index) => (
              <Colors
                item={item}
                index={index}
                colors={colors}
                styles={styles}
              />
            ))}
      </div>
    </>
  );
};

export default PieChartCircle;

const Colors = ({ item, index, colors, styles }) => {
  const [amt, setAmt] = useState(false);

  console.log(amt, "amt");
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

      {amt && <p className={styles.info}>{AIR_COMPONENTS[item.name]}</p>}
    </div>
  );
};
