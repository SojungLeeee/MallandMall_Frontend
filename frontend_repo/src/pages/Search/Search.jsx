import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaChartLine,
  FaList,
} from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import {
  fetchVectorSuggestions,
  fetchSearchProducts,
} from "../../api/httpSearchService";

const Search = () => {
  const [search, setSearch] = useState("");
  const [vectorSuggestions, setVectorSuggestions] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchResultLoading, setIsSearchResultLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  const autoSearchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const [lastSearchTerm, setLastSearchTerm] = useState("");

  // 검색어 타이핑 중단 후 일정 시간이 지나면 자동 검색
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
  }, [search]);

  // 검색 실행 함수
  const performSearch = (searchTerm) => {
    if (
      !searchTerm ||
      searchTerm.trim().length <= 1 ||
      searchTerm === lastSearchTerm
    )
      return;

    setIsLoading(true);
    setIsSearchResultLoading(true);
    setLastSearchTerm(searchTerm);

    // 벡터 검색 및 일반 검색 병렬 처리
    Promise.all([
      fetchVectorSuggestions(searchTerm, 5),
      fetchSearchProducts(searchTerm),
    ])
      .then(([vectorData, searchData]) => {
        setVectorSuggestions(vectorData);

        if (searchData.status === 204) {
          setSearchResults([]);
        } else if (searchData && searchData.data) {
          setSearchResults(searchData.data);
        }
      })
      .catch((error) => {
        console.error("검색 API 오류:", error);
        setVectorSuggestions([]);
        setSearchResults([]);
      })
      .finally(() => {
        setIsLoading(false);
        setIsSearchResultLoading(false);
      });
  };

  // 컴포넌트 마운트 시 트렌딩 제품 로드
  useEffect(() => {
    // 트렌딩 제품 가져오기 (임시 모킹 데이터)
    const fetchTrendingProducts = async () => {
      try {
        // 임시 모킹 데이터
        const mockData = Array(5)
          .fill()
          .map((_, i) => ({
            rank: i + 1,
            product_code: `트렌딩-제품-${i + 1}`,
            product_name: `인기 상품 ${i + 1}`,
            similarity: 0.98 - i * 0.03,
            rankChange: Math.floor(Math.random() * 7) - 3, // -3 ~ +3
          }));

        setTrendingProducts(mockData);
      } catch (error) {
        console.error("트렌딩 제품 가져오기 오류:", error);
        setTrendingProducts([]);
      }
    };

    fetchTrendingProducts();
  }, []);

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearch(newValue);

    // 검색어가 지워진 경우
    if (newValue.trim() === "") {
      setVectorSuggestions([]);
      setSearchResults([]);
      setLastSearchTerm("");
    }
  };

  // 랭크 변동 아이콘 렌더링 함수
  const renderRankChange = (change) => {
    if (change > 0) {
      return <FaArrowUp className="text-green-500" size={14} />;
    } else if (change < 0) {
      return <FaArrowDown className="text-red-500" size={14} />;
    } else {
      return <FaMinus className="text-gray-500" size={14} />;
    }
  };

  // 제품 아이템 컴포넌트 - 클릭 중복 문제 해결
  const ProductItem = ({ item }) => {
    // 제품 클릭 핸들러 - 이벤트 전파 방지 및 직접 navigate 사용
    const handleProductClick = (e) => {
      e.preventDefault(); // 기본 이벤트 방지
      e.stopPropagation(); // 이벤트 전파 방지

      // 중복 클릭 방지를 위한 지연 처리
      const productCode = item.product_code;
      setTimeout(() => {
        navigate(`/product/${productCode}`);
      }, 10);
    };

    return (
      <div
        onClick={handleProductClick}
        className="block py-2 px-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 no-underline text-inherit"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 font-semibold rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">
              {item.rank}
            </span>
            <span className="text-sm font-medium truncate">
              {item.product_name || item.product_code}
            </span>
          </div>
          <div className="flex items-center">
            {renderRankChange(item.rankChange)}
            <span className="text-xs ml-1">{Math.abs(item.rankChange)}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 pl-7">
          유사도: {(parseFloat(item.similarity) * 100).toFixed(1)}%
        </div>
      </div>
    );
  };

  // 일반 검색 제품 아이템 컴포넌트 - 클릭 중복 문제 해결
  const SearchResultItem = ({ product }) => {
    // 제품 클릭 핸들러 - 이벤트 전파 방지 및 직접 navigate 사용
    const handleProductClick = (e) => {
      e.preventDefault(); // 기본 이벤트 방지
      e.stopPropagation(); // 이벤트 전파 방지

      // 중복 클릭 방지를 위한 지연 처리
      const productCode = product.productCode;
      setTimeout(() => {
        navigate(`/product/${productCode}`);
      }, 10);
    };

    return (
      <div
        onClick={handleProductClick}
        className="block py-2 px-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 no-underline text-inherit"
      >
        <div className="flex items-center">
          {/* 제품 이미지 */}
          <div className="w-12 h-12 rounded bg-gray-100 mr-3 flex-shrink-0 overflow-hidden">
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium truncate pr-2">
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
      <div className="flex justify-center px-2 mb-3">
        <div className="flex justify-between items-center w-full">
          <div className="relative flex-grow flex">
            <div className="relative w-4/5">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="검색어 입력"
                className="w-full p-2 pl-8 pr-8 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-sm focus:outline-none text-sm"
              />
              <CiSearch className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

              {/* 로딩 인디케이터 */}
              {isLoading && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            {/* 취소 버튼 */}
            <Link
              to="/"
              className="w-1/5 p-2 flex items-center justify-center font-medium text-sm cursor-pointer"
            >
              <span className="text-black">취소</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 고정된 컨텐츠 영역 - 모바일 최적화 (세로 배치) */}
      <div className="flex flex-col gap-3 px-2">
        {/* 기본 검색 결과 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-2 bg-gray-50 border-b text-sm font-medium text-gray-700 flex items-center">
            <FaList className="mr-1 h-4 w-4" />
            검색 결과
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((product, index) => (
                <li key={index} className="list-none">
                  <SearchResultItem product={product} />
                </li>
              ))
            ) : search.trim().length > 1 ? (
              isSearchResultLoading ? (
                <li className="p-3 text-center text-gray-500 text-sm">
                  검색 중...
                </li>
              ) : (
                <li className="p-3 text-center text-gray-500 text-sm">
                  검색 결과가 없습니다
                </li>
              )
            ) : (
              <li className="p-3 text-center text-gray-500 text-sm">
                검색어를 입력하세요
              </li>
            )}
          </ul>
        </div>

        {/* AI 추천 제품 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-2 bg-gray-50 border-b text-sm font-medium text-gray-700 flex items-center">
            <CiSearch className="mr-1 h-4 w-4" />
            AI 추천 제품
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {vectorSuggestions.length > 0 ? (
              vectorSuggestions.map((item, index) => (
                <li key={index} className="list-none">
                  <ProductItem item={item} />
                </li>
              ))
            ) : search.trim().length > 1 ? (
              isLoading ? (
                <li className="p-3 text-center text-gray-500 text-sm">
                  검색 중...
                </li>
              ) : (
                <li className="p-3 text-center text-gray-500 text-sm">
                  검색 결과가 없습니다
                </li>
              )
            ) : (
              <li className="p-3 text-center text-gray-500 text-sm">
                검색어를 입력하세요
              </li>
            )}
          </ul>
        </div>

        {/* 트렌딩 제품 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-2 bg-gray-50 border-b text-sm font-medium text-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <FaChartLine className="mr-1 h-4 w-4 text-blue-600" />
              트렌딩 제품
            </div>
            <Link
              to="/trending-dashboard"
              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            >
              대시보드 보기 →
            </Link>
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {trendingProducts.map((item, index) => (
              <li key={index} className="list-none">
                <ProductItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Search;
