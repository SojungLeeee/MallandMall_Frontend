import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaThumbsUp,
  FaThumbsDown,
  FaFilter,
  FaChartLine,
  FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TrendingDashboard = () => {
  const [trendingData, setTrendingData] = useState({
    positive: [],
    negative: [],
  });
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("day");
  const [activeTab, setActiveTab] = useState("positive");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState("품질");
  const navigate = useNavigate();

  // 사용할 특성 목록
  const availableFeatures = [
    "품질",
    "가격",
    "디자인",
    "사용감",
    "내구성",
    "편의성",
    "배송",
    "서비스",
    "성능",
    "가성비",
    "색상",
    "사이즈",
    "무게",
    "소재",
    "기능성",
  ];

  // 모의 트렌드 차트 데이터 생성
  const generateMockTrendData = (timeFrame) => {
    let points = [];
    let numPoints;

    switch (timeFrame) {
      case "day":
        numPoints = 24;
        points = Array.from({ length: numPoints }, (_, i) => {
          return {
            time: `${i}:00`,
            positive: 85 + Math.random() * 15,
            negative: 15 + Math.random() * 15,
          };
        });
        break;
      case "week":
        numPoints = 7;
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        points = Array.from({ length: numPoints }, (_, i) => {
          return {
            time: days[i],
            positive: 80 + Math.random() * 20,
            negative: 10 + Math.random() * 20,
          };
        });
        break;
      case "month":
        numPoints = 30;
        points = Array.from({ length: numPoints }, (_, i) => {
          return {
            time: `${i + 1}일`,
            positive: 75 + Math.random() * 25,
            negative: 5 + Math.random() * 25,
          };
        });
        break;
      default:
        numPoints = 24;
        points = Array.from({ length: numPoints }, (_, i) => {
          return {
            time: `${i}:00`,
            positive: 85 + Math.random() * 15,
            negative: 15 + Math.random() * 15,
          };
        });
    }

    return points;
  };

  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    setIsLoading(true);

    // 모의 차트 데이터
    const chartData = generateMockTrendData(selectedTimeFrame);

    // 벡터 검색 API 호출 (병렬 요청)
    Promise.all([
      axios.get(
        `/api/vector-search/trending?feature=${encodeURIComponent(
          selectedFeature
        )}&positive=true&limit=10`
      ),
      axios.get(
        `/api/vector-search/trending?feature=${encodeURIComponent(
          selectedFeature
        )}&positive=false&limit=10`
      ),
    ])
      .then(([positiveResponse, negativeResponse]) => {
        setTrendingData({
          positive: positiveResponse.data,
          negative: negativeResponse.data,
          chartData,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("트렌딩 데이터 가져오기 오류:", error);
        setIsLoading(false);

        // 오류 시 테스트 데이터 사용
        setTrendingData({
          positive: Array.from({ length: 10 }, (_, i) => ({
            rank: i + 1,
            product_code: `PROD-${1000 + i}`,
            product_name: `상품 ${1000 + i}`,
            similarity: 0.9 - i * 0.05,
            rankChange:
              Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1),
          })),
          negative: Array.from({ length: 10 }, (_, i) => ({
            rank: i + 1,
            product_code: `PROD-${2000 + i}`,
            product_name: `상품 ${2000 + i}`,
            similarity: 0.85 - i * 0.04,
            rankChange:
              Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1),
          })),
          chartData,
        });
      });
  }, [selectedTimeFrame, selectedFeature]);

  // 랭크 변동 아이콘 렌더링 함수
  const renderRankChange = (change) => {
    if (change > 0) {
      return <FaArrowUp className="text-green-500" />;
    } else if (change < 0) {
      return <FaArrowDown className="text-red-500" />;
    } else {
      return <FaMinus className="text-gray-500" />;
    }
  };

  // 제품 선택 핸들러
  const handleProductSelect = (productCode) => {
    navigate(`/product/${productCode}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link to="/search" className="text-blue-600 hover:text-blue-800">
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaChartLine className="text-blue-600" /> 트렌딩 제품 대시보드
          </h1>
        </div>

        <div className="flex space-x-2">
          <select
            value={selectedTimeFrame}
            onChange={(e) => setSelectedTimeFrame(e.target.value)}
            className="p-2 border rounded-md bg-white"
          >
            <option value="day">일간</option>
            <option value="week">주간</option>
            <option value="month">월간</option>
          </select>
        </div>
      </div>

      {/* 특성 필터 */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-3">
          <FaFilter className="mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">특성 필터</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableFeatures.map((feature, index) => (
            <button
              key={index}
              onClick={() => setSelectedFeature(feature)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedFeature === feature
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 트렌딩 차트 */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            '{selectedFeature}' 특성 트렌딩 차트
          </h2>

          {trendingData.chartData && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendingData.chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    name="긍정적 언급"
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    name="부정적 언급"
                    stroke="#ef4444"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 트렌딩 제품 목록 */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === "positive"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("positive")}
            >
              <div className="flex items-center justify-center">
                <FaThumbsUp className="mr-2" />
                긍정적
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === "negative"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("negative")}
            >
              <div className="flex items-center justify-center">
                <FaThumbsDown className="mr-2" />
                부정적
              </div>
            </button>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-64">
              <ul className="divide-y">
                {trendingData[activeTab].map((product, index) => (
                  <li
                    key={index}
                    className="p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleProductSelect(product.product_code)}
                  >
                    <div className="flex items-center">
                      <span className="bg-gray-200 text-gray-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        {product.rank}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">
                          {product.product_name || product.product_code}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500 mr-2">
                            유사도:{" "}
                            {(parseFloat(product.similarity) * 100).toFixed(1)}%
                          </span>
                          <div className="flex items-center">
                            {renderRankChange(product.rankChange)}
                            <span className="text-xs ml-1">
                              {Math.abs(product.rankChange)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 특성 분석 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">리뷰 트렌드 분석</h2>
          <p className="text-gray-600 mb-4">
            현재 <span className="font-semibold">{selectedFeature}</span> 특성에
            대한 리뷰 트렌드 분석입니다.
          </p>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">긍정적 리뷰 비율</span>
              <span className="text-sm font-bold text-green-600">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: "78%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium">부정적 리뷰 비율</span>
              <span className="text-sm font-bold text-red-600">22%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-red-600 h-2.5 rounded-full"
                style={{ width: "22%" }}
              ></div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <h3 className="font-medium mb-2">주요 연관 특성</h3>
            <div className="flex flex-wrap gap-2">
              {["내구성", "디자인", "가성비", "성능"].map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">인사이트</h2>

          <div className="space-y-4">
            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
              <h3 className="font-medium text-green-800">긍정적 포인트</h3>
              <p className="mt-1 text-sm text-gray-600">
                "{selectedFeature}" 특성에 대해 사용자들이 가장 긍정적으로
                평가하는 제품들은 뛰어난 내구성과 디자인 요소를 결합했습니다.
              </p>
            </div>

            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <h3 className="font-medium text-red-800">부정적 포인트</h3>
              <p className="mt-1 text-sm text-gray-600">
                부정적 리뷰가 많은 제품들은 주로 가격 대비 {selectedFeature}{" "}
                수준이 기대에 미치지 못하는 경우가 많았습니다.
              </p>
            </div>

            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h3 className="font-medium text-blue-800">트렌드 변화</h3>
              <p className="mt-1 text-sm text-gray-600">
                최근{" "}
                {selectedTimeFrame === "day"
                  ? "24시간"
                  : selectedTimeFrame === "week"
                  ? "일주일"
                  : "한 달"}{" "}
                동안
                {selectedFeature} 관련 긍정적 리뷰가 5% 증가했습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingDashboard;
