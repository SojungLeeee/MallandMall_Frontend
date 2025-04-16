import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaFire,
  FaRedo,
  FaClock,
} from "react-icons/fa";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // 애니메이션 라이브러리 추가

// API 호출용 axios 인스턴스 생성
const instance = axios.create({
  baseURL: "http://localhost:8090/emart",
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
  const [refreshTrigger, setRefreshTrigger] = useState(false); // 새로고침 애니메이션 트리거
  const navigate = useNavigate();

  // 인기 검색어 데이터 가져오기
  const fetchTrendingKeywords = async () => {
    setIsLoading(true);
    setError(null);
    setRefreshTrigger(true); // 새로고침 애니메이션 시작

    try {
      const response = await instance.get(`/api/search/trending-keywords`, {
        params: { limit },
      });

      if (response.status === 200 && response.data) {
        // 데이터를 받아오면 애니메이션 적용을 위해 약간의 지연 후 설정
        setTimeout(() => {
          setKeywords(response.data);
          setLastUpdated(new Date());
          setRefreshTrigger(false); // 새로고침 애니메이션 종료
          setIsLoading(false);
        }, 300);
      } else {
        throw new Error("검색어 데이터를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("인기 검색어 가져오기 오류:", err);
      setError("데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");

      // API가 구현되지 않은 경우 샘플 데이터 사용 (개발 환경용)
      setTimeout(() => {
        setKeywords(generateSampleKeywords(limit));
        setRefreshTrigger(false); // 새로고침 애니메이션 종료
        setIsLoading(false);
      }, 300);
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

  // 검색어 클릭 핸들러
  const handleKeywordClick = (keyword) => {
    if (onKeywordClick) {
      // 부모 컴포넌트에서 제공한 콜백 함수 사용
      onKeywordClick(keyword);
    } else {
      // 기본 동작: 검색 페이지로 이동
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

    return Array.from(
      { length: Math.min(count, sampleKeywords.length) },
      (_, i) => ({
        rank: i + 1,
        keyword: sampleKeywords[i],
        count: Math.floor(Math.random() * 100) + 10,
        rankChange: Math.floor(Math.random() * 7) - 3, // -3 ~ +3
      })
    );
  };

  // 순위 변동 아이콘 렌더링
  const renderRankChange = (change) => {
    if (change > 0) {
      return (
        <motion.span
          className="flex items-center text-green-500 text-xs"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaArrowUp size={10} className="mr-1" />
          <span>{Math.abs(change)}</span>
        </motion.span>
      );
    } else if (change < 0) {
      return (
        <motion.span
          className="flex items-center text-red-500 text-xs"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaArrowDown size={10} className="mr-1" />
          <span>{Math.abs(change)}</span>
        </motion.span>
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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"
          ></motion.div>
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
          <motion.button
            onClick={fetchTrendingKeywords}
            className="ml-2 text-blue-500 hover:underline flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRedo size={10} className="mr-1" /> 다시 시도
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
      <div className="flex items-center justify-between mb-2 pb-2 border-b">
        <div className="flex items-center text-sm font-medium text-gray-700">
          <motion.div
            animate={{
              scale: refreshTrigger ? [1, 1.2, 1] : 1,
              color: refreshTrigger
                ? ["#f97316", "#ef4444", "#f97316"]
                : "#f97316",
            }}
            transition={{ duration: 0.5 }}
          >
            <FaFire className="text-orange-500 mr-1" />
          </motion.div>
          <span>실시간 인기 검색어</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <FaClock className="mr-1" size={10} />
          <span>{formatLastUpdated()}</span>
          <motion.button
            onClick={fetchTrendingKeywords}
            className="ml-2 text-blue-500 hover:text-blue-700"
            title="새로고침"
            whileHover={{ scale: 1.2, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            disabled={isLoading}
          >
            <FaRedo size={10} />
          </motion.button>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
        <AnimatePresence>
          {keywords.map((item) => (
            <motion.li
              key={item.rank}
              className="flex items-center py-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: item.rank * 0.05 }}
              layout
            >
              <motion.span
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-1.5 text-xs font-medium ${
                  item.rank <= 3
                    ? "bg-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-700"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {item.rank}
              </motion.span>
              <motion.button
                onClick={() => handleKeywordClick(item.keyword)}
                className="flex-1 text-left text-sm truncate hover:text-blue-600"
                whileHover={{ x: 3, color: "#2563eb" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.keyword}
              </motion.button>
              <div className="flex-shrink-0 ml-1">
                {renderRankChange(item.rankChange)}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default RealTimeKeywords;
