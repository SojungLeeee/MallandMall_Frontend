import React from "react";

function MyCoupon({ coupon }) {
  // 쿠폰 정보가 없다면 기본적인 메시지 표시
  if (!coupon) {
    return <div>쿠폰 정보가 없습니다.</div>;
  }

  // 쿠폰 데이터 구조에 맞게 값들을 받아옵니다.
  const { couponName, minPrice, expirationDate, benefits, couponType } = coupon;

  return (
    <div className="coupon-card p-4 border rounded-lg shadow-md  mx-full bg-white m-2">
      <h3 className="text-lg font-semibold text-center mb-1">{couponName}</h3>
      <div className="coupon-details">
        {/* 최소 주문 금액 */}
        <div className="flex justify-end">
          <span className="text-gray-600">
            {" "}
            {minPrice} 원 이상 구매 시 사용 가능
          </span>
        </div>

        {/* 만료일 */}
        <div className="flex justify-end">
          <span className="text-gray-600">{expirationDate} 만료</span>
        </div>

        {/* 혜택 */}
        <div className="flex justify-end">
          <span className="text-gray-600">{benefits}</span>
        </div>
      </div>
    </div>
  );
}

export default MyCoupon;
