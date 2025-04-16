import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowDown,
  FaList,
  FaStar,
  FaSearch,
  FaRegLightbulb,
} from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import {
  fetchVectorSuggestions,
  fetchSearchProducts,
  recordSearchKeyword, // 기존 함수 유지
} from "../../api/httpSearchService";
import {
  fetchProductReviews,
  fetchReviewAnalysis,
} from "../../api/httpMemberService"; // 리뷰 분석 API 추가

import {
  fetchElasticSearch,
  fetchSmartSearch,
  fetchSearchSuggestions, // 기존 함수 유지
} from "../../api/elasticsearch";
import RealTimeKeywords from "./keyword/RealTimeKeywords"; // 실시간 검색어 컴포넌트 추가
import axios from "axios";

const Search = () => {
  const [search, setSearch] = useState("");
  const [vectorSuggestions, setVectorSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchResultLoading, setIsSearchResultLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  const autoSearchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const [lastSearchTerm, setLastSearchTerm] = useState("");

  // Elasticsearch 관련 상태 추가
  const [suggestions, setSuggestions] = useState([]); // 검색어 제안
  const [useElastic, setUseElastic] = useState(true); // Elasticsearch 사용 여부 (기본값: 사용)
  const [showSuggestions, setShowSuggestions] = useState(false); // 제안 표시 여부

  // 검색어 입력 시 제안 처리 로직 추가
  useEffect(() => {
    // 검색어 제안 표시 로직
    if (search.trim().length > 1) {
      // 이전에 설정된 타이머 취소
      clearTimeout(searchTimeoutRef.current);

      // 타이핑 중단 후 300ms 후에 검색어 제안 가져오기
      searchTimeoutRef.current = setTimeout(() => {
        // Elasticsearch 활성화된 경우에만 제안 가져오기
        if (useElastic) {
          fetchSearchSuggestions(search.trim())
            .then((suggestions) => {
              setSuggestions(suggestions || []);
              setShowSuggestions(suggestions && suggestions.length > 0);
            })
            .catch((error) => {
              console.error("검색어 제안 가져오기 오류:", error);
              setSuggestions([]);
              setShowSuggestions(false);
            });
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => clearTimeout(searchTimeoutRef.current);
  }, [search, useElastic]);

  // 기존 자동 검색 로직 유지
  useEffect(() => {
    if (search.trim().length > 1 && search !== lastSearchTerm) {
      // 이미 실행 중인 타이머 취소
      clearTimeout(autoSearchTimeoutRef.current);

      // 1초 후 자동 검색 실행
      autoSearchTimeoutRef.current = setTimeout(() => {
        performSearch(search);
      }, 1000);
    }

    return () => clearTimeout(autoSearchTimeoutRef.current);
  }, [search, lastSearchTerm]);

  // 검색 실행 함수 수정
  const performSearch = (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length <= 1) return;

    setIsLoading(true);
    setIsSearchResultLoading(true);
    setLastSearchTerm(searchTerm);
    setShowSuggestions(false); // 검색 실행 시 제안 숨기기

    // 검색어 기록 API 호출 (실시간 검색어 집계용)
    recordSearchKeyword(searchTerm);

    // Elasticsearch를 사용하는 경우
    if (useElastic) {
      // 스마트 검색 API 호출 (자동완성 및 추천 포함)
      fetchSmartSearch(searchTerm, 10)
        .then((response) => {
          if (response && response.data) {
            // 검색 결과가 products 키에 있는 경우
            if (response.data.products) {
              setSearchResults(response.data.products);
            }
            // 검색 결과가 results 키에 있는 경우
            else if (response.data.results) {
              setSearchResults(response.data.results);
            }
            // 결과가 직접 배열로 있는 경우
            else if (Array.isArray(response.data)) {
              setSearchResults(response.data);
            }
            // 그 외의 경우는 빈 배열로 처리
            else {
              setSearchResults([]);
            }

            // 제안 처리
            if (
              response.data.suggestions &&
              response.data.suggestions.length > 0
            ) {
              setSuggestions(response.data.suggestions);
            }
          } else {
            setSearchResults([]);
          }
        })
        .catch((error) => {
          console.error("스마트 검색 API 오류:", error);
          // 오류 발생 시 기존 검색으로 폴백
          fallbackToRegularSearch(searchTerm);
        })
        .finally(() => {
          setIsSearchResultLoading(false);
        });
    } else {
      // 기존 검색 사용
      fallbackToRegularSearch(searchTerm);
    }

    // 벡터 검색은 기존과 동일하게 유지
    fetchVectorSuggestions(searchTerm, 5)
      .then(async (vectorData) => {
        if (vectorData && vectorData.length > 0) {
          // 벡터 검색 결과의 모든 productCode 목록
          const productCodes = vectorData.map(
            (item) => item.productCode || item.product_code
          );

          try {
            // 제품 이미지 정보를 일괄 조회
            const productDataResponse = await fetchSearchProducts(
              productCodes.join(",")
            );

            // 제품 이미지 정보가 있으면 벡터 결과에 추가
            if (productDataResponse && productDataResponse.data) {
              const productImageMap = {};

              // 제품 코드로 이미지 매핑 생성
              productDataResponse.data.forEach((product) => {
                productImageMap[product.productCode] = product.image;
              });

              // 벡터 결과에 이미지 정보 추가
              const vectorWithImages = vectorData.map((item) => {
                const productCode = item.productCode || item.product_code;
                return {
                  ...item,
                  image: productImageMap[productCode] || null,
                };
              });

              setVectorSuggestions(vectorWithImages);
            } else {
              setVectorSuggestions(vectorData);
            }
          } catch (error) {
            console.error("제품 이미지 조회 오류:", error);
            setVectorSuggestions(vectorData);
          }
        } else {
          setVectorSuggestions([]);
        }
      })
      .catch((error) => {
        console.error("벡터 검색 API 오류:", error);
        setVectorSuggestions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 기존 검색으로 폴백하는 함수
  const fallbackToRegularSearch = (searchTerm) => {
    fetchSearchProducts(searchTerm)
      .then((searchData) => {
        if (searchData.status === 204) {
          setSearchResults([]);
        } else if (searchData && searchData.data) {
          setSearchResults(searchData.data);
        }
      })
      .catch((error) => {
        console.error("검색 API 오류:", error);
        setSearchResults([]);
      })
      .finally(() => {
        setIsSearchResultLoading(false);
      });
  };

  // 검색어 변경 핸들러 (기존 코드 유지)
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearch(newValue);

    // 검색어가 지워진 경우
    if (newValue.trim() === "") {
      setVectorSuggestions([]);
      setSearchResults([]);
      setLastSearchTerm("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 제안 검색어 클릭 핸들러 (추가)
  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    performSearch(suggestion);
    setShowSuggestions(false);
  };

  // 실시간 검색어 클릭 핸들러 (기존 코드 유지)
  const handleKeywordClick = (keyword) => {
    setSearch(keyword);
    performSearch(keyword);
  };

  // 검색 모드 전환 토글 (추가)
  const toggleSearchMode = () => {
    setUseElastic(!useElastic);

    // 검색어가 있으면 현재 검색어로 다시 검색
    if (search.trim().length > 1) {
      performSearch(search);
    }
  };

  // 별점 렌더링 함수 (기존 코드 유지)
  const renderStars = (rating) => {
    const stars = [];
    const ratingNum = parseFloat(rating);

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(ratingNum)) {
        // 꽉 찬 별
        stars.push(
          <FaStar key={i} className="text-yellow-400 inline" size={12} />
        );
      } else if (i === Math.ceil(ratingNum) && !Number.isInteger(ratingNum)) {
        // 반 별 (정수가 아닌 경우에만)
        stars.push(
          <FaStar
            key={i}
            className="text-yellow-400 inline opacity-50"
            size={12}
          />
        );
      } else {
        // 빈 별
        stars.push(
          <FaStar key={i} className="text-gray-300 inline" size={12} />
        );
      }
    }

    return (
      <span className="flex items-center">
        {stars}
        <span className="ml-1 text-xs text-gray-600">{rating}</span>
      </span>
    );
  };

  // 검색어 제안 렌더링 (추가)
  const renderSuggestions = () => {
    if (!showSuggestions || !suggestions || suggestions.length === 0)
      return null;

    return (
      <div className="absolute w-4/5 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
        <ul className="py-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer text-left"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center">
                <CiSearch className="mr-2 h-4 w-4 text-gray-500" />
                {suggestion}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // AI 추천 제품 아이템 컴포넌트 - 리뷰 분석 데이터 활용 버전 (기존 코드 유지)
  const AIRecommendationItem = ({ item }) => {
    const [reviewData, setReviewData] = useState(null);
    const [isReviewLoading, setIsReviewLoading] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
    const [analysisFailed, setAnalysisFailed] = useState(false);
    const navigate = useNavigate();

    // 제품 코드가 있는 경우 리뷰 데이터와 분석 데이터 가져오기
    useEffect(() => {
      // 속성명 일관성 유지: product_code 또는 productCode 둘 다 처리
      const productCode = item.productCode || item.product_code;

      if (item && productCode) {
        setIsReviewLoading(true);
        setIsAnalysisLoading(true);
        setAnalysisFailed(false);

        // 리뷰 데이터 가져오기
        const fetchReviewData = async () => {
          try {
            // fetchProductReviews API 함수를 사용하여 리뷰 데이터 가져오기
            const reviews = await fetchProductReviews(productCode);

            // 평균 별점 계산
            if (reviews && reviews.length > 0) {
              const totalRating = reviews.reduce(
                (sum, review) => sum + review.rating,
                0
              );
              const averageRating = totalRating / reviews.length;
              setReviewData({
                averageRating: averageRating.toFixed(1),
                reviewCount: reviews.length,
                // 리뷰 분석이 실패했을 경우를 대비해 리뷰 텍스트에서 핵심 키워드 추출
                keywords: extractKeywordsFromReviews(reviews),
              });
            }
          } catch (error) {
            console.error("리뷰 데이터 불러오기 실패:", error);
            // 에러 발생 시 기존 별점 데이터 사용
          } finally {
            setIsReviewLoading(false);
          }
        };

        // 리뷰 분석 데이터 가져오기
        const fetchAnalysisData = async () => {
          try {
            const analysis = await fetchReviewAnalysis(productCode);

            if (
              analysis &&
              (analysis.reviewCategories || analysis.keyPositivePoints)
            ) {
              setAnalysisData(analysis);
            } else {
              console.warn("리뷰 분석 데이터가 유효하지 않습니다:", analysis);
              setAnalysisFailed(true);
            }
          } catch (error) {
            console.error("리뷰 분석 데이터 불러오기 실패:", error);
            setAnalysisFailed(true);
          } finally {
            setIsAnalysisLoading(false);
          }
        };

        // 병렬로 데이터 로드
        Promise.all([fetchReviewData(), fetchAnalysisData()]).catch((err) => {
          console.error("데이터 로드 중 오류 발생:", err);
        });
      }
    }, [item]);

    // 리뷰 텍스트에서 핵심 키워드 추출 (백업 용도)
    const extractKeywordsFromReviews = (reviews) => {
      if (!reviews || reviews.length === 0) return [];

      // 간단한 키워드 추출 로직
      const keywords = {
        가성비: 0,
        품질: 0,
        맛: 0,
        신선도: 0,
        크기: 0,
        양: 0,
        디자인: 0,
        배송: 0,
        내구성: 0,
      };

      // 리뷰 텍스트에서 키워드 빈도 계산
      reviews.forEach((review) => {
        const text = review.reviewText || "";
        Object.keys(keywords).forEach((keyword) => {
          if (text.includes(keyword)) {
            keywords[keyword]++;
          }
        });
      });

      // 빈도순으로 정렬하여 상위 3개 반환
      return Object.entries(keywords)
        .filter(([_, count]) => count > 0)
        .sort(([_, countA], [__, countB]) => countB - countA)
        .slice(0, 5)
        .map(([keyword, _]) => {
          // 키워드에 따라 텍스트 변환
          switch (keyword) {
            case "가성비":
              return "가성비 좋음";
            case "품질":
              return "품질 우수";
            case "맛":
              return "맛 좋음";
            case "신선도":
              return "신선한 제품";
            case "크기":
            case "양":
              return "적당한 크기/양";
            case "디자인":
              return "디자인 세련됨";
            case "배송":
              return "배송 빠름";
            case "내구성":
              return "내구성 우수";
            default:
              return `${keyword} 좋음`;
          }
        });
    };

    // 제품 클릭 핸들러
    const handleProductClick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // 속성명 일관성 유지: 두 가지 속성명 모두 처리
      const productCode = item.productCode || item.product_code;
      setTimeout(() => {
        navigate(`/product/${productCode}`);
      }, 10);
    };

    // 매칭 키워드 하이라이트 (예: 검색어와 일치하는 부분)
    const highlightMatchingTerms = (text, term) => {
      if (!term || !text) return text;

      const regex = new RegExp(`(${term})`, "gi");
      const parts = text.split(regex);

      return parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="bg-yellow-100 text-yellow-800">
            {part}
          </span>
        ) : (
          part
        )
      );
    };

    // 리뷰 카테고리를 리뷰 포인트로 변환
    const getCategoryPoints = () => {
      // 분석 데이터가 있고 리뷰 카테고리가 있는 경우
      if (
        analysisData &&
        analysisData.reviewCategories &&
        analysisData.reviewCategories.length > 0
      ) {
        // 언급 횟수가 0보다 큰 카테고리만 필터링
        const validCategories = analysisData.reviewCategories
          .filter((cat) => cat.count > 0)
          .sort((a, b) => b.count - a.count); // 언급 횟수 내림차순 정렬

        if (validCategories.length > 0) {
          // 카테고리를 리뷰 포인트로 변환 (최대 3개)
          return validCategories.slice(0, 3).map((cat) => {
            // 카테고리 이름에 따라 포인트 내용 생성
            const categoryName = cat.category;
            const emoji = cat.emoji || "";

            switch (categoryName) {
              case "맛/품질":
                return `${emoji} 품질 우수`;
              case "가성비":
                return `${emoji} 가성비 좋음`;
              case "신선도":
                return `${emoji} 신선한 제품`;
              case "양/크기":
                return `${emoji} 적당한 크기`;
              case "주차편의성":
                return `${emoji} 주차 편리`;
              default:
                return `${emoji} ${categoryName}`;
            }
          });
        }
      }

      // 백엔드 분석 데이터에 keyPositivePoints가 있는 경우 사용
      if (
        analysisData &&
        analysisData.keyPositivePoints &&
        analysisData.keyPositivePoints.length > 0
      ) {
        return analysisData.keyPositivePoints.slice(0, 3).map((point) => {
          // 긍정적 포인트를 간결하게 표시
          const shortPoint =
            point.length > 12 ? point.substring(0, 12) + "..." : point;
          return shortPoint;
        });
      }

      // 분석 실패했지만 리뷰 데이터에서 추출한 키워드가 있는 경우
      if (
        analysisFailed &&
        reviewData &&
        reviewData.keywords &&
        reviewData.keywords.length > 0
      ) {
        return reviewData.keywords;
      }

      // 모든 데이터가 없는 경우 기본값 사용
      return ["가성비 좋음", "내구성 우수", "디자인 세련됨"];
    };

    // 제품 이름도 일관성 있게 처리
    const productName = item.productName || item.product_name;

    return (
      <div
        onClick={handleProductClick}
        className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 relative"
      >
        <div className="flex items-start">
          {/* 제품 이미지 - 벡터 검색 결과에 추가된 이미지 사용 */}
          <div className="w-14 h-14 rounded bg-gray-100 mr-3 flex-shrink-0 overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder-product.png"; // 이미지 로드 실패 시 기본 이미지
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                이미지 없음
              </div>
            )}
          </div>

          <div className="flex-1">
            {/* 제품 이름 */}
            <div className="font-medium text-sm text-left">
              {highlightMatchingTerms(
                productName || item.productCode || item.product_code,
                search
              )}
            </div>

            {/* 별점 및 리뷰 - 실제 데이터 표시 */}
            <div className="flex items-center mt-1">
              {isReviewLoading ? (
                <div className="flex items-center">
                  <div className="animate-pulse h-3 w-20 bg-gray-200 rounded"></div>
                  <span className="text-xs text-gray-400 ml-2">로딩 중...</span>
                </div>
              ) : reviewData ? (
                <>
                  {renderStars(reviewData.averageRating)}
                  <span className="text-xs text-gray-500 ml-2">
                    ({reviewData.reviewCount}건)
                  </span>
                </>
              ) : (
                <>
                  {renderStars(item.rating || "4.3")}
                  <span className="text-xs text-gray-500 ml-2">
                    ({item.reviewCount || 120}건)
                  </span>
                </>
              )}
            </div>

            {/* 리뷰 핵심 포인트 */}
            <div className="mt-1 flex flex-wrap gap-1">
              {isAnalysisLoading ? (
                <div className="flex items-center">
                  <div className="animate-pulse h-3 w-full bg-gray-200 rounded"></div>
                </div>
              ) : (
                getCategoryPoints().map((point, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                  >
                    {point}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 수정된 일반 검색 제품 아이템 컴포넌트 - 기존 요소 유지
  const SearchResultItem = ({ product }) => {
    const navigate = useNavigate();

    const handleProductClick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const productCode = product.productCode;
      setTimeout(() => {
        navigate(`/product/${productCode}`);
      }, 10);
    };

    return (
      <div
        onClick={handleProductClick}
        className="block py-2 px-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 no-underline text-inherit relative"
      >
        <div className="flex items-center">
          {/* 제품 이미지 */}
          <div className="w-12 h-12 text-left rounded bg-gray-100 mr-3 flex-shrink-0 overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                이미지 없음
              </div>
            )}
          </div>

          {/* 제품 정보 */}
          <div className="flex-1 min-w-0 ">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-left font-medium truncate pr-2">
                {product.productName}
              </h3>
              {product.price && (
                <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                  {typeof product.price === "number"
                    ? product.price.toLocaleString() + "원"
                    : product.price}
                </span>
              )}
            </div>

            {/* 카테고리 표시 */}
            {product.category && (
              <div className="text-xs text-left text-gray-500 mt-1 truncate">
                {product.category}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto pb-4">
      <div className="flex justify-center px-2 mb-3 relative">
        <div className="flex justify-between items-center w-full">
          <div className="relative flex-grow flex">
            <div className="relative w-4/5">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="검색어 입력"
                className="w-full p-2 pl-8 pr-8 mt-4 ml-1 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-sm focus:outline-none text-sm"
              />
              <CiSearch className="absolute left-2 mt-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

              {/* 로딩 인디케이터 */}
              {isLoading && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}

              {/* 검색 모드 토글 (일반/Elasticsearch) */}
              {!isLoading && (
                <div
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={toggleSearchMode}
                  title={
                    useElastic
                      ? "Elasticsearch 검색 사용 중"
                      : "일반 검색 사용 중"
                  }
                >
                  <div
                    className={`h-3 w-3 rounded-full ${
                      useElastic ? "bg-blue-500" : "bg-gray-400"
                    }`}
                  ></div>
                </div>
              )}
            </div>

            {/* 취소 버튼 */}
            <Link
              to="/"
              className="w-1/5 p-2 mt-3 flex items-center justify-center font-medium text-sm cursor-pointer"
            >
              <span className="text-black">취소</span>
            </Link>
          </div>
        </div>

        {/* 검색어 제안 (Elasticsearch) */}
        {renderSuggestions()}
      </div>

      {/* 검색어 추천 섹션 (Elasticsearch 스마트 검색에서 제공하는 추천) */}
      {suggestions.length > 0 && !showSuggestions && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-1 mb-3 mx-2 overflow-hidden">
          <div className="p-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b text-sm font-medium text-gray-800">
            이런 검색어는 어떠세요?
          </div>
          <div className="p-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearch(suggestion);
                  performSearch(suggestion);
                }}
                className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 고정된 컨텐츠 영역 - 모바일 최적화 (세로 배치) */}
      <div className="flex flex-col gap-3 px-2">
        {/* 기본 검색 결과 섹션 - 향상된 디자인 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b text-sm font-medium text-gray-800 flex items-center justify-between">
            <div className="flex items-center">
              <FaList className="mr-2 h-4 w-4 text-blue-600" />
              <span>
                {useElastic ? "Elasticsearch 검색 결과" : "검색 결과"}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {searchResults.length > 0 && `${searchResults.length}개 항목`}
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto">
            {searchResults.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {searchResults.map((product, index) => (
                  <li key={index} className="list-none group">
                    <div className="transition-colors duration-150 group-hover:bg-blue-50/40">
                      <SearchResultItem product={product} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : search.trim().length > 1 ? (
              isSearchResultLoading ? (
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 mb-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                  <p className="text-sm text-gray-500 animate-pulse">
                    검색 중...
                  </p>
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">검색 결과가 없습니다</p>
                  <p className="text-xs text-gray-400 mt-1">
                    다른 검색어를 시도해 보세요
                  </p>
                </div>
              )
            ) : (
              <div className="p-8 flex flex-col items-center justify-center">
                <div className="w-12 h-12 mb-3 rounded-full bg-blue-50 flex items-center justify-center">
                  <FaSearch className="text-blue-400" />
                </div>
                <p className="text-sm text-gray-600">검색어를 입력하세요</p>
                <p className="text-xs text-gray-400 mt-1">
                  원하는 상품을 찾아드립니다
                </p>
              </div>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="p-2 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
              <span>{lastSearchTerm && `"${lastSearchTerm}" 검색 결과`}</span>
              {searchResults.length > 5 && (
                <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  더 보기 <FaArrowDown className="ml-1 h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* AI 추천 제품 섹션 - 향상된 디자인 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b text-sm font-medium text-gray-800 flex items-center justify-between">
            <div className="flex items-center">
              <FaRegLightbulb className="mr-2 h-4 w-4 text-blue-600" />
              <span className="text-blue-700">AI 맞춤 추천</span>
            </div>
            <div className="text-xs text-blue-600/70">
              {vectorSuggestions.length > 0 &&
                `${vectorSuggestions.length}개 추천`}
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {vectorSuggestions.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {vectorSuggestions.map((item, index) => (
                  <li key={index} className="list-none group">
                    <div className="transition-colors duration-150 group-hover:bg-blue-50/40">
                      <AIRecommendationItem item={item} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : search.trim().length > 1 ? (
              isLoading ? (
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 mb-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                  <p className="text-sm text-gray-500 animate-pulse">
                    AI가 맞춤형 제품을 찾는 중...
                  </p>
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaRegLightbulb className="text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-600">
                    AI 추천 제품을 찾는 중...
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    잠시만 기다려 주세요
                  </p>
                </div>
              )
            ) : (
              <div className="p-8 flex flex-col items-center justify-center">
                <div className="w-14 h-14 mb-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <FaRegLightbulb className="text-blue-500" size={24} />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  검색어를 입력하면
                </p>
                <p className="text-sm text-gray-600">AI가 리뷰 분석 기반으로</p>
                <p className="text-sm text-gray-600">
                  맞춤형 제품을 추천해 드립니다
                </p>
              </div>
            )}
          </div>

          {vectorSuggestions.length > 0 && (
            <div className="p-2 border-t border-blue-50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 flex justify-between items-center text-xs">
              <span className="text-blue-700">리뷰 분석 기반 추천</span>
              {vectorSuggestions.length > 5 && (
                <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  더 많은 추천 <FaArrowDown className="ml-1 h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>
        {/* 실시간 인기 검색어 섹션 추가 - 향상된 래퍼 */}
        <div className="transition-all duration-300 hover:shadow-md">
          <RealTimeKeywords limit={10} onKeywordClick={handleKeywordClick} />
        </div>
      </div>
    </div>
  );
};

export default Search;
