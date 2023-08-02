import React from "react";
import styles from "./MapStats.module.scss";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Label,
  Tooltip,
  // Graph
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useSelector } from "react-redux";

const MapStats = ({ pieChart: pieChartProp, chart }) => {
  const { airPollutionInfo } = useSelector((state) => state.mapReducer);

  const data = airPollutionInfo?.list
    ?.map((item) =>
      Object.keys(item.components)?.map((item2) => ({
        name: item2,
        value: item.components[item2],
      }))
    )
    .flat();

  let data2 = airPollutionInfo?.list
    ?.map((item) =>
      Object.keys(item.components)?.map((item2) => ({
        name: item2,
        value: item.components[item2],
      }))
    )
    .flat();

  const dataGraph = data2?.map((item) => ({
    name: item.name,
    amt: item.value,
  }));

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
    <div className={styles.graphContainer}>
      
       
        {pieChartProp && (
          <ResponsiveContainer
            width={"100%"}
            height={"100%"}
            className={styles.pieChartContainer}
          >
            <PieChart width={600} height={600}>
              <Pie
                data={data ?? []}
                cx="50%"
                cy="50%"
                labelLine={false}
                isAnimationActive={true}
                // label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
        )}
      

      {chart && (
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
              top: 10,
              right: 30,
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
              stroke="#8884d8"
              fill="#0e72c9"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MapStats;
