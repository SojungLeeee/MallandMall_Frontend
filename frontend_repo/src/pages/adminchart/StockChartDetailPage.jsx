"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAverageStockHistoryByProduct, fetchStockHistoryByProductAndBranch } from "../../api/httpAdminStock";
import { fetchNationalInventoryAiAnalysis, fetchBranchInventoryAiAnalysis } from "../../api/aiInventoryService";
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
  const [branches, setBranches] = useState(["이마트 해운대점", "이마트 서면점", "이마트 동래점"]);
  const [loading, setLoading] = useState(true);
  const [currentStock, setCurrentStock] = useState(0);
  const [averageStock, setAverageStock] = useState(0);
  const [nationalAiResult, setNationalAiResult] = useState(null);
  const [branchAiResult, setBranchAiResult] = useState(null);

  // 전국 재고량 데이터 fetch
  useEffect(() => {
    async function loadNationalStock() {
      setLoading(true);
      try {
        const data = await fetchAverageStockHistoryByProduct(productCode);
        setNationalData(data);

        if (data.length > 0) {
          const totalStock = data.reduce((acc, curr) => acc + curr.remainingStock, 0);
          setAverageStock(Math.round(totalStock / data.length));
          setCurrentStock(data[data.length - 1].remainingStock);
        }

        const ai = await fetchNationalInventoryAiAnalysis(productCode);
        setNationalAiResult(ai);
      } catch (err) {
        console.error("전국 재고량 또는 AI 분석 실패:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNationalStock();
  }, [productCode]);

  // 선택된 지점의 재고량 데이터 + AI 분석 fetch
  useEffect(() => {
    if (!selectedBranch) return;

    async function loadBranchStock() {
      try {
        const data = await fetchStockHistoryByProductAndBranch(productCode, selectedBranch);
        setBranchData(data);

        const ai = await fetchBranchInventoryAiAnalysis(productCode, selectedBranch);
        setBranchAiResult(ai);
      } catch (err) {
        console.error("지점 재고량 또는 AI 분석 실패:", err);
      }
    }
    loadBranchStock();
  }, [productCode, selectedBranch]);

  const convertToChartData = (data, label, color) => ({
    labels: data.map((item) => item.changeDate.slice(0, 10)),
    datasets: [
      {
        label,
        data: data.map((item) => item.remainingStock),
        fill: true,
        backgroundColor: `${color}1A`,
        borderColor: color,
        borderWidth: 2,
        pointBackgroundColor: color,
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
        titleFont: { size: 14, family: "'Noto Sans KR', sans-serif" },
        bodyFont: { size: 13, family: "'Noto Sans KR', sans-serif" },
        callbacks: {
          label: (context) => `재고량: ${context.parsed.y}개`,
        },
      },
    },
    scales: {
      y: {
        title: { display: true, text: "재고량 (개)", font: { size: 12, weight: "bold" } },
        beginAtZero: false,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: {
          font: { family: "'Noto Sans KR', sans-serif", size: 12 },
        },
      },
      x: {
        title: { display: true, text: "날짜", font: { size: 12, weight: "bold" } },
        grid: { display: false },
        ticks: {
          font: { family: "'Noto Sans KR', sans-serif", size: 12 },
        },
      },
    },
  };

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
              <Line
                data={convertToChartData(nationalData, "전국 총 재고량", "rgba(59,130,246)")}
                options={chartOptions}
              />
            </div>
          )}
        </div>

        {nationalAiResult?.aiAnalysis && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-500 text-white p-1 rounded-md">
                <span className="text-xs font-bold">AI</span>
              </div>
              <h3 className="text-sm font-bold text-blue-800">전국 재고 분석 결과</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-blue-500">📈</div>
                  <p className="text-xs font-semibold text-gray-600">재고 트렌드</p>
                </div>
                <p className="text-sm pl-6">{nationalAiResult.aiAnalysis.trendSummary ?? "정보 없음"}</p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-amber-500">⚠️</div>
                  <p className="text-xs font-semibold text-gray-600">이상 탐지</p>
                </div>
                <p
                  className={`text-sm pl-6 font-medium ${
                    nationalAiResult.aiAnalysis.anomaly ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {nationalAiResult.aiAnalysis.anomaly ? "이상 있음" : "정상"}
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-green-500">💎</div>
                  <p className="text-xs font-semibold text-gray-600">추천 사항</p>
                </div>
                <p className="text-sm pl-6">{nationalAiResult.aiAnalysis.recommendation ?? "추천 없음"}</p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-red-500">🔥</div>
                  <p className="text-xs font-semibold text-gray-600">위험도 점수</p>
                </div>
                <div className="pl-6">
                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        nationalAiResult.aiAnalysis.riskScore > 70
                          ? "bg-red-500"
                          : nationalAiResult.aiAnalysis.riskScore > 40
                          ? "bg-amber-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${nationalAiResult.aiAnalysis.riskScore}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
                      {nationalAiResult.aiAnalysis.riskScore ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
              <Line
                data={convertToChartData(branchData, `${selectedBranch} 재고량`, "rgba(255,99,132)")}
                options={chartOptions}
              />
            </div>
          ) : selectedBranch ? (
            <div className="flex justify-center items-center h-[250px] mb-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[250px] mb-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">지점을 선택하면 재고 추이 차트가 표시됩니다.</p>
            </div>
          )}

          {branchAiResult?.aiAnalysis && (
            <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-lg px-5 py-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-pink-500 text-white p-1 rounded-md">
                  <span className="text-xs font-bold">AI</span>
                </div>
                <h3 className="text-sm font-bold text-pink-800">{selectedBranch} 재고 분석 결과</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-pink-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-blue-500">📈</div>
                    <p className="text-xs font-semibold text-gray-600">재고 트렌드</p>
                  </div>
                  <p className="text-sm pl-6">{branchAiResult.aiAnalysis.trendSummary ?? "정보 없음"}</p>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm border border-pink-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-amber-500">⚠️</div>
                    <p className="text-xs font-semibold text-gray-600">이상 탐지</p>
                  </div>
                  <p
                    className={`text-sm pl-6 font-medium ${
                      branchAiResult.aiAnalysis.anomaly ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {branchAiResult.aiAnalysis.anomaly ? "이상 있음" : "정상"}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm border border-pink-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-green-500">💎</div>
                    <p className="text-xs font-semibold text-gray-600">추천 사항</p>
                  </div>
                  <p className="text-sm pl-6">{branchAiResult.aiAnalysis.recommendation ?? "추천 없음"}</p>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm border border-pink-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-red-500">🔥</div>
                    <p className="text-xs font-semibold text-gray-600">위험도 점수</p>
                  </div>
                  <div className="pl-6">
                    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full ${
                          branchAiResult.aiAnalysis.riskScore > 70
                            ? "bg-red-500"
                            : branchAiResult.aiAnalysis.riskScore > 40
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${branchAiResult.aiAnalysis.riskScore}%` }}
                      ></div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
                        {branchAiResult.aiAnalysis.riskScore ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        <p>* 재고 데이터는 실시간으로 업데이트되지 않을 수 있습니다.</p>
        <p>* 정확한 재고 확인은 매장에 문의하시기 바랍니다.</p>
      </div>
    </div>
  );
}
