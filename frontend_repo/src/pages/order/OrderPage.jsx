import React, { useEffect, useState } from "react";

import { consumeGoods } from "../../api/httpProductService";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  sendOrderConfirm,
  fetchDeleteCartItems,
} from "../../api/httpOrderService";
import { fetchDeleteCoupon } from "../../api/httpCouponService";
import axios from "axios";
import tossPayLogo from "../../assets/images/logo/tossPayLogo.png";

const OrderPage = () => {
  const { state } = useLocation();
  const [selectedCoupon, setSelectedCoupon] = useState(null);
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
  const [productInfo, setProductInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isFromCart, setIsFromCart] = useState(false);

  // 지점 관련 상태 변수
  const [defaultBranch, setDefaultBranch] = useState("이마트 연제점");
  const [nearestBranch, setNearestBranch] = useState(null);
  const [alternativeBranch, setAlternativeBranch] = useState(null);
  const [hasAlternativeBranch, setHasAlternativeBranch] = useState(false);
  const [useAlternativeBranch, setUseAlternativeBranch] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 네이버 맵 스크립트 로드
  useEffect(() => {
    if (document.getElementById("naver-map-script")) {
      if (window.naver && window.naver.maps) {
        setNaverMapLoaded(true);
      } else {
        const checkNaverApi = setInterval(() => {
          if (window.naver && window.naver.maps) {
            setNaverMapLoaded(true);
            clearInterval(checkNaverApi);
          }
        }, 500);

        setTimeout(() => {
          clearInterval(checkNaverApi);
        }, 30000);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "naver-map-script";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.REACT_APP_NAVER_CLIENT_ID}&submodules=geocoder`;
    script.async = true;

    script.onload = () => {
      console.log("네이버 지도 API 로드 완료");
      const checkNaverApi = setInterval(() => {
        if (window.naver && window.naver.maps) {
          setNaverMapLoaded(true);
          clearInterval(checkNaverApi);
        }
      }, 500);

      setTimeout(() => {
        clearInterval(checkNaverApi);
      }, 10000);
    };

    script.onerror = (error) => {
      console.error("네이버 지도 스크립트 로드 실패:", error);
    };

    document.body.appendChild(script);
  }, []);

  // 지오코딩 함수
  const getCoordinatesFromAddress = () => {
    if (!formData.addr1) return;

    if (!naverMapLoaded || !window.naver || !window.naver.maps) {
      console.log("네이버 지도 API가 아직 로드되지 않았습니다.");
      return;
    }

    try {
      const fullAddress = `${formData.addr1}`;
      console.log("지오코딩 시도:", fullAddress);

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

          findNearestBranchWithStock(point.latitude, point.longitude);
        }
      );
    } catch (error) {
      console.error("지오코딩 처리 중 오류 발생:", error);
    }
  };

  // 가장 가까운 매장 찾기 함수
  const findNearestBranchWithStock = async (latitude, longitude) => {
    if (!latitude || !longitude) return;

    setIsProcessing(true);

    try {
      const productCodes = isFromCart
        ? cartItems.map((item) => item.productCode)
        : productInfo
        ? [productInfo.productCode]
        : [];

      if (productCodes.length === 0) {
        console.error("상품 정보가 없습니다.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8090/emart/admin/branch/nearestWithStock",
        {
          latitude: latitude,
          longitude: longitude,
          productCodes: productCodes,
          limit: 5,
        }
      );

      const branchesWithStock = response.data;
      console.log("근처 매장들과 재고 정보:", branchesWithStock);

      if (branchesWithStock && branchesWithStock.length > 0) {
        const closestBranch = branchesWithStock[0];
        setNearestBranch(closestBranch);

        if (closestBranch.hasStock) {
          console.log("가장 가까운 매장에 재고가 있습니다.");
          setHasAlternativeBranch(false);
          setUseAlternativeBranch(false);
        } else {
          const otherBranchesWithStock = branchesWithStock.filter(
            (branch) => branch.hasStock
          );

          if (otherBranchesWithStock.length > 0) {
            console.log("재고 보유 매장:", otherBranchesWithStock);
            setAlternativeBranch(otherBranchesWithStock[0]);
            setHasAlternativeBranch(true);
            setUseAlternativeBranch(false);
          } else {
            console.log("모든 근처 매장에 재고가 없습니다.");
            setHasAlternativeBranch(false);
            setUseAlternativeBranch(false);
          }
        }
      } else {
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

  // useEffect 설정
  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      findNearestBranchWithStock(formData.latitude, formData.longitude);
    }
  }, [formData.latitude, formData.longitude]);

  useEffect(() => {
    if (formData.addr1 && naverMapLoaded) {
      getCoordinatesFromAddress();
    }
  }, [formData.addr1, naverMapLoaded]);

  useEffect(() => {
    if (naverMapLoaded && formData.addr1) {
      getCoordinatesFromAddress();
    }
  }, [naverMapLoaded]);

  // 쿠폰 사용 처리
  const handleCouponClick = () => {
    navigate("/mypage/usecoupon", {
      state: { originalPrice: originalPrice },
    });
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (state && state.selectedCoupon) {
      setSelectedCoupon(state.selectedCoupon);
    }

    const selectedCartItems = localStorage.getItem("selectedCartItems");
    if (selectedCartItems) {
      setIsFromCart(true);
      setCartItems(JSON.parse(selectedCartItems));
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

    const storedProductInfo = localStorage.getItem("productInfo");
    if (storedProductInfo) {
      setProductInfo(JSON.parse(storedProductInfo));
    }
  }, [navigate]);

  // 폼 입력 처리
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
      latitude: null,
      longitude: null,
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
      latitude: null,
      longitude: null,
    });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({
          ...prev,
          post: data.zonecode,
          addr1: data.roadAddress || data.jibunAddress,
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
    if (!benefit) return 0;

    const discountPercent =
      typeof benefit === "string" && benefit.includes("%")
        ? parseInt(benefit.replace("%", ""), 10)
        : benefit;

    return discountPercent;
  };

  // 가격 계산
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
    if (
      !formData.receiverName ||
      !formData.post ||
      !formData.addr1 ||
      !formData.addr2 ||
      !formData.phoneNumber
    ) {
      alert("모든 기본 정보를 입력해주세요.");
      return;
    }

    const { IMP } = window;
    IMP.init("imp42828803");

    const totalAmount = discountedPrice;

    const productName = isFromCart
      ? `${cartItems[0].productName} 외 ${cartItems.length - 1}개`
      : productInfo.productName;

    IMP.request_pay(
      {
        pg: pgProvider,
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`,
        name: productName,
        amount: totalAmount,
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

          const branchName =
            useAlternativeBranch && alternativeBranch
              ? alternativeBranch.branchName
              : nearestBranch
              ? nearestBranch.branchName
              : defaultBranch;

          const hasStock = useAlternativeBranch
            ? true
            : nearestBranch
            ? nearestBranch.hasStock
            : false;

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
              branchName: branchName,
              hasStock: hasStock,
              isAlternativeBranch: useAlternativeBranch,
            };

            // 🟡 consumeGoods를 cartItems 각각에 대해 호출
            (async () => {
              try {
                for (const item of cartItems) {
                  await consumeGoods({
                    productCode: item.productCode,
                    branchName: branchName,
                    quantity: item.quantity,
                  });
                }
                console.log("장바구니 모든 상품 차감 완료");
              } catch (error) {
                console.error("장바구니 상품 차감 중 오류:", error);
              }
            })();

            console.log("전송 데이터:", multiProductData);

            sendOrderConfirm(multiProductData, token)
              .then(() => {
                if (window.innerWidth > 768) {
                  navigate(`/order/complete?imp_uid=${rsp.imp_uid}`, {
                    state: {
                      selectedCoupon,
                      branchName: branchName,
                      distance: useAlternativeBranch
                        ? alternativeBranch?.distance
                        : nearestBranch?.distance,
                      hasStock: hasStock,
                      isAlternativeBranch: useAlternativeBranch,
                    },
                  });
                }

                const cartIdsToDelete = cartItems.map((item) => item.cartId);
                console.log(cartIdsToDelete);
                fetchDeleteCartItems(cartIdsToDelete);

                localStorage.removeItem("selectedCartItems");

                if (selectedCoupon) {
                  const couponId = selectedCoupon.couponId;
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
            const singleProductData = {
              ...formData,
              userId: profile.userId,
              productCode: productInfo.productCode,
              quantity: 1,
              impUid: rsp.imp_uid,
              branchName: branchName,
              hasStock: hasStock,
              isAlternativeBranch: useAlternativeBranch,
            };

            console.log("전송 데이터:", singleProductData);

            // 🟡 여기서 consumeGoods 호출
            (async () => {
              try {
                await consumeGoods({
                  productCode: singleProductData.productCode,
                  branchName: singleProductData.branchName,
                  quantity: 1,
                });
                console.log("상품 차감 완료");
              } catch (error) {
                console.error("상품 차감 실패:", error);
              }
            })();

            sendOrderConfirm(singleProductData, token)
              .then(() => {
                if (window.innerWidth > 768) {
                  navigate(`/order/complete?imp_uid=${rsp.imp_uid}`, {
                    state: {
                      selectedCoupon,
                      branchName: branchName,
                      distance: useAlternativeBranch
                        ? alternativeBranch?.distance
                        : nearestBranch?.distance,
                      hasStock: hasStock,
                      isAlternativeBranch: useAlternativeBranch,
                    },
                  });
                }

                localStorage.removeItem("productInfo");

                if (selectedCoupon) {
                  const couponId = selectedCoupon.couponId;
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
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-100">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-black">주문 상품 정보</h2>
        <button
          onClick={() => navigate(`/product/${productInfo?.productCode}`)}
          className="text-3xl text-black hover:text-gray-700 transition-colors"
        >
          &#8592;
        </button>
      </div>

      {/* 상품 정보 */}
      {isFromCart ? (
        cartItems.map((item, index) => (
          <div className="my-4" key={index}>
            <div className="flex items-center bg-gray-50 p-4 rounded-lg">
              <img
                src={item.image}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-md mr-4 border border-gray-200"
              />
              <div className="flex-1">
                <h3 className="font-medium text-lg">{item.productName}</h3>
                <p className="text-gray-700 mt-1">
                  {item.price.toLocaleString()}원 * {item.quantity}개
                </p>
              </div>
            </div>
          </div>
        ))
      ) : productInfo ? (
        <div className="my-6">
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <img
              src={productInfo.image}
              alt={productInfo.productName}
              className="w-20 h-20 object-cover rounded-md mr-4 border border-gray-200"
            />
            <div className="flex-1">
              <h3 className="font-medium text-lg">{productInfo.productName}</h3>
              <p className="text-gray-700 mt-1">
                {productInfo.price?.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>상품 정보가 없습니다.</p>
      )}

      {/* 쿠폰 영역 */}
      <button
        onClick={handleCouponClick}
        className="w-full px-4 py-3 rounded-md bg-black text-white font-medium mb-5 hover:bg-gray-800 transition-colors"
      >
        쿠폰 사용
      </button>

      <div className="border-t border-b border-gray-200 py-4 my-4">
        {selectedCoupon && (
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-sm">적용쿠폰: </span>
              <span className="text-sm">{selectedCoupon.couponName}</span> -
              <span className="text-sm text-red-500 ml-1">
                {selectedCoupon.benefits}
              </span>
            </div>
            <button
              onClick={() => setSelectedCoupon(null)}
              className="text-black font-bold text-xl hover:text-red-500 transition-colors"
            >
              &#10005;
            </button>
          </div>
        )}
      </div>

      {/* 배송지 정보 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-black mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 21C12 21 19 16.5 19 10.5C19 6.5 15.866 3 12 3C8.13401 3 5 6.5 5 10.5C5 16.5 12 21 12 21Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          기본 배송지
        </h2>

        {profile ? (
          <div className="bg-white p-6 rounded-lg mb-6 text-left border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div className="font-semibold text-gray-700 text-left">이름</div>
              <div className="text-black">{profile.userName}</div>

              <div className="font-semibold text-gray-700 text-left">주소</div>
              <div className="text-black">
                {profile.addr1} {profile.addr2}
              </div>

              <div className="font-semibold text-gray-700 text-left">
                우편번호
              </div>
              <div className="text-black">{profile.post}</div>

              <div className="font-semibold text-gray-700 text-left">
                연락처
              </div>
              <div className="text-black">{profile.phoneNumber}</div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg mb-6 text-center border border-gray-200 shadow-sm">
            <svg
              className="animate-spin h-5 w-5 text-gray-400 mx-auto mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-500">배송지 정보를 불러오는 중...</p>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleDefaultToggle}
            className="px-5 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors flex-1"
          >
            기본 배송지
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-3 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors flex-1"
          >
            직접 입력
          </button>
        </div>

        {/* 배송지 입력 폼 */}
        <div className="grid gap-4">
          <input
            name="receiverName"
            placeholder="수령인 이름"
            value={formData.receiverName}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <div className="flex gap-2">
            <input
              name="post"
              placeholder="우편번호"
              value={formData.post}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black w-full"
            />
            <button
              onClick={handleAddressSearch}
              className="px-4 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              주소검색
            </button>
          </div>
          <input
            name="addr1"
            placeholder="주소"
            value={formData.addr1}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            name="addr2"
            placeholder="상세주소"
            value={formData.addr2}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            name="phoneNumber"
            placeholder="연락처"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <textarea
            name="memo"
            placeholder="배송 메모"
            value={formData.memo}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black h-24"
          />
        </div>
      </div>

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

      {/* 가까운 매장 정보 - 강조된 디자인 */}
      {nearestBranch && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="font-bold text-xl text-black mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                fill="black"
              />
            </svg>
            배송지 주변 매장
          </h3>

          <div className="bg-black text-white p-6 rounded-lg shadow-lg mb-4">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 20V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V20"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-xl">{nearestBranch.branchName}</p>
                <p className="text-gray-300 text-sm">
                  {nearestBranch.branchAddress}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-700 pt-3 mt-3">
              <div className="flex items-center">
                {nearestBranch.hasStock ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-1 text-green-400"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                        fill="currentColor"
                      />
                      <path
                        d="M8 12L11 15L16 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-green-400 font-medium">
                      재고 있음
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-1 text-red-400"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                        fill="currentColor"
                      />
                      <path
                        d="M15 9L9 15"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 9L15 15"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-red-400 font-medium">재고 없음</span>
                  </>
                )}
              </div>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">
                  약 {nearestBranch.distance.toFixed(1)}km
                </span>
              </div>
            </div>
          </div>

          {/* 대체 매장 정보 - 재고가 없을 때만 표시 */}
          {!nearestBranch.hasStock &&
            hasAlternativeBranch &&
            alternativeBranch && (
              <div className="bg-gray-100 p-5 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-lg">재고 매장</h4>
                  <div className="flex items-center ml-8">
                    {" "}
                    {/* 여기에 ml-8 (margin-left) 추가 */}
                    <input
                      type="checkbox"
                      id="useAlternativeBranch"
                      checked={useAlternativeBranch}
                      onChange={toggleAlternativeBranch}
                      className="mr-2 h-4 w-4 cursor-pointer"
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
                  className={`p-4 rounded-lg ${
                    useAlternativeBranch
                      ? "bg-green-50 border border-green-200"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium flex items-center">
                        {alternativeBranch.branchName}
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          재고 있음
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {alternativeBranch.branchAddress}
                      </p>
                    </div>
                    <div className="text-xs bg-black text-white px-3 py-1 rounded-full">
                      {alternativeBranch.distance.toFixed(1)}km
                    </div>
                  </div>

                  {useAlternativeBranch && (
                    <p className="text-xs text-green-600 mt-3 font-medium border-t border-green-100 pt-2">
                      ✅ 해당 지점에서 주문 상품을 배송합니다
                    </p>
                  )}
                </div>
              </div>
            )}
        </div>
      )}

      {/* 결제 정보 */}
      <div className="mt-10 mb-8 text-right border-t border-gray-200 pt-5">
        <h3 className="text-lg font-bold text-black">총 결제 금액</h3>
        {selectedCoupon ? (
          <>
            <p className="line-through text-gray-500">
              {originalPrice.toLocaleString()}원
            </p>
            <p className="text-2xl font-bold text-black">
              {discountedPrice.toLocaleString()}
              <span className="text-sm ml-1">원</span>
            </p>
          </>
        ) : (
          <p className="text-2xl font-bold text-black">
            {originalPrice.toLocaleString()}
            <span className="text-sm ml-1">원</span>
          </p>
        )}
      </div>

      {/* 결제 버튼 */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <button
          onClick={() => handlePayment("kakaopay.TC0ONETIME")}
          className="flex items-center justify-center bg-yellow-400 rounded-md h-12 shadow-md hover:shadow-lg hover:bg-yellow-300 transition-all duration-300 px-4"
        >
          <div className="flex items-center justify-center w-full">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 5.51 2 9.83c0 2.76 1.77 5.19 4.44 6.56-.16.55-.93 3.52-.96 3.83-.04.33.13.33.27.24.11-.07 4.29-2.9 4.96-3.39.42.05.85.08 1.29.08 5.52 0 10-3.51 10-7.83C22 5.51 17.52 2 12 2z"
                fill="#000000"
              />
            </svg>
            <span className="font-bold text-black text-base text-xl">
              kakaopay
            </span>
          </div>
        </button>

        <button
          onClick={() => handlePayment("tosspay.tosstest")}
          className="flex items-center justify-center bg-blue-500 rounded-md h-12 shadow-md hover:shadow-lg hover:bg-blue-400 transition-all duration-300"
        >
          <div className="flex items-center">
            <img src={tossPayLogo} alt="토스페이" className="h-8" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
