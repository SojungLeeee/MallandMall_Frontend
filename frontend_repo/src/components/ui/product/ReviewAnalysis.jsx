import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { fetchReviewAnalysis } from "../../../api/httpMemberService";

// Chart.js 등록
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
);

const ReviewAnalysis = () => {
  const { productCode } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        // API 호출 - 실제 API 함수로 대체해야 합니다
        const data = await fetchReviewAnalysis(productCode);
        setAnalysis(data);
        setError(null);
      } catch (err) {
        setError("리뷰 분석을 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [productCode]);

  // 별점 UI 생성
  const renderStars = (rating) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xl ${
            star <= rating ? "text-yellow-500" : "text-gray-200"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );

  // 파이 차트 데이터 준비
  const prepareSentimentChartData = (sentimentAnalysis) => {
    if (!sentimentAnalysis) return null;

    const labels = Object.keys(sentimentAnalysis).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1)
    );

    const data = Object.values(sentimentAnalysis).map((value) => value * 100);

    // 색상 매핑
    const backgroundColor = [];
    labels.forEach((label) => {
      if (label.toLowerCase() === "positive") {
        backgroundColor.push("#10B981"); // 긍정: 녹색
      } else if (label.toLowerCase() === "negative") {
        backgroundColor.push("#EF4444"); // 부정: 빨간색
      } else {
        backgroundColor.push("#9CA3AF"); // 중립: 회색
      }
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 1,
        },
      ],
    };
  };

  const goBack = () => {
    navigate(`/product/detail/${productCode}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">리뷰 분석 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <div className="bg-red-50 border border-red-200 p-4 rounded-sm mb-4">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
        <button
          onClick={goBack}
          className="bg-black text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors font-medium flex items-center justify-center mx-auto"
        >
          <span className="mr-2">←</span> 상품으로 돌아가기
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm mb-4">
          <p className="text-blue-600 font-medium">
            분석 데이터를 찾을 수 없습니다.
          </p>
        </div>
        <button
          onClick={goBack}
          className="bg-black text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors font-medium flex items-center justify-center mx-auto"
        >
          <span className="mr-2">←</span> 상품으로 돌아가기
        </button>
      </div>
    );
  }

  const chartData = prepareSentimentChartData(analysis.sentimentAnalysis);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          <span
            onClick={() => navigate("/")}
            className="hover:text-black cursor-pointer"
          >
            홈
          </span>{" "}
          &gt;{" "}
          <span
            onClick={() => navigate("/product/home")}
            className="hover:text-black cursor-pointer"
          >
            상품
          </span>{" "}
          &gt;{" "}
          <span
            onClick={() => navigate(`/product/detail/${productCode}`)}
            className="hover:text-black cursor-pointer"
          >
            {analysis.productName}
          </span>{" "}
          &gt; <span className="text-black font-medium">리뷰 분석</span>
        </div>
        <h1 className="text-2xl font-bold text-black">
          리뷰 분석: {analysis.productName}
        </h1>
      </div>

      {analysis.reviewCount === 0 ? (
        <div className="border border-gray-200 p-6 rounded-sm bg-gray-50 mb-6">
          <p className="text-lg text-gray-800 mb-2">{analysis.summary}</p>
          <p className="text-gray-600">{analysis.recommendations[0]}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 평점 요약 */}
            <div className="border border-gray-200 rounded-sm bg-white shadow-sm hover:border-gray-300 transition-all overflow-hidden">
              <div className="bg-black text-white px-4 py-3">
                <h2 className="text-lg font-medium">평점 요약</h2>
              </div>
              <div className="p-6 text-center">
                <div className="text-4xl font-bold text-black mb-2">
                  {analysis.averageRating.toFixed(1)}
                  <span className="text-lg text-gray-500">/5</span>
                </div>
                <div className="flex justify-center space-x-1 mb-4">
                  {renderStars(analysis.averageRating)}
                </div>
                <p className="text-gray-600">
                  총 {analysis.reviewCount}개의 리뷰 기준
                </p>
              </div>
            </div>

            {/* 감정 분석 파이 차트 */}
            <div className="border border-gray-200 rounded-sm bg-white shadow-sm hover:border-gray-300 transition-all overflow-hidden">
              <div className="bg-black text-white px-4 py-3">
                <h2 className="text-lg font-medium">감정 분석</h2>
              </div>
              <div className="p-6" style={{ height: "280px" }}>
                {chartData && (
                  <Pie
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return `${context.label}: ${context.raw.toFixed(
                                1
                              )}%`;
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 긍정적 포인트 */}
            <div className="border border-gray-200 rounded-sm bg-white shadow-sm hover:border-gray-300 transition-all overflow-hidden">
              <div className="bg-green-600 text-white px-4 py-3">
                <h2 className="text-lg font-medium">주요 긍정적 포인트</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {analysis.keyPositivePoints.map((point, index) => (
                    <li
                      key={`positive-${index}`}
                      className="flex items-start text-gray-800"
                    >
                      <span className="text-green-500 mr-2">👍</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 부정적 포인트 */}
            <div className="border border-gray-200 rounded-sm bg-white shadow-sm hover:border-gray-300 transition-all overflow-hidden">
              <div className="bg-red-600 text-white px-4 py-3">
                <h2 className="text-lg font-medium">주요 부정적 포인트</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {analysis.keyNegativePoints.map((point, index) => (
                    <li
                      key={`negative-${index}`}
                      className="flex items-start text-gray-800"
                    >
                      <span className="text-red-500 mr-2">👎</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 전체 요약 */}
          <div className="border border-gray-200 rounded-sm bg-white shadow-sm hover:border-gray-300 transition-all overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3">
              <h2 className="text-lg font-medium">리뷰 요약</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-800 leading-relaxed">
                {analysis.summary}
              </p>
            </div>
          </div>

          {/* 추천사항 */}
          <div className="border border-gray-200 rounded-sm bg-white shadow-sm hover:border-gray-300 transition-all overflow-hidden">
            <div className="bg-black text-white px-4 py-3">
              <h2 className="text-lg font-medium">구매 시 고려사항</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analysis.recommendations.map((recommendation, index) => (
                  <div
                    key={`rec-${index}`}
                    className="border-l-4 border-black pl-4 py-3 bg-gray-50"
                  >
                    <div className="flex items-start">
                      <span className="text-yellow-500 mr-2">💡</span>
                      <span className="text-gray-800">{recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={goBack}
          className="bg-black text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors font-medium flex items-center"
        >
          <span className="mr-2">←</span> 상품으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ReviewAnalysis;
