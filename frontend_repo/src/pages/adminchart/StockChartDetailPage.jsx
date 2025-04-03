"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAverageStockHistoryByProduct, fetchStockHistoryByProductAndBranch } from "../../api/httpAdminStock";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

export default function StockChartDetailPage() {
  const { productCode } = useParams();
  const [nationalData, setNationalData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState(["이마트 해운대점", "이마트 서면점", "이마트 동래점"]); // 필요 시 API 연동 가능
  const [loading, setLoading] = useState(true);
  const [currentStock, setCurrentStock] = useState(0);
  const [averageStock, setAverageStock] = useState(0);

  // 전국 재고량 데이터 fetch
  useEffect(() => {
    async function loadNationalStock() {
      setLoading(true);
      try {
        const data = await fetchAverageStockHistoryByProduct(productCode);
        setNationalData(data);

        // 평균 재고량 계산
        if (data.length > 0) {
          const totalStock = data.reduce((acc, curr) => acc + curr.remainingStock, 0);
          setAverageStock(Math.round(totalStock / data.length));

          // 현재 재고량 (마지막 데이터)
          setCurrentStock(data[data.length - 1].remainingStock);
        }

        setLoading(false);
      } catch (err) {
        console.error("전국 재고량 조회 실패:", err);
        setLoading(false);
      }
    }
    loadNationalStock();
  }, [productCode]);

  // 선택된 지점의 재고량 데이터 fetch
  useEffect(() => {
    if (!selectedBranch) return;

    async function loadBranchStock() {
      try {
        const data = await fetchStockHistoryByProductAndBranch(productCode, selectedBranch);
        setBranchData(data);
      } catch (err) {
        console.error("지점 재고량 조회 실패:", err);
      }
    }
    loadBranchStock();
  }, [productCode, selectedBranch]);

  const convertToChartData = (data, label) => ({
    labels: data.map((item) => item.changeDate.slice(0, 10)),
    datasets: [
      {
        label,
        data: data.map((item) => item.remainingStock),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#ffffff",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
      },
    ],
  });

  const convertToBranchChartData = (data, label) => ({
    labels: data.map((item) => item.changeDate.slice(0, 10)),
    datasets: [
      {
        label,
        data: data.map((item) => item.remainingStock),
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderColor: "rgba(255, 99, 132, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#ffffff",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
          font: {
            family: "'Noto Sans KR', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 10,
        titleFont: {
          size: 14,
          family: "'Noto Sans KR', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Noto Sans KR', sans-serif",
        },
        callbacks: {
          label: (context) => `재고량: ${context.parsed.y}개`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "재고량 (개)",
          font: { size: 12, weight: "bold" },
        },
        beginAtZero: false,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: {
          font: {
            family: "'Noto Sans KR', sans-serif",
            size: 12,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "날짜",
          font: { size: 12, weight: "bold" },
        },
        grid: { display: false },
        ticks: {
          font: {
            family: "'Noto Sans KR', sans-serif",
            size: 12,
          },
        },
      },
    },
  };

  // 재고 상태 계산 (충분/부족/위험)
  const getStockStatus = () => {
    if (currentStock >= averageStock * 1.2) return { text: "충분", color: "text-green-600", bg: "bg-green-100" };
    if (currentStock >= averageStock * 0.7) return { text: "적정", color: "text-blue-600", bg: "bg-blue-100" };
    return { text: "부족", color: "text-red-600", bg: "bg-red-100" };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="w-full mx-auto p-4">
      <div className="rounded-sm shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 px-4 py-3 text-white">
          <h2 className="text-xl font-bold text-center">해당 상품 재고 추이 차트</h2>
        </div>

        <div className="p-4 bg-white">
          {loading ? (
            <div className="flex justify-center items-center h-[300px]">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="h-[300px] relative">
              <Line data={convertToChartData(nationalData, "전국 총 재고량")} options={chartOptions} />
            </div>
          )}
        </div>

        <div className="px-4 py-5 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 mb-1">평균 재고량</p>
              <p className="text-lg font-bold text-gray-800">{averageStock.toLocaleString()}개</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 mb-1">현재 재고량</p>
              <p className="text-lg font-bold text-blue-600">{currentStock.toLocaleString()}개</p>
            </div>
          </div>

          <div className={`mt-4 ${stockStatus.bg} rounded-lg p-3 flex items-center justify-center`}>
            <div className="text-center">
              <p className="text-sm text-gray-800 font-medium">현재 재고 상태</p>
              <p className={`text-2xl font-bold ${stockStatus.color}`}>{stockStatus.text}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <h2 className="text-lg font-semibold mb-3">지점별 재고량 추이</h2>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">지점 선택</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          {selectedBranch && branchData.length > 0 ? (
            <div className="h-[250px] mb-4">
              <Line data={convertToBranchChartData(branchData, `${selectedBranch} 재고량`)} options={chartOptions} />
            </div>
          ) : selectedBranch ? (
            <div className="flex justify-center items-center h-[250px] mb-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[250px] mb-4 bg-gray-50 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-500">지점을 선택하면 재고 추이 차트가 표시됩니다.</p>
            </div>
          )}

          <button className="rounded-sm w-full py-3 bg-black hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            재고 관리 페이지로 이동
          </button>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        <p>* 재고 데이터는 실시간으로 업데이트되지 않을 수 있습니다.</p>
        <p>* 정확한 재고 확인은 매장에 문의하시기 바랍니다.</p>
      </div>
    </div>
  );
}
