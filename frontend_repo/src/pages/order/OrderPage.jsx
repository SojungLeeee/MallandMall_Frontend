import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  sendOrderConfirm,
  fetchDeleteCartItems,
} from "../../api/httpOrderService";
import { fetchDeleteCoupon } from "../../api/httpCouponService";
import axios from "axios"; // 필요한 경우 추가

const OrderPage = () => {
  const { state } = useLocation();
  const [selectedCoupon, setSelectedCoupon] = useState(null); // 선택된 쿠폰 상태
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [naverMapLoaded, setNaverMapLoaded] = useState(false);
  const [formData, setFormData] = useState({
    receiverName: "",
    post: "",
    addr1: "",
    addr2: "",
    phoneNumber: "",
    memo: "",
    latitude: null,
    longitude: null,
  });
  const [productInfo, setProductInfo] = useState(null); // 하나의 품목 정보
  const [cartItems, setCartItems] = useState([]); // 여러 품목 장바구니 아이템
  const [isFromCart, setIsFromCart] = useState(false); // 장바구니에서 왔는지 확인하는 상태

  // 지점 관련 상태 변수 추가
  const [defaultBranch, setDefaultBranch] = useState("이마트 연제점");
  const [nearestBranch, setNearestBranch] = useState(null);
  const [alternativeBranch, setAlternativeBranch] = useState(null); // 대체 지점 (재고 있는)
  const [hasAlternativeBranch, setHasAlternativeBranch] = useState(false); // 대체 지점 존재 여부
  const [useAlternativeBranch, setUseAlternativeBranch] = useState(false); // 대체 지점 사용 여부
  const [isProcessing, setIsProcessing] = useState(false);

  // 네이버 맵 스크립트 로드 (NaverMap 컴포넌트와 동일한 방식)
  useEffect(() => {
    // 이미 로드되었는지 확인
    if (document.getElementById("naver-map-script")) {
      // 이미 로드된 경우, API가 사용 가능한지 확인
      if (window.naver && window.naver.maps) {
        setNaverMapLoaded(true);
      } else {
        // API 객체를 기다림
        const checkNaverApi = setInterval(() => {
          if (window.naver && window.naver.maps) {
            setNaverMapLoaded(true);
            clearInterval(checkNaverApi);
          }
        }, 500);

        // 30초 후 시간 초과 처리
        setTimeout(() => {
          clearInterval(checkNaverApi);
        }, 30000);
      }
      return;
    }

    // 스크립트 로드
    const script = document.createElement("script");
    script.id = "naver-map-script";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.REACT_APP_NAVER_CLIENT_ID}&submodules=geocoder`;
    script.async = true;

    script.onload = () => {
      console.log("네이버 지도 API 로드 완료");
      // API가 완전히 로드될 때까지 기다림
      const checkNaverApi = setInterval(() => {
        if (window.naver && window.naver.maps) {
          setNaverMapLoaded(true);
          clearInterval(checkNaverApi);
        }
      }, 500);

      // 10초 후 시간 초과 처리
      setTimeout(() => {
        clearInterval(checkNaverApi);
      }, 10000);
    };

    script.onerror = (error) => {
      console.error("네이버 지도 스크립트 로드 실패:", error);
    };

    document.body.appendChild(script);
  }, []);

  // 지오코딩을 수행하는 함수
  const getCoordinatesFromAddress = () => {
    // 주소가 모두 입력되었는지 확인
    if (!formData.addr1 || !formData.addr2) {
      return;
    }

    // 네이버 맵 API가 로드되지 않은 경우
    if (!naverMapLoaded || !window.naver || !window.naver.maps) {
      console.log("네이버 지도 API가 아직 로드되지 않았습니다.");
      return;
    }

    try {
      const fullAddress = `${formData.addr1} ${formData.addr2}`;
      console.log("지오코딩 시도:", fullAddress);

      // window.naver 사용
      window.naver.maps.Service.geocode(
        {
          query: fullAddress,
        },
        function (status, response) {
          if (status !== window.naver.maps.Service.Status.OK) {
            console.error("지오코딩 에러:", status);
            return;
          }

          if (!response || !response.v2 || response.v2.meta.totalCount === 0) {
            console.error("검색 결과가 없습니다.");
            return;
          }

          const item = response.v2.addresses[0];
          const point = {
            latitude: parseFloat(item.y),
            longitude: parseFloat(item.x),
          };

          console.log("좌표 정보:", point);
          setCoordinates(point);

          setFormData((prev) => ({
            ...prev,
            latitude: point.latitude,
            longitude: point.longitude,
          }));

          // 좌표가 확인되면 재고 확인과 함께 가장 가까운 지점 찾기
          findNearestBranchWithStock(point.latitude, point.longitude);
        }
      );
    } catch (error) {
      console.error("지오코딩 처리 중 오류 발생:", error);
    }
  };

  // 가장 가까운 매장 찾기 함수 (재고 확인 포함)
  const findNearestBranchWithStock = async (latitude, longitude) => {
    if (!latitude || !longitude) {
      return;
    }

    setIsProcessing(true);

    try {
      // 상품 코드 배열 준비
      const productCodes = isFromCart
        ? cartItems.map((item) => item.productCode)
        : productInfo
        ? [productInfo.productCode]
        : [];

      if (productCodes.length === 0) {
        console.error("상품 정보가 없습니다.");
        return;
      }

      // 가장 가까운 매장과 재고 정보 요청
      const response = await axios.post(
        "http://localhost:8090/emart/admin/branch/nearestWithStock",
        {
          latitude: latitude,
          longitude: longitude,
          productCodes: productCodes,
          limit: 5, // 상위 5개 지점 요청
        }
      );

      const branchesWithStock = response.data;
      console.log("근처 매장들과 재고 정보:", branchesWithStock);

      if (branchesWithStock && branchesWithStock.length > 0) {
        // 첫 번째 매장 정보 설정 (가장 가까운 매장)
        const closestBranch = branchesWithStock[0];
        setNearestBranch(closestBranch);

        // 재고 있는 지점이 있다면 다른 지점 목록 저장
        if (closestBranch.hasStock) {
          // 가장 가까운 매장에 재고가 있는 경우
          console.log("가장 가까운 매장에 재고가 있습니다.");
          setHasAlternativeBranch(false);
          setUseAlternativeBranch(false);
        } else {
          // 가장 가까운 매장에 재고가 없는 경우, 재고 있는 다른 지점 찾기
          const otherBranchesWithStock = branchesWithStock.filter(
            (branch) => branch.hasStock
          );

          if (otherBranchesWithStock.length > 0) {
            console.log("재고 있는 다른 매장들:", otherBranchesWithStock);
            // 재고 있는 지점 중 가장 가까운 지점을 추천
            setAlternativeBranch(otherBranchesWithStock[0]);
            setHasAlternativeBranch(true);
            setUseAlternativeBranch(false); // 초기값은 false, 사용자가 선택 가능
          } else {
            console.log("모든 근처 매장에 재고가 없습니다.");
            setHasAlternativeBranch(false);
            setUseAlternativeBranch(false);
          }
        }
      } else {
        // 매장 정보가 없는 경우 기본적인 가까운 매장 정보만 가져오기
        const fallbackResponse = await axios.post(
          "http://localhost:8090/emart/admin/branch/nearest",
          {
            latitude: latitude,
            longitude: longitude,
          }
        );

        setNearestBranch({
          ...fallbackResponse.data,
          hasStock: false,
        });
        setHasAlternativeBranch(false);
        setUseAlternativeBranch(false);
      }
    } catch (error) {
      console.error("매장 및 재고 정보 조회 실패:", error);
      setHasAlternativeBranch(false);
      setUseAlternativeBranch(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // 대체 지점 선택 토글
  const toggleAlternativeBranch = () => {
    setUseAlternativeBranch(!useAlternativeBranch);
  };

  // 좌표가 변경될 때 가장 가까운 매장 찾기
  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      findNearestBranchWithStock(formData.latitude, formData.longitude);
    }
  }, [formData.latitude, formData.longitude]);

  // 주소가 업데이트될 때 좌표 정보도 업데이트
  useEffect(() => {
    if (formData.addr1 && formData.addr2 && naverMapLoaded) {
      getCoordinatesFromAddress();
    }
  }, [formData.addr1, formData.addr2, naverMapLoaded]);

  // API 로드 완료 시 주소가 있으면 좌표 획득
  useEffect(() => {
    if (naverMapLoaded && formData.addr1 && formData.addr2) {
      getCoordinatesFromAddress();
    }
  }, [naverMapLoaded]);

  // handleCouponClick 함수에서 originalPrice를 전달
  const handleCouponClick = () => {
    console.log(originalPrice);
    navigate("/mypage/usecoupon", {
      state: { originalPrice: originalPrice }, // originalPrice를 state로 전달
    });
  };

  const handleAddressCheck = () => {
    const OrderAddress = formData.addr1;
    console.log("OrderAddress:", OrderAddress);
    // 좌표 정보가 있다면 함께 표시
    if (formData.latitude && formData.longitude) {
      console.log("주소 좌표:", formData.latitude, formData.longitude);
    }
    // 매장 정보가 있다면 표시
    if (nearestBranch) {
      console.log(
        "가장 가까운 매장:",
        nearestBranch.branchName,
        nearestBranch.distance.toFixed(2) + "km",
        nearestBranch.hasStock ? "(재고 있음)" : "(재고 없음)"
      );

      if (useAlternativeBranch && alternativeBranch) {
        console.log(
          "대체 배송 매장:",
          alternativeBranch.branchName,
          alternativeBranch.distance.toFixed(2) + "km",
          "(재고 있음)"
        );
      }
    } else {
      console.log("기본 매장:", defaultBranch);
    }
  };

  useEffect(() => {
    if (state && state.selectedCoupon) {
      setSelectedCoupon(state.selectedCoupon); // 쿠폰 정보가 있으면 상태에 저장
    }

    // 장바구니에서 넘어온 경우 처리
    const selectedCartItems = localStorage.getItem("selectedCartItems");
    if (selectedCartItems) {
      setIsFromCart(true);
      setCartItems(JSON.parse(selectedCartItems)); // localStorage에서 불러온 장바구니 아이템 설정
    } else {
      setIsFromCart(false);
    }
  }, [state]);

  useEffect(() => {
    const token = localStorage.getItem("jwtAuthToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    fetchUserProfile(token)
      .then((data) => {
        setProfile(data);
        setFormData((prev) => ({
          ...prev,
          receiverName: data.userName,
          post: data.post,
          addr1: data.addr1,
          addr2: data.addr2,
          phoneNumber: data.phoneNumber,
        }));
      })
      .catch((err) => console.error(err));

    // localStorage에서 상품 정보 불러오기
    const storedProductInfo = localStorage.getItem("productInfo");
    if (storedProductInfo) {
      setProductInfo(JSON.parse(storedProductInfo)); // 하나의 품목 정보 불러오기
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDefaultToggle = () => {
    if (!profile) return;
    setFormData({
      receiverName: profile.userName,
      post: profile.post,
      addr1: profile.addr1,
      addr2: profile.addr2,
      phoneNumber: profile.phoneNumber,
      memo: "",
      latitude: null, // 초기화
      longitude: null, // 초기화
    });
  };

  const handleClear = () => {
    setFormData({
      receiverName: "",
      post: "",
      addr1: "",
      addr2: "",
      phoneNumber: "",
      memo: "",
      latitude: null, // 초기화
      longitude: null, // 초기화
    });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({
          ...prev,
          post: data.zonecode,
          addr1: data.roadAddress || data.jibunAddress,
          // 주소가 변경되면 좌표 정보 초기화
          latitude: null,
          longitude: null,
        }));
      },
    }).open();
  };

  // 할인 금액 계산
  const getDiscountedPrice = (price, benefit) => {
    if (!benefit) return price;

    const discountPercent =
      typeof benefit === "string" && benefit.includes("%")
        ? parseInt(benefit.replace("%", ""), 10)
        : benefit;

    const discountAmount = (price * discountPercent) / 100;
    return price - discountAmount;
  };

  // 할인 비율 계산
  const getDiscountRate = (benefit) => {
    if (!benefit) return 0; // 할인 혜택이 없다면 0 반환

    const discountPercent =
      typeof benefit === "string" && benefit.includes("%")
        ? parseInt(benefit.replace("%", ""), 10) // "%""이 포함된 문자열에서 숫자만 추출
        : benefit; // 숫자 형태의 benefit이 오면 그대로 사용

    return discountPercent; // 할인 비율을 반환
  };

  // cartItems와 productInfo의 가격 계산
  const originalPrice = isFromCart
    ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : productInfo && productInfo.price
    ? productInfo.price
    : 0;

  const discountedPrice = selectedCoupon
    ? getDiscountedPrice(originalPrice, selectedCoupon.benefits)
    : originalPrice;

  const discountRate = selectedCoupon
    ? getDiscountRate(selectedCoupon.benefits)
    : 0;

  // 결제 처리 함수
  const handlePayment = (pgProvider) => {
    // 필수 입력값 체크
    if (
      !formData.receiverName ||
      !formData.post ||
      !formData.addr1 ||
      !formData.addr2 ||
      !formData.phoneNumber
    ) {
      alert("모든 기본 정보를 입력해주세요.");
      return; // 빈 값이 있으면 결제 처리 중단
    }

    const { IMP } = window;
    IMP.init("imp42828803");

    // 결제 요청을 위한 금액 계산
    const totalAmount = discountedPrice;

    // 결제 상품 이름 설정
    const productName = isFromCart
      ? `${cartItems[0].productName} 외 ${cartItems.length - 1}개`
      : productInfo.productName;

    IMP.request_pay(
      {
        pg: pgProvider,
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`,
        name: productName,
        amount: totalAmount, // 총 결제 금액
        buyer_email: profile.email,
        buyer_name: formData.receiverName,
        buyer_tel: formData.phoneNumber,
        buyer_addr: formData.addr1 + " " + formData.addr2,
        buyer_postcode: formData.post,
        m_redirect_url: "http://localhost:3000/order/complete",
      },
      (rsp) => {
        if (rsp.success) {
          const token = localStorage.getItem("jwtAuthToken");

          // 매장 정보: 대체 지점 사용 여부에 따라 결정
          const branchName =
            useAlternativeBranch && alternativeBranch
              ? alternativeBranch.branchName
              : nearestBranch
              ? nearestBranch.branchName
              : defaultBranch;

          // 재고 정보
          const hasStock = useAlternativeBranch
            ? true // 대체 지점을 사용하면 재고 있음
            : nearestBranch
            ? nearestBranch.hasStock
            : false;

          // 장바구니 다수 상품 결제
          if (isFromCart) {
            const multiProductData = {
              ...formData,
              userId: profile.userId,
              impUid: rsp.imp_uid,
              orders: cartItems.map((item) => ({
                productCode: item.productCode,
                quantity: item.quantity,
              })),
              discountedPrice: discountRate,
              branchName: branchName, // 지점 정보 추가
              hasStock: hasStock, // 재고 상태 추가
              isAlternativeBranch: useAlternativeBranch, // 대체 지점 사용 여부
            };

            console.log("전송 데이터:", multiProductData);

            sendOrderConfirm(multiProductData, token)
              .then(() => {
                if (window.innerWidth > 768) {
                  navigate(`/order/complete?imp_uid=${rsp.imp_uid}`, {
                    state: {
                      selectedCoupon,
                      branchName: branchName, // 지점 정보 추가
                      distance: useAlternativeBranch
                        ? alternativeBranch?.distance
                        : nearestBranch?.distance, // 거리 정보 추가
                      hasStock: hasStock,
                      isAlternativeBranch: useAlternativeBranch,
                    },
                  });
                }
                // 장바구니에서 해당 품목들을 삭제
                const cartIdsToDelete = cartItems.map((item) => item.cartId); // cartId 목록 생성
                console.log(cartIdsToDelete);
                fetchDeleteCartItems(cartIdsToDelete);

                // 결제 후 localStorage 초기화
                localStorage.removeItem("selectedCartItems");

                // 결제 성공 후 쿠폰 삭제
                if (selectedCoupon) {
                  const couponId = selectedCoupon.couponId; // selectedCoupon에서 couponId 가져오기
                  fetchDeleteCoupon(couponId)
                    .then(() => {
                      console.log(`쿠폰 ${couponId} 삭제 완료`);
                    })
                    .catch(() => alert("쿠폰 삭제 실패"));
                }
              })
              .catch((err) => {
                console.error("주문 처리 중 오류:", err);
                alert("장바구니 주문 처리 중 오류가 발생했습니다.");
              });
          } else {
            // 단일 상품 결제
            const singleProductData = {
              ...formData, // 여기에 latitude, longitude 포함
              userId: profile.userId,
              productCode: productInfo.productCode,
              quantity: 1,
              impUid: rsp.imp_uid,
              branchName: branchName, // 지점 정보 추가
              hasStock: hasStock, // 재고 상태 추가
              isAlternativeBranch: useAlternativeBranch, // 대체 지점 사용 여부
            };

            console.log("전송 데이터:", singleProductData);

            sendOrderConfirm(singleProductData, token)
              .then(() => {
                if (window.innerWidth > 768) {
                  navigate(`/order/complete?imp_uid=${rsp.imp_uid}`, {
                    state: {
                      selectedCoupon,
                      branchName: branchName, // 지점 정보 추가
                      distance: useAlternativeBranch
                        ? alternativeBranch?.distance
                        : nearestBranch?.distance, // 거리 정보 추가
                      hasStock: hasStock,
                      isAlternativeBranch: useAlternativeBranch,
                    },
                  });
                }

                // 결제 후 localStorage 초기화
                localStorage.removeItem("productInfo");

                // 결제 성공 후 쿠폰 삭제
                if (selectedCoupon) {
                  const couponId = selectedCoupon.couponId; // selectedCoupon에서 couponId 가져오기
                  fetchDeleteCoupon(couponId)
                    .then(() => {
                      console.log(`쿠폰 ${couponId} 삭제 완료`);
                    })
                    .catch(() => alert("쿠폰 삭제 실패"));
                }
              })
              .catch((err) => {
                console.error("주문 처리 중 오류:", err);
                alert("주문 처리 중 오류가 발생했습니다.");
              });
          }
        } else {
          alert("결제 실패: " + rsp.error_msg);
        }
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">주문 상품 정보</h2>{" "}
        <button
          onClick={() => navigate(`/product/${productInfo?.productCode}`)}
          className="text-3xl text-gray-500 hover:text-gray-700"
        >
          &#8592; {/* ← 돌아가기 화살표 */}
        </button>
      </div>
      {/* 상품 이미지와 이름 표시 */}
      {isFromCart ? (
        cartItems.map((item, index) => (
          <div className="my-4" key={index}>
            <div className="flex items-center justify-between mb-4">
              <img
                src={item.image}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <h3>{item.productName}</h3>
                <p>
                  {item.price.toLocaleString()}원 * {item.quantity}개
                </p>
              </div>
            </div>
          </div>
        ))
      ) : productInfo ? (
        <div className="my-4">
          <div className="flex items-center justify-between mb-4">
            <img
              src={productInfo.image}
              alt={productInfo.productName}
              className="w-20 h-20 object-cover rounded-md mr-4"
            />
            <div className="flex-1">
              <h3>{productInfo.productName}</h3>
              <p>{productInfo.price.toLocaleString()}원</p>
            </div>
          </div>
        </div>
      ) : (
        <p>상품 정보가 없습니다.</p>
      )}
      <button
        onClick={handleCouponClick}
        className="w-full px-4 py-2 rounded-md bg-gray-500 text-white mb-3"
      >
        쿠폰 사용
      </button>
      <br />
      <hr></hr>
      {/* 선택된 쿠폰이 있다면 */}
      {selectedCoupon && (
        <div className="mt-4 mb-4 flex items-center justify-between">
          <p className="mr-2">
            <span className="font-bold text-sm">적용쿠폰 : </span>
            <span className="text-sm">{selectedCoupon.couponName}</span> -{" "}
            <span className="text-sm">{selectedCoupon.benefits}</span>
          </p>
          <span className="mx-2 text-gray-500">|</span> {/* 구분선 추가 */}
          <button
            onClick={() => setSelectedCoupon(null)} // 쿠폰 제거
            className="text-red-500 font-extrabold text-xl cursor-pointer"
          >
            &#10005; {/* X 버튼 */}
          </button>
        </div>
      )}
      <hr />

      <div className="flex items-center justify-between mb-">
        <h2 className="text-xl font-bold mt-3 mb-3">기본 배송지</h2>{" "}
      </div>
      {profile ? (
        <div className="bg-gray-100 p-4 rounded mb-6 text-left">
          <p className="mb-1">
            <strong>이름:</strong> {profile.userName}
          </p>
          <p className="mb-1">
            <strong>주소:</strong> {profile.addr1} {profile.addr2}
          </p>
          <p className="mb-1">
            <strong>우편번호:</strong> {profile.post}
          </p>
          <p className="mb-1">
            <strong>연락처:</strong> {profile.phoneNumber}
          </p>
        </div>
      ) : (
        <p>배송지 정보를 불러오는 중...</p>
      )}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleDefaultToggle}
          className="px-4 py-2 bg-blue-500
           text-white rounded"
        >
          기본 배송지 사용
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          직접 입력
        </button>
      </div>
      <div className="grid gap-4">
        <input
          name="receiverName"
          placeholder="수령인 이름"
          value={formData.receiverName}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <div className="flex gap-2">
          <input
            name="post"
            placeholder="우편번호"
            value={formData.post}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddressSearch}
            className="px-4 bg-gray-200 rounded"
          >
            주소검색
          </button>
        </div>
        <input
          name="addr1"
          placeholder="주소"
          value={formData.addr1}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="addr2"
          placeholder="상세주소"
          value={formData.addr2}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="phoneNumber"
          placeholder="연락처"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="memo"
          placeholder="배송 메모"
          value={formData.memo}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* 좌표 정보 표시 (선택적, 개발 중에만 사용) */}
        {coordinates && (
          <div className="text-xs text-gray-500">
            좌표: {coordinates.latitude}, {coordinates.longitude}
          </div>
        )}
      </div>
      <br />
      <hr />
      <button
        onClick={handleAddressCheck} // "주소 확인" 버튼 클릭 시 실행되는 함수
        className="w-full px-4 py-2 bg-gray-500 text-white rounded"
      >
        주소 확인
      </button>

      {/* 처리 중 표시 */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-center mt-4">
              처리 중입니다. 잠시만 기다려주세요.
            </p>
          </div>
        </div>
      )}

      {/* 가장 가까운 매장 정보 표시 */}
      {nearestBranch && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg mb-4">
          <h3 className="font-medium text-blue-800 text-center mb-2">
            배송지 주변 매장
          </h3>
          <div className="flex flex-col items-center mt-2">
            <p className="font-bold text-lg text-center">
              {nearestBranch.branchName}
            </p>
            <p className="text-sm text-gray-600 text-center mt-1">
              {nearestBranch.branchAddress}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              거리: 약 {nearestBranch.distance.toFixed(1)}km
            </p>

            {/* 재고 없음 표시 */}
            {nearestBranch.hasStock === false && (
              <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-md w-full">
                <p className="text-sm text-red-700 text-center">
                  ⚠️ 이 지점에는 일부 상품의 재고가 없습니다.
                </p>
              </div>
            )}

            {/* 대체 지점 추천 */}
            {hasAlternativeBranch && alternativeBranch && (
              <div className="mt-3 border-t border-blue-200 pt-3 w-full">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-800">
                    재고 있는 다른 지점:
                  </p>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useAlternativeBranch"
                      checked={useAlternativeBranch}
                      onChange={toggleAlternativeBranch}
                      className="mr-2 h-4 w-4"
                    />
                    <label
                      htmlFor="useAlternativeBranch"
                      className="text-sm cursor-pointer"
                    >
                      이 지점에서 배송 받기
                    </label>
                  </div>
                </div>

                <div
                  className={`mt-2 p-3 rounded-md ${
                    useAlternativeBranch
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50"
                  }`}
                >
                  <p className="font-medium">
                    {alternativeBranch.branchName}
                    <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      재고 있음
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {alternativeBranch.branchAddress}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    거리: 약 {alternativeBranch.distance.toFixed(1)}km (현재
                    위치에서
                    {(
                      alternativeBranch.distance - nearestBranch.distance
                    ).toFixed(1)}
                    km 더 멈)
                  </p>
                  {useAlternativeBranch && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      ✅ 해당 지점에서 주문 상품을 배송합니다
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 전체 결제 금액 */}
      <div className="my-6 text-right">
        <h3 className="text-lg font-bold">총 결제 금액</h3>
        {selectedCoupon ? (
          <>
            <p className="line-through">{originalPrice.toLocaleString()}원</p>
            <p className="text-xl font-semibold text-red-500">
              {discountedPrice.toLocaleString()}원
            </p>
          </>
        ) : (
          <p className="text-xl font-semibold">
            {originalPrice.toLocaleString()}원
          </p>
        )}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => handlePayment("kakaopay.TC0ONETIME")}
          className="w-full py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500"
        >
          카카오페이 결제
        </button>
        <button
          onClick={() => handlePayment("tosspay.tosstest")}
          className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
        >
          토스페이 결제
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
