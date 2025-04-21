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
    return <div className="text-center mt-10 text-red-500 font-semibold">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center mt-10 text-gray-600 font-semibold">결제 정보를 불러오는 중입니다...</div>;
  }

  // 할인율을 추출하는 함수
  const getDiscountedPrice = (price, benefit) => {
    if (!benefit) return price; // 할인 정보가 없으면 원래 가격 반환

    const discountPercent =
      typeof benefit === "string" && benefit.includes("%") ? parseInt(benefit.replace("%", ""), 10) : 0;

    const discountAmount = (price * discountPercent) / 100;
    return price - discountAmount;
  };

  return (
    <div className="flex  justify-center h-full">
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-1">🎉 결제가 완료되었습니다!</h2>
        <div className="space-y-4">
          {orders.map((item) => {
            const discountedPrice = getDiscountedPrice(item.orderPrice, selectedCoupon?.benefits);

            return (
              <div key={item.orderId} className="flex items-center justify-between p-4 border-b border-gray-200">
                {/* 상품 사진 */}
                <img src={item.image} alt={item.productName} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div className="flex-1 ">
                  <p>
                    <strong>상품명 : </strong> {item.productName}
                  </p>
                  <p>
                    <strong>수량 : </strong> {item.quantity}
                  </p>
                  <p>
                    <strong>결제 가격 : </strong> {item.orderPrice.toLocaleString()}원
                  </p>
                  <p>
                    <strong>주문일자 : </strong> {item.orderDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <p className="text-base font-semibold">😊 주문이 성공적으로 완료되었습니다 😊</p>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
