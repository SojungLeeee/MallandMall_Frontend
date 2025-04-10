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

// 범례 정렬 플러그인 정의
const legendAlignmentPlugin = {
  id: "legendAlignment",
  afterRender: (chart) => {
    // 차트가 렌더링된 후에 DOM을 직접 조작
    setTimeout(() => {
      const canvas = chart.canvas;
      if (!canvas || !canvas.parentNode) return;

      const legendItems = canvas.parentNode.querySelectorAll(
        ".chartjs-legend-item"
      );

      if (legendItems && legendItems.length) {
        // 모든 항목에 flex 스타일 적용
        legendItems.forEach((item) => {
          item.style.display = "flex";
          item.style.alignItems = "center";
        });

        // 원 요소(마커) 찾기 및 정렬
        const markers = canvas.parentNode.querySelectorAll(
          ".chartjs-legend-item span"
        );
        if (markers && markers.length) {
          // 기준이 될 첫 번째 마커의 위치 찾기
          const firstMarkerRect = markers[0].getBoundingClientRect();
          const referenceLeft = firstMarkerRect.left;

          // 모든 마커를 기준 위치에 맞춤
          markers.forEach((marker) => {
            const rect = marker.getBoundingClientRect();
            const diff = referenceLeft - rect.left;

            if (diff !== 0) {
              marker.style.marginLeft = `${diff}px`;
            }

            // 공통 스타일 적용
            marker.style.marginRight = "8px";
            marker.style.flexShrink = "0";
          });
        }
      }
    }, 0);
  },
};

const ReviewAnalysis = () => {
  const { productCode } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDots, setLoadingDots] = useState("");

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

  // 로딩 애니메이션을 위한 useEffect
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center p-8 rounded-xl shadow-lg bg-white">
          <div className="relative mx-auto w-16 h-16">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div
              className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-b-blue-300 rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>

          <h2 className="mt-6 text-xl font-bold text-gray-800">리뷰 분석 중</h2>
          <p className="mt-2 text-gray-600">
            데이터를 처리하고 있습니다{loadingDots}
          </p>

          <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full animate-pulse"></div>
          </div>

          <p className="mt-4 text-xs text-gray-500">잠시만 기다려 주세요</p>
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

      {/* 리뷰 카테고리 섹션 - 제품 이름 바로 아래에 배치 */}
      {analysis.reviewCount > 0 &&
        analysis.reviewCategories &&
        analysis.reviewCategories.length > 0 && (
          <div className="mb-6">
            <div className="mb-2">
              <span className="text-green-500 font-bold">✓</span>{" "}
              <span className="text-black font-medium">
                {analysis.reviewCount}명 참여
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {analysis.reviewCategories.map((category, index) => (
                <div
                  key={`category-${index}`}
                  className="flex items-center bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors"
                >
                  <span className="text-xl mr-2">{category.emoji}</span>
                  <span className="flex-grow text-gray-800">
                    "{category.category}"
                  </span>
                  <span className="text-teal-600 font-medium">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
              <div className="p-6" style={{ height: "300px" }}>
                {chartData && (
                  <Pie
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      layout: {
                        padding: {
                          bottom: 20,
                        },
                      },
                      plugins: {
                        legend: {
                          position: "bottom",
                          align: "start", // 왼쪽 정렬로 변경
                          title: {
                            display: true,
                            text: "감정 카테고리",
                            font: {
                              weight: "bold",
                              size: 12,
                            },
                            padding: {
                              top: 3,
                              bottom: 0,
                            },
                          },
                          labels: {
                            font: {
                              size: 12,
                            },
                            padding: 5,
                            usePointStyle: true,
                            pointStyle: "circle",
                            boxWidth: 20, // 모든 라벨의 상자 너비 고정
                            boxHeight: 15, // 모든 라벨의 상자 높이 고정
                            textAlign: "left", // 텍스트 왼쪽 정렬
                            generateLabels: function (chart) {
                              const data = chart.data;
                              if (data.labels.length && data.datasets.length) {
                                return data.labels.map(function (label, i) {
                                  const meta = chart.getDatasetMeta(0);
                                  const style = meta.controller.getStyle(i);

                                  return {
                                    text: `${label} (${data.datasets[0].data[
                                      i
                                    ].toFixed(1)}%)`,
                                    fillStyle: style.backgroundColor,
                                    strokeStyle: style.borderColor,
                                    lineWidth: style.borderWidth,
                                    pointStyle: "circle",
                                    hidden: !chart.getDataVisibility(i),
                                    index: i,
                                  };
                                });
                              }
                              return [];
                            },
                          },
                          display: true,
                          maxWidth: 300, // 범례 최대 너비 설정
                          maxHeight: 80, // 범례 최대 높이 설정
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
                    plugins={[legendAlignmentPlugin]} // 범례 정렬 플러그인 적용
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 긍정적 포인트 */}
            <div className="border border-gray-200 rounded-sm bg-white shadow-sm hover:border-gray-300 transition-all overflow-hidden">
              <div className="bg-green-600 text-white px-4 py-3">
                <h2 className="text-lg font-medium">긍정적 포인트</h2>
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
                <h2 className="text-lg font-medium">부정적 포인트</h2>
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
