import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OfflinePriceChart = ({ productPriceHistory }) => {
  const chartData = {
    labels: productPriceHistory.map((item) => item.priceDate),
    datasets: [
      {
        label: "상품 가격 변동",
        data: productPriceHistory.map((item) => item.price),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h3>가격 변동 차트</h3>
      <Line data={chartData} />
    </div>
  );
};

export default OfflinePriceChart;
