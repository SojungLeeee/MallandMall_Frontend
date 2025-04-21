import React, { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const OrderComplete = () => {
  const { state } = useLocation(); // state로 전달된 정보 받기
  const selectedCoupon = state?.selectedCoupon;
  const { imp_uid: paramImpUid } = useParams(); // PC 환경에서 경로 기반으로 전달받은 imp_uid
  const [searchParams] = useSearchParams(); // 모바일 환경에서 ?imp_uid=... 로 전달된 값
  const [orders, setOrders] = useState([]); // 여러 개의 주문을 저장하는 상태
  const [error, setError] = useState("");

  const impUid = paramImpUid || searchParams.get("imp_uid"); // 둘 중 하나 사용

  useEffect(() => {
    if (!impUid) {
      setError("결제 정보가 없습니다.");
      return;
    }

    axios
      .get(`https://morek9.click/order/complete/${impUid}`)
      .then((res) => setOrders(res.data)) // 여러 개의 주문을 받기
      .catch(() => setError("결제 정보 조회에 실패했습니다."));
  }, [impUid]);

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600 font-semibold">
        결제 정보를 불러오는 중입니다...
      </div>
    );
  }

  // 할인율을 추출하는 함수
  const getDiscountedPrice = (price, benefit) => {
    if (!benefit) return price; // 할인 정보가 없으면 원래 가격 반환

    const discountPercent =
      typeof benefit === "string" && benefit.includes("%")
        ? parseInt(benefit.replace("%", ""), 10)
        : 0;

    const discountAmount = (price * discountPercent) / 100;
    return price - discountAmount;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-full max-w-xl px-4 py-6">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
          🎉 결제가 완료되었습니다!
        </h2>
        <div className="space-y-4 w-full">
          {orders.map((item) => {
            const discountedPrice = getDiscountedPrice(
              item.orderPrice,
              selectedCoupon?.benefits
            );

            return (
              <div
                key={item.orderId}
                className="flex items-start w-full p-4 border-b border-gray-200"
              >
                {/* 이미지 크기 고정 및 비율 유지 */}
                <div className="w-20 h-20 flex-shrink-0 mr-4">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.png"; // 이미지 로드 실패 시 대체 이미지
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">
                    <strong>상품명: </strong> {item.productName}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>수량: </strong> {item.quantity}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>결제 가격: </strong>{" "}
                    {item.orderPrice.toLocaleString()}원
                  </p>
                  <p className="text-sm">
                    <strong>주문일자: </strong> {item.orderDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <p className="text-base font-semibold">
            😊 주문이 성공적으로 완료되었습니다 😊
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
