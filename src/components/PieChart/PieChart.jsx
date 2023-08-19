import React from "react";
import styles from "./PieChart.module.scss";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";

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
        {data?.map((item, index) => (
          <p className={styles.color}>
            <span
              style={{ backgroundColor: colors[index % colors.length] }}
            ></span>
            {item.name}
          </p>
        ))}
      </div>
    </>
  );
};

export default PieChartCircle;
