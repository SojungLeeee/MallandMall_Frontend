import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const NaverMap = () => {
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [branchInventory, setBranchInventory] = useState({});

  // GPS 관련 상태 추가
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const watchIdRef = useRef(null);

  // 상품 검색 관련 상태 변수들
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("productName"); // 'productName' 또는 'category'
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState(null);

  // 브랜치 데이터 가져오기 - BranchController의 엔드포인트 사용
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        console.log("지점 데이터 요청 시작");
        const response = await axios.get("emart/admin/branch/all");
        console.log("지점 데이터 응답:", response.data);
        setBranches(response.data);
      } catch (err) {
        console.error("지점 데이터 로드 실패:", err);
        setError("지점 데이터를 불러오는데 실패했습니다.");
      }
    };

    fetchBranches();
  }, []);

  // 브랜치와 인벤토리 데이터를 결합
  const branchesWithInventory = branches.map((branch) => ({
    ...branch,
    goodsCount: branchInventory[branch.branchName] || 0,
  }));

  // 상품명 또는 카테고리로 상품 검색
  const searchProducts = async () => {
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }

    try {
      setProductLoading(true);
      setProductError(null);

      // 상품 검색 API 호출
      const response = await axios.get("emart/product/search", {
        params: {
          searchType: searchType,
          keyword: searchTerm.trim(),
        },
      });

      console.log("검색 결과:", response.data);
      setProducts(response.data);
    } catch (err) {
      console.error("상품 검색 실패:", err);
      setProductError("상품 검색에 실패했습니다.");
    } finally {
      setProductLoading(false);
    }
  };

  // 검색어 입력 핸들러
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색 타입 변경 핸들러 (상품명/카테고리)
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  // 상품 선택 핸들러
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    fetchInventoryByProductCode(product.productCode);

    // 화면을 지도 영역으로 스크롤
    const mapElement = document.getElementById("map");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // 선택한 상품에 대한 인벤토리 정보 가져오기
  const fetchInventoryByProductCode = async (productCode) => {
    if (!productCode) {
      setBranchInventory({});
      return;
    }

    try {
      // 지점별 특정 상품 수량 조회
      const response = await axios.get(
        `emart/inventory/product/${productCode}/branches`
      );
      setBranchInventory(response.data);
    } catch (err) {
      console.error("상품별 인벤토리 데이터 로드 실패:", err);
      setError("상품 인벤토리 정보를 불러오는데 실패했습니다.");
    }
  };

  // 네이버 맵 초기화
  useEffect(() => {
    const initMap = () => {
      // 네이버 맵 스크립트 로드
      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.REACT_APP_NAVER_CLIENT_ID}&submodules=geocoder`;
      script.async = true;

      script.onload = () => {
        const mapOptions = {
          center: new window.naver.maps.LatLng(35.1796, 129.0756), // 부산 중심 좌표
          zoom: 11,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        };

        const newMap = new window.naver.maps.Map("map", mapOptions);
        setMap(newMap);
        setLoading(false);
      };

      script.onerror = (error) => {
        console.error("스크립트 로드 실패:", error);
        setError("네이버 지도 로딩 실패");
        setLoading(false);
      };

      document.body.appendChild(script);
    };

    initMap();

    // 컴포넌트 언마운트 시 위치 추적 중지
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // GPS 기능 활성화/비활성화 토글 함수
  const toggleGPS = () => {
    if (gpsEnabled) {
      // GPS 비활성화
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      // 현재 위치 마커 제거
      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
        setCurrentLocationMarker(null);
      }

      // 현재 위치 상태 초기화
      setCurrentLocation(null);
      setGpsEnabled(false);

      console.log("GPS 비활성화됨, 마커 제거됨");
    } else {
      // GPS 활성화
      startGPSTracking();
    }
  };

  // GPS 추적 시작 함수
  const startGPSTracking = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }

    setGpsEnabled(true);

    const options = {
      enableHighAccuracy: true, // 높은 정확도 사용
      timeout: 10000, // 10초 타임아웃
      maximumAge: 0, // 캐시된 위치 정보 사용 안 함
    };

    // 위치 추적 시작
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latLng = new window.naver.maps.LatLng(latitude, longitude);

        setCurrentLocation(latLng);

        // 맵이 로드되었는지 확인
        if (map) {
          // 현재 위치로 지도 중심 이동
          map.setCenter(latLng);

          // 현재 위치 마커 생성 또는 업데이트
          if (currentLocationMarker) {
            currentLocationMarker.setPosition(latLng);
          } else {
            const markerContent = document.createElement("div");
            markerContent.innerHTML = `
              <div style="
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background-color: #4285F4;
                border: 3px solid #ffffff;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                animation: pulse 1.5s infinite;
              "></div>
              <style>
                @keyframes pulse {
                  0% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7);
                  }
                  
                  70% {
                    transform: scale(1.1);
                    box-shadow: 0 0 0 10px rgba(66, 133, 244, 0);
                  }
                  
                  100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
                  }
                }
              </style>
            `;

            const newMarker = new window.naver.maps.Marker({
              position: latLng,
              map: map,
              icon: {
                content: markerContent,
                anchor: new window.naver.maps.Point(12, 12),
              },
              zIndex: 1000, // 다른 마커보다 위에 표시
            });

            setCurrentLocationMarker(newMarker);
          }
        }
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근 권한이 거부되었습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청이 시간 초과되었습니다.";
            break;
          default:
            errorMessage = "알 수 없는 오류";
            break;
        }

        console.error("GPS 오류:", errorMessage);
        alert(errorMessage);
        setGpsEnabled(false);
      },
      options
    );
  };

  // 브랜치 데이터를 사용하여 마커 생성
  useEffect(() => {
    if (map && branches.length > 0) {
      // 기존 마커 제거
      markers.forEach((marker) => {
        marker.setMap(null);
      });

      const newMarkers = [];

      branches.forEach((branch) => {
        if (branch.latitude && branch.longitude) {
          const position = new window.naver.maps.LatLng(
            branch.latitude,
            branch.longitude
          );

          const quantity = branchInventory[branch.branchName] || 0;
          const markerColor = quantity > 0 ? "#3B82F6" : "#9CA3AF"; // 파란색 또는 회색
          const shadowColor =
            quantity > 0
              ? "rgba(59, 130, 246, 0.25)"
              : "rgba(156, 163, 175, 0.25)";

          const markerContent = document.createElement("div");
          markerContent.className = "branch-marker";
          markerContent.innerHTML = `
          <div style="position: relative; width: 70px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="
              background-color: ${markerColor}; 
              color: white; 
              padding: 4px 8px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-radius: 30px; 
              box-shadow: 0 4px 12px ${shadowColor};
              transition: all 0.2s ease;
              border: 2px solid white;
            ">
              <!-- 왼쪽 아이콘 -->
              <div style="
                width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z"/>
                </svg>
              </div>
              
              <!-- 개수 표시 -->
              <div style="
                display: inline-block;
                font-size: 12px; 
                font-weight: 600;
                letter-spacing: 0.5px;
                text-align: right;
              ">${quantity}개</div>
            </div>
            <div style="
              position: absolute; 
              left: 50%; 
              margin-left: -6px; 
              bottom: -6px; 
              width: 12px; 
              height: 12px; 
              background: ${markerColor};
              border-right: 2px solid white;
              border-bottom: 2px solid white;
              transform: rotate(45deg);
              box-shadow: 4px 4px 8px ${shadowColor};
            "></div>
          </div>
        `;

          const marker = new window.naver.maps.Marker({
            position: position,
            map: map,
            icon: {
              content: markerContent,
              anchor: new window.naver.maps.Point(35, 35),
            },
            zIndex: quantity > 0 ? 100 : 50,
          });

          // 마커에 깔끔한 호버 효과 추가
          const markerElement = marker.getElement();
          if (markerElement) {
            const bubbleElement = markerElement.querySelector(
              ".branch-marker > div > div:first-child"
            );
            if (bubbleElement) {
              markerElement.addEventListener("mouseover", () => {
                bubbleElement.style.transform = "translateY(-3px)";
                bubbleElement.style.boxShadow = `0 6px 16px ${shadowColor}`;
              });

              markerElement.addEventListener("mouseout", () => {
                bubbleElement.style.transform = "translateY(0)";
                bubbleElement.style.boxShadow = `0 4px 12px ${shadowColor}`;
              });
            }
          }

          // 마커 클릭 이벤트
          window.naver.maps.Event.addListener(marker, "click", () => {
            fetchBranchDetail(branch.branchName);
          });

          newMarkers.push(marker);
        }
      });

      setMarkers(newMarkers);
    }
  }, [map, branches, branchInventory]);

  // 특정 지점 상세 정보 가져오기
  const fetchBranchDetail = async (branchName) => {
    try {
      // 임시로 브랜치 목록에서 선택된 브랜치 정보 사용
      const selectedBranch = branches.find((b) => b.branchName === branchName);
      if (selectedBranch) {
        setSelectedBranch({
          ...selectedBranch,
          goodsCount: branchInventory[branchName] || 0,
        });
      }
    } catch (err) {
      console.error("지점 상세 정보 로드 실패:", err);
      setError("지점 상세 정보를 불러오는데 실패했습니다.");
    }
  };

  // 간단한 상품 카드 컴포넌트
  const SimpleProductCard = ({ product, onClick, isSelected }) => {
    return (
      <div
        className={`bg-white border rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all ${
          isSelected
            ? "border-blue-500 ring-2 ring-blue-200"
            : "hover:scale-105"
        }`}
        onClick={() => onClick(product)}
      >
        <div className="flex flex-col h-full">
          {/* 상품 이미지 */}
          <div className="relative pt-[100%] bg-gray-100">
            {product.image ? (
              <img
                src={product.image}
                alt={product.productName}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                이미지 없음
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="p-3">
            <div className="text-xs font-semibold text-blue-600 mb-1">
              {product.category}
            </div>
            <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
              {product.productName}
            </h3>
            <div className="text-sm font-bold text-green-600">
              {product.price?.toLocaleString() || 0}원
            </div>

            {/* 평점 표시 (있는 경우) */}
            {product.averageRating > 0 && (
              <div className="flex items-center mt-1">
                <div className="flex mr-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-3 w-3 ${
                        star <= Math.round(product.averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {product.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
      {/* 상품 검색 섹션 */}
      <div className="flex flex-col space-y-1">
        <div className="flex space-x-1.5">
          <select
            value={searchType}
            onChange={handleSearchTypeChange}
            className="px-3 py-2 border border-gray-300 rounded-sm"
          >
            <option value="productName">상품명</option>
            <option value="category">카테고리</option>
          </select>

          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder={
                searchType === "productName"
                  ? "상품명을 입력하세요"
                  : "카테고리를 입력하세요"
              }
              className="w-full px-2 py-2 pr-1 border border-gray-300 rounded-sm"
            />
          </div>

          <button
            onClick={searchProducts}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2  rounded-sm shadow-md 
                     shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] 
                     hover:translate-y-[-3px] transition-transform 
                     focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 
                     duration-300 ease-in-out"
          >
            검색
          </button>
        </div>
      </div>

      {/* 선택된 상품 정보 */}
      {selectedProduct && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {selectedProduct.image && (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.productName}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
              )}
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedProduct.productName}
                </h2>
                <div className="text-sm text-gray-600 mb-1">
                  카테고리: {selectedProduct.category}
                </div>
                <div className="font-medium text-green-600">
                  가격: {selectedProduct.price?.toLocaleString() || 0}원
                </div>
              </div>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedProduct(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 지도 컨테이너 */}
      <div className="relative w-full h-96 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-md">
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white bg-opacity-80 p-4 rounded-lg font-bold">
            로딩 중...
          </div>
        )}

        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-red-50 p-4 rounded-lg text-red-600 font-bold">
            {error}
          </div>
        )}

        <div id="map" className="w-full h-full"></div>

        {/* GPS 버튼 추가 */}
        {map && !loading && (
          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={toggleGPS}
              className={`flex items-center justify-center w-8 h-8 rounded-full shadow-lg ${
                gpsEnabled ? "bg-blue-500" : "bg-white"
              } focus:outline-none transition-colors duration-300`}
              title={gpsEnabled ? "GPS 끄기" : "내 위치 찾기"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  gpsEnabled ? "text-white" : "text-gray-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 선택된 지점 정보 */}
      {selectedBranch && (
        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-bold mb-2">
            {selectedBranch.branchName}
          </h3>
          <p className="text-gray-600 mb-2">{selectedBranch.branchAddress}</p>
          {selectedProduct && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center">
                {selectedProduct.image && (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.productName}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                )}
                <div>
                  <p className="font-medium">
                    <span className="text-blue-600">
                      {selectedProduct.productName}
                    </span>
                  </p>
                  <p className="text-sm mt-1">
                    재고 수량:{" "}
                    <span className="font-bold">
                      {selectedBranch.goodsCount}개
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* 상품 검색 결과 - 지도 아래에 배치 */}
      {productLoading ? (
        <div className="p-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">상품을 검색 중입니다...</p>
        </div>
      ) : productError ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {productError}
        </div>
      ) : products.length > 0 ? (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3 px-2">
            <h2 className="text-lg font-semibold">
              검색 결과 ({products.length}개)
            </h2>
            {selectedProduct && (
              <button
                className="text-sm text-gray-600 hover:text-gray-800"
                onClick={() => setSelectedProduct(null)}
              >
                선택 초기화
              </button>
            )}
          </div>

          {/* 커스텀 그리드 레이아웃 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-2 bg-white rounded-lg shadow-sm">
            {products.map((product) => (
              <SimpleProductCard
                key={product.productCode}
                product={product}
                onClick={handleProductSelect}
                isSelected={
                  selectedProduct?.productCode === product.productCode
                }
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NaverMap;
