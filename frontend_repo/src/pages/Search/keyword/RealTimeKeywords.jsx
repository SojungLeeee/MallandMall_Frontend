import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaMinus, FaFire, FaRedo, FaClock } from "react-icons/fa";
import axios from "axios";

// API 호출용 axios 인스턴스 생성
const instance = axios.create({
  baseURL: "https://morek9.click", // baseURL 설정 (프로젝트에 맞게 수정 필요)
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
});

/**
 * 실시간 인기 검색어 컴포넌트
 * @returns {JSX.Element}
 */
const RealTimeKeywords = ({ limit = 10, onKeywordClick = null }) => {
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  // 인기 검색어 데이터 가져오기
  const fetchTrendingKeywords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // emart context path 포함된 URL로 API 호출
      const response = await instance.get(`/api/search/trending-keywords`, {
        params: { limit },
      });

      if (response.status === 200 && response.data) {
        setKeywords(response.data);
        setLastUpdated(new Date());
      } else {
        throw new Error("검색어 데이터를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("인기 검색어 가져오기 오류:", err);
      setError("데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");

      // API가 구현되지 않은 경우 샘플 데이터 사용 (개발 환경용)
      setKeywords(generateSampleKeywords(limit));
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchTrendingKeywords();

    // 5분마다 자동 업데이트 (선택적)
    const intervalId = setInterval(() => {
      fetchTrendingKeywords();
    }, 300000); // 5분 = 300,000ms

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [limit]);

  // RealTimeKeywords.jsx의 handleKeywordClick 함수 수정
  const handleKeywordClick = (keyword) => {
    if (onKeywordClick) {
      // 부모 컴포넌트에서 제공한 콜백 함수 사용
      onKeywordClick(keyword);
    } else {
      // 관련 상품이 있는지 확인 후 이동
      fetchRelatedProducts(keyword);
    }
  };

  // 관련 상품 조회 함수 추가
  const fetchRelatedProducts = async (keyword) => {
    try {
      const response = await instance.get(`/api/search/related-products`, {
        params: { keyword, limit: 5 },
      });

      if (response.status === 200 && response.data && response.data.length > 0) {
        // 관련 상품이 있으면 상품 목록 페이지로 이동
        navigate(`/products/search?keyword=${encodeURIComponent(keyword)}`);
      } else {
        // 관련 상품이 없으면 일반 검색 결과로 이동
        navigate(`/search/${encodeURIComponent(keyword)}`);
      }
    } catch (err) {
      console.error("관련 상품 조회 오류:", err);
      // 오류 발생 시 일반 검색으로 이동
      navigate(`/search/${encodeURIComponent(keyword)}`);
    }
  };

  // 샘플 데이터 생성 함수 (API 구현 전 테스트용)
  const generateSampleKeywords = (count) => {
    const sampleKeywords = [
      "노트북",
      "스마트폰",
      "에어팟",
      "태블릿",
      "블루투스 이어폰",
      "키보드",
      "마우스",
      "모니터",
      "노트북 가방",
      "충전기",
      "외장하드",
      "무선마우스",
      "게이밍 키보드",
      "노트북 거치대",
      "보조배터리",
    ];

    return Array.from({ length: Math.min(count, sampleKeywords.length) }, (_, i) => ({
      rank: i + 1,
      keyword: sampleKeywords[i],
      count: Math.floor(Math.random() * 100) + 10,
      rankChange: Math.floor(Math.random() * 7) - 3, // -3 ~ +3
    }));
  };

  // 순위 변동 아이콘 렌더링
  const renderRankChange = (change) => {
    if (change > 0) {
      return (
        <span className="flex items-center text-green-500 text-xs">
          <FaArrowUp size={10} className="mr-1" />
          <span>{Math.abs(change)}</span>
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="flex items-center text-red-500 text-xs">
          <FaArrowDown size={10} className="mr-1" />
          <span>{Math.abs(change)}</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-gray-400 text-xs">
          <FaMinus size={10} />
        </span>
      );
    }
  };

  // 마지막 업데이트 시간 포맷팅
  const formatLastUpdated = () => {
    if (!lastUpdated) return "업데이트 중...";

    const now = new Date();
    const diffMinutes = Math.floor((now - lastUpdated) / 60000);

    if (diffMinutes < 1) return "방금 전";
    if (diffMinutes < 60) return `${diffMinutes}분 전`;

    return lastUpdated.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 로딩 중 표시
  if (isLoading && keywords.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
        <div className="flex items-center justify-between mb-2 pb-2 border-b">
          <div className="flex items-center text-sm font-medium text-gray-700">
            <FaFire className="text-orange-500 mr-1" />
            <span>실시간 인기 검색어</span>
          </div>
        </div>
        <div className="py-4 flex justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // 에러 표시
  if (error && keywords.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
        <div className="flex items-center justify-between mb-2 pb-2 border-b">
          <div className="flex items-center text-sm font-medium text-gray-700">
            <FaFire className="text-orange-500 mr-1" />
            <span>실시간 인기 검색어</span>
          </div>
        </div>
        <div className="py-2 text-center text-red-500 text-sm">
          {error}
          <button onClick={fetchTrendingKeywords} className="ml-2 text-blue-500 hover:underline flex items-center">
            <FaRedo size={10} className="mr-1" /> 다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
      <div className="flex items-center justify-between mb-2 pb-2 border-b">
        <div className="flex items-center text-sm font-medium text-gray-700">
          <FaFire className="text-orange-500 mr-1" />
          <span>실시간 인기 검색어</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <FaClock className="mr-1" size={10} />
          <span>{formatLastUpdated()}</span>
          <button onClick={fetchTrendingKeywords} className="ml-2 text-blue-500 hover:text-blue-700" title="새로고침">
            <FaRedo size={10} />
          </button>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
        {keywords.map((item) => (
          <li key={item.rank} className="flex items-center py-1">
            <span
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-1.5 text-xs font-medium ${
                item.rank <= 3 ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-700"
              }`}
            >
              {item.rank}
            </span>
            <button
              onClick={() => handleKeywordClick(item.keyword)}
              className="flex-1 text-left text-sm truncate hover:text-blue-600"
            >
              {item.keyword}
            </button>
            <div className="flex-shrink-0 ml-1">{renderRankChange(item.rankChange)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RealTimeKeywords;
