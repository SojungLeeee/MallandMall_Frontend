"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // 파라미터 받기
import { fetchPriceHistory } from "../../api/httpChartService"; // 가격 이력 데이터 가져오기
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

// Chart.js 등록
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const PriceHistoryChart = () => {
  const { productCode } = useParams();
  const [priceHistory, setPriceHistory] = useState([]);
  const [averagePrice, setAveragePrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPriceHistory(productCode);
        setPriceHistory(data);
        const totalPrice = data.reduce((acc, curr) => acc + curr.price, 0);
        setAveragePrice(totalPrice / data.length);
        setCurrentPrice(data[data.length - 1].price);
      } catch (error) {
        console.error("가격 데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productCode]);

  const chartData = {
    labels: priceHistory.map((item) => item.priceDate),
    datasets: [
      {
        label: "가격 변동",
        data: priceHistory.map((item) => item.price),
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderColor: "rgba(255, 99, 132, 0.8)",
        tension: 0.3,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12, family: "'Noto Sans KR', sans-serif" },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 10,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) => `가격: ${context.parsed.y.toLocaleString()}원`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "날짜", font: { size: 12, weight: "bold" } },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: "가격 (원)", font: { size: 12, weight: "bold" } },
        beginAtZero: false,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
    },
  };

  const discountRate = averagePrice > 0 ? Math.round(((averagePrice - currentPrice) / averagePrice) * 100) : 0;

  return (
    <div className="max-w-[390px] mx-auto p-4">
      <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-white">
          <h2 className="text-xl font-bold text-center">해당 상품 가격 변동 차트</h2>
        </div>

        <div className="p-4 bg-white">
          {loading ? (
            <div className="flex justify-center items-center h-[300px]">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="h-[300px] relative">
              <Line data={chartData} options={options} />
            </div>
          )}
        </div>

        <div className="px-4 py-5 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 mb-1">제품 평균가</p>
              <p className="text-lg font-bold text-gray-800">{averagePrice.toLocaleString()}원</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 mb-1">현재 초특가</p>
              <p className="text-lg font-bold text-red-600">{currentPrice.toLocaleString()}원</p>
            </div>
          </div>

          {discountRate > 0 && (
            <div className="mt-4 bg-red-100 rounded-lg p-3 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-red-800 font-medium">평균 대비 할인율</p>
                <p className="text-2xl font-bold text-red-600">{discountRate}% 할인</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            내 근처 매장 찾기
          </button>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        <p>* 가격은 매장별로 상이할 수 있습니다.</p>
        <p>* 할인 기간은 재고 소진 시 조기 종료될 수 있습니다.</p>
      </div>
    </div>
  );
};

export default PriceHistoryChart;
