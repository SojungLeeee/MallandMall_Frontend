import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  sendOrderConfirm,
  fetchDeleteCartItems,
} from "../../api/httpOrderService";
import { fetchDeleteCoupon } from "../../api/httpCouponService";

const OrderPage = () => {
  const { state } = useLocation(); // state로 전달된 정보 받기
  const [selectedCoupon, setSelectedCoupon] = useState(null); // 선택된 쿠폰 상태
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    receiverName: "",
    post: "",
    addr1: "",
    addr2: "",
    phoneNumber: "",
    memo: "",
  });
  const [productInfo, setProductInfo] = useState(null); // 하나의 품목 정보
  const [cartItems, setCartItems] = useState([]); // 여러 품목 장바구니 아이템
  const [isFromCart, setIsFromCart] = useState(false); // 장바구니에서 왔는지 확인하는 상태

  // handleCouponClick 함수에서 originalPrice를 전달
  const handleCouponClick = () => {
    console.log(originalPrice);
    navigate("/mypage/usecoupon", {
      state: { originalPrice: originalPrice }, // originalPrice를 state로 전달
    });
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
    });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({
          ...prev,
          post: data.zonecode,
          addr1: data.roadAddress || data.jibunAddress,
        }));
      },
    }).open();
  };

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
            };

            sendOrderConfirm(multiProductData, token)
              .then(() => {
                if (window.innerWidth > 768) {
                  navigate(`/order/complete?imp_uid=${rsp.imp_uid}`, {
                    state: { selectedCoupon }, // 쿠폰 정보 추가
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

              .catch(() => alert("장바구니 주문 처리 중 오류 발생"));
          } else {
            // 단일 상품 결제
            const singleProductData = {
              ...formData,
              userId: profile.userId,
              productCode: productInfo.productCode,
              quantity: 1,
              impUid: rsp.imp_uid,
            };

            sendOrderConfirm(singleProductData, token)
              .then(() => {
                if (window.innerWidth > 768) {
                  navigate(`/order/complete?imp_uid=${rsp.imp_uid}`, {
                    state: { selectedCoupon }, // 쿠폰 정보 추가
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
              .catch(() => alert("주문 처리 중 오류 발생"));
          }
        } else {
          alert("결제 실패: " + rsp.error_msg);
        }
      }
    );
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">주문 상품 정보</h2>{" "}
        {/* 기본 배송지 텍스트 왼쪽에 배치 */}
        <button
          onClick={() => navigate(`/product/${productInfo.productCode}`)}
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
          className="px-4 py-2 bg-blue-500 text-white rounded"
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
      </div>
      <br />
      <hr />
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
