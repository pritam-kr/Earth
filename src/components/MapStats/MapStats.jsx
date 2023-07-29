import React from "react";
import styles from "./MapStats.module.scss";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Label,
  Tooltip,
} from "recharts";
import { useSelector } from "react-redux";

const MapStats = () => {
  const { airPollutionInfo } = useSelector((state) => state.mapReducer);

  const data = airPollutionInfo?.list
    ?.map((item) =>
      Object.keys(item.components)?.map((item2) => ({
        name: item2,
        value: item.components[item2] * 2,
      }))
    )
    .flat();

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#skyblue",
    "red",
    "pink",
    "grey",
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    active,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (!active) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={styles.statsContainer}>
      <div className={styles.row}>
        <div className={`${styles.statsWrapper} ${styles.pieChartWrapper}`}>
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <PieChart width={600} height={600}>
              <Pie
                data={data ?? []}
                cx="50%"
                cy="50%"
                labelLine={true}
                // isAnimationActive={false}
                // label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.statsWrapper}>1</div>
      </div>

      <div className={styles.row}>
        <div className={styles.statsWrapper}>1</div>
        <div className={styles.statsWrapper}>1</div>
      </div>
    </div>
  );
};

export default MapStats;
