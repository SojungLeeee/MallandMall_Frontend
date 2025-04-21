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
        const response = await axios.get("https://morek9.click/admin/branch/all");
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
      const response = await axios.get("https://morek9.click/product/search", {
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
      const response = await axios.get(`https://morek9.click/inventory/product/${productCode}/branches`);
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
            // 개선된 현재 위치 마커 디자인
            const markerContent = document.createElement("div");
            markerContent.innerHTML = `
              <div style="
                position: relative;
                width: 24px;
                height: 24px;
              ">
                <!-- 외부 링 애니메이션 -->
                <div style="
                  position: absolute;
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  background: rgba(28, 100, 242, 0.1);
                  transform: translate(-50%, -50%);
                  left: 50%;
                  top: 50%;
                  animation: pulse-outer 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
                "></div>
                
                <!-- 중간 링 애니메이션 -->
                <div style="
                  position: absolute;
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  background: rgba(28, 100, 242, 0.2);
                  transform: translate(-50%, -50%);
                  left: 50%;
                  top: 50%;
                  animation: pulse-middle 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
                "></div>
                
                <!-- 중심 마커 -->
                <div style="
                  position: absolute;
                  width: 14px;
                  height: 14px;
                  background: #1C64F2;
                  border-radius: 50%;
                  transform: translate(-50%, -50%);
                  left: 50%;
                  top: 50%;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                "></div>
              </div>
              
              <style>
                @keyframes pulse-outer {
                  0% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0.8;
                  }
                  70% {
                    transform: translate(-50%, -50%) scale(1.2);
                    opacity: 0;
                  }
                  100% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0;
                  }
                }
                
                @keyframes pulse-middle {
                  0% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0.6;
                  }
                  50% {
                    transform: translate(-50%, -50%) scale(1.1);
                    opacity: 0.2;
                  }
                  100% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0.6;
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

  // 정확한 위도/경도로 지도 이동 및 확대하는 함수
  const moveAndZoomToLocation = (exactLat, exactLng) => {
    if (!map) return;

    console.log("정확한 위치로 이동:", exactLat, exactLng);

    // 정확한 좌표로 지도 위치 이동
    const targetPoint = new window.naver.maps.LatLng(exactLat, exactLng);

    // 현재 줌 레벨 확인
    const currentZoom = map.getZoom();
    const targetZoom = 16; // 목표 줌 레벨 - 15에서 16으로 더 세밀하게 조정

    // 정확한 좌표로 중심 이동 (애니메이션 효과 적용)
    // setCenter로 정확히 중심 이동
    map.setCenter(targetPoint);

    // 필요한 경우 줌 레벨 조정
    if (currentZoom < targetZoom) {
      setTimeout(() => {
        map.setZoom(targetZoom, {
          animation: window.naver.maps.Animation.EASING,
        });
      }, 100);
    }
  };

  // 브랜치 데이터를 사용하여 마커 생성
  useEffect(() => {
    if (map && branches.length > 0) {
      // 기존 마커 제거
      markers.forEach((marker) => {
        marker.setMap(null);
      });

      const newMarkers = [];

      // 마커 겹침 방지를 위한 변수
      const markerGridSize = 0.0005; // 격자 크기 (위도/경도 단위)
      const occupiedPositions = {}; // 이미 사용된 위치 추적

      branches.forEach((branch) => {
        if (branch.latitude && branch.longitude) {
          // 원래 위치 (정확한 좌표)
          const exactLat = parseFloat(branch.latitude);
          const exactLng = parseFloat(branch.longitude);

          // 위치 키 생성 (격자화된 위치) - 마커 표시용
          let gridLat = Math.round(exactLat / markerGridSize) * markerGridSize;
          let gridLng = Math.round(exactLng / markerGridSize) * markerGridSize;
          let posKey = `${gridLat},${gridLng}`;

          // 이미 사용된 위치라면 근처에서 빈 공간 찾기
          if (occupiedPositions[posKey]) {
            // 나선형 탐색을 위한 방향 배열
            const directions = [
              [0, 1],
              [1, 0],
              [0, -1],
              [-1, 0], // 동, 남, 서, 북
              [1, 1],
              [1, -1],
              [-1, -1],
              [-1, 1], // 대각선 방향
            ];

            // 가장 가까운 빈 위치 찾기
            let found = false;
            for (let distance = 1; distance <= 3 && !found; distance++) {
              for (let dirIndex = 0; dirIndex < directions.length && !found; dirIndex++) {
                const [dy, dx] = directions[dirIndex];
                const newGridLat = gridLat + dy * markerGridSize * distance;
                const newGridLng = gridLng + dx * markerGridSize * distance;
                const newPosKey = `${newGridLat},${newGridLng}`;

                if (!occupiedPositions[newPosKey]) {
                  gridLat = newGridLat;
                  gridLng = newGridLng;
                  posKey = newPosKey;
                  found = true;
                }
              }
            }
          }

          // 위치 점유 표시
          occupiedPositions[posKey] = true;

          // 격자화된 위치로 마커 위치 설정 (겹침 방지)
          const markerPosition = new window.naver.maps.LatLng(gridLat, gridLng);

          // 지점명 우측 4글자만 표시하도록 처리
          const shortBranchName = branch.branchName.length > 4 ? branch.branchName.slice(-4) : branch.branchName;

          // 마커 크기 축소 (글자 4글자가 들어갈 수 있도록 충분한 너비 확보)
          const markerWidth = 90; // 글자가 잘리지 않도록 너비 조정

          // 첫번째 코드에서 가져온 심플한 마커 디자인 (재고 관련 정보 유지)
          const quantity = branchInventory[branch.branchName] || 0;
          const markerColor = quantity > 0 ? "#3B82F6" : "#9CA3AF"; // 파란색 또는 회색
          const shadowColor = quantity > 0 ? "rgba(59, 130, 246, 0.25)" : "rgba(156, 163, 175, 0.25)";

          const markerContent = document.createElement("div");
          markerContent.className = "branch-marker";
          markerContent.innerHTML = `
        <div style="position: relative; width: ${markerWidth}px; text-align: center; transform: translateY(-10px);" data-branch="${
            branch.branchName
          }" data-exact-lat="${exactLat}" data-exact-lng="${exactLng}">
          <div class="marker-bubble" style="
            position: relative;
            background-color: white;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 4px 8px;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0.05);
            opacity: 0.85;
          ">
            <!-- 매장 아이콘 -->
            <div style="
              min-width: 20px;
              height: 20px;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 4px;
              background-color: #f0f9ff;
              color: #0369a1;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            
            <!-- 지점명 및 수량 표시 -->
            <div style="
              text-align: left;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: flex;
              flex-direction: column;
              min-width: 46px; /* 글자가 잘리지 않도록 최소 너비 지정 */
              max-width: 58px; /* 최대 너비 제한 */
            ">
              <div style="
                font-size: 12px;
                font-weight: 600;
                color: #374151;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              ">
                ${shortBranchName}
              </div>
              ${
                selectedProduct
                  ? `
              <div style="
                font-size: 10px;
                color: ${quantity > 0 ? "#3B82F6" : "#9CA3AF"};
                font-weight: ${quantity > 0 ? "600" : "400"};
              ">
                ${quantity}개
              </div>
              `
                  : ""
              }
            </div>
          </div>
          
          <!-- 삼각형 꼬리 -->
          <div style="
            position: absolute;
            left: 50%;
            bottom: -6px;
            transform: translateX(-50%) rotate(45deg);
            width: 8px;
            height: 8px;
            background-color: white;
            border-right: 1px solid rgba(0, 0, 0, 0.05);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.02);
            opacity: 0.85;
          "></div>
        </div>
        
        <style>
          .branch-marker {
            transform-origin: bottom center;
            transition: transform 0.3s ease;
          }
          
          .branch-marker:hover {
            transform: scale(1.15);
            z-index: 999 !important;
          }
          
          .branch-marker:hover .marker-bubble {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            transform: translateY(-3px);
            opacity: 1;
          }
        </style>
      `;

          const marker = new window.naver.maps.Marker({
            position: markerPosition,
            map: map,
            icon: {
              content: markerContent,
              anchor: new window.naver.maps.Point(markerWidth / 2, 10), // 마커 앵커 위치 동적 조정
            },
            zIndex: quantity > 0 ? 100 : 50, // 재고 있는 지점 우선 표시
          });

          // 마커 클릭 이벤트
          window.naver.maps.Event.addListener(marker, "click", () => {
            // 지점 상세 정보 가져오기
            fetchBranchDetail(branch.branchName);

            // 정확한 원본 좌표로 지도 이동 및 확대
            moveAndZoomToLocation(exactLat, exactLng);

            // 선택된 마커를 맨 앞으로 가져오기
            markers.forEach((m) => {
              const element = m.getElement();
              if (element) {
                const markerDiv = element.querySelector(".branch-marker > div");
                if (markerDiv) {
                  const branchName = markerDiv.getAttribute("data-branch");
                  if (branchName === branch.branchName) {
                    m.setZIndex(1000); // 선택된 마커의 z-index를 높임
                    // 선택된 마커는 완전히 불투명하게 만들기
                    const bubbleElement = element.querySelector(".marker-bubble");
                    const tailElement = element.querySelector(".branch-marker > div > div:last-child");
                    if (bubbleElement && tailElement) {
                      bubbleElement.style.opacity = "1";
                      tailElement.style.opacity = "1";
                    }
                  } else {
                    m.setZIndex(50); // 다른 마커는 기본 z-index로 복원
                    // 다른 마커들은 다시 반투명하게
                    const bubbleElement = element.querySelector(".marker-bubble");
                    const tailElement = element.querySelector(".branch-marker > div > div:last-child");
                    if (bubbleElement && tailElement) {
                      bubbleElement.style.opacity = "0.85";
                      tailElement.style.opacity = "0.85";
                    }
                  }
                }
              }
            });
          });

          newMarkers.push(marker);
        }
      });

      setMarkers(newMarkers);
    }
  }, [map, branches, branchInventory, selectedProduct]);

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
          isSelected ? "border-blue-500 ring-2 ring-blue-200" : "hover:scale-105"
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
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">이미지 없음</div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="p-3">
            <div className="text-xs font-semibold text-blue-600 mb-1">{product.category}</div>
            <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{product.productName}</h3>
            <div className="text-sm font-bold text-green-600">{product.price?.toLocaleString() || 0}원</div>

            {/* 평점 표시 (있는 경우) */}
            {product.averageRating > 0 && (
              <div className="flex items-center mt-1">
                <div className="flex mr-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-3 w-3 ${
                        star <= Math.round(product.averageRating) ? "text-yellow-400" : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-500">{product.averageRating.toFixed(1)}</span>
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
      <div className="flex flex-col space-y-1 px-2">
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
              placeholder={searchType === "productName" ? "상품명을 입력하세요" : "카테고리를 입력하세요"}
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
                <h2 className="text-lg font-bold text-gray-900">{selectedProduct.productName}</h2>
                <div className="text-sm text-gray-600 mb-1">카테고리: {selectedProduct.category}</div>
                <div className="font-medium text-green-600">가격: {selectedProduct.price?.toLocaleString() || 0}원</div>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedProduct(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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

        {/* 개선된 GPS 버튼 */}
        {map && !loading && (
          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={toggleGPS}
              className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg focus:outline-none transition-all duration-300 ${
                gpsEnabled ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              title={gpsEnabled ? "GPS 끄기" : "내 위치 찾기"}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.94 11A8 8 0 0 0 12.94 4"></path>
                <path d="M4.06 11a8 8 0 0 1 7-7"></path>
                <path d="M4.06 13a8 8 0 0 0 7 7"></path>
                <path d="M19.94 13a8 8 0 0 1-7 7"></path>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 선택된 지점 정보 */}
      {selectedBranch && (
        <div className="p-5 border border-gray-100 rounded-lg shadow-md bg-white mt-4 overflow-hidden">
          <div className="flex items-start mb-3">
            <div className="bg-black text-white p-3 rounded-md mr-4 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className="flex-1 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedBranch.branchName}</h3>
              <div className="flex items-center justify-center text-gray-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <p>{selectedBranch.branchAddress}</p>

                {/* 주소 저장 버튼 */}
                <button
                  onClick={() => {
                    try {
                      // 클립보드에 주소 복사
                      navigator.clipboard.writeText(selectedBranch.branchAddress);

                      // 알림 표시 (선택적)
                      alert(`"${selectedBranch.branchName}" 주소가 클립보드에 복사되었습니다.`);
                    } catch (err) {
                      console.error("주소 복사 실패:", err);
                      alert("주소 복사에 실패했습니다.");
                    }
                  }}
                  className="ml-2 text-gray-400 hover:text-black transition-colors focus:outline-none"
                  title="주소 복사"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 상품 재고 정보를 함께 표시 */}
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
                    <span className="text-blue-600">{selectedProduct.productName}</span>
                  </p>
                  <p className="text-sm mt-1">
                    재고 수량: <span className="font-bold">{selectedBranch.goodsCount}개</span>
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
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">{productError}</div>
      ) : products.length > 0 ? (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3 px-2">
            <h2 className="text-lg font-semibold">검색 결과 ({products.length}개)</h2>
            {selectedProduct && (
              <button className="text-sm text-gray-600 hover:text-gray-800" onClick={() => setSelectedProduct(null)}>
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
                isSelected={selectedProduct?.productCode === product.productCode}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NaverMap;
