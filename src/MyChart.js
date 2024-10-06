// LineChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

function getPlotData(stars) {
  const planets = [];
  for (let [starName, star] of Object.entries(stars)) {
    for (let [planetName, planet] of Object.entries(star["Planets"])) {
      let di = 5 / (planet["SNR"] + 1e-5);
      planets.push([planetName, di]);
    }
  }
  planets.sort(([_p1, d1], [_p2, d2]) => d1 - d2);
  //console.log(planets);
  let x = planets.map((p) => p[1]);
  let y = [];
  for (let i = 1; i <= x.length; i++) {
    y.push(i);
  }
  return [
    {
      labels: x,
      datasets: [
        {
          label: "Planets",
          data: y,
          fill: false,
          borderColor: "rgba(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
  ];
}

const MyChart = ({ data }) => {
  // Sample data and configuration for the chart
  const processed = getPlotData(data);
  console.log(processed);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={processed} options={options} />;
};

export default MyChart;
