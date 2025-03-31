import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAllCouponList } from "../../api/httpCouponService"; // 쿠폰 API 임포트
import { getAuthToken } from "../../context/tokenProviderService";
import MyCoupon from "../../components/ui/SelectCoupon"; // 쿠폰 정보 컴포넌트 임포트

function CouponUsePage() {
  const location = useLocation(); // useLocation 훅으로 state 가져오기
  const { originalPrice } = location.state || {}; // state에서 originalPrice 추출
  // originalPrice를 prop으로 받습니다.
  const [coupons, setCoupons] = useState([]); // 쿠폰 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [selectedCoupon, setSelectedCoupon] = useState(null); // 선택된 쿠폰 상태
  const [couponError, setCouponError] = useState(null); // 쿠폰 조건 에러 메시지
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const { token } = getAuthToken(); // 토큰 가져오기

  // 돌아가기 버튼 클릭 시 이전 페이지로 돌아가는 함수
  const handleGoBack = () => {
    navigate("/order", { state: { selectedCoupon: null } }); // 이전 페이지로 돌아가기
  };

  // 주문 페이지로 쿠폰 정보 전달하면서 이동하는 함수
  const handleGoOrder = () => {
    console.log(originalPrice);
    if (selectedCoupon) {
      // 선택된 쿠폰이 있고, 최소 주문 금액 조건을 충족하는 경우에만 쿠폰 사용
      const minPrice = selectedCoupon.minPrice;
      if (originalPrice >= minPrice) {
        navigate("/order", { state: { selectedCoupon } }); // 쿠폰 정보를 state로 전달
      } else {
        setCouponError(
          `최소 주문 금액 ${minPrice.toLocaleString()}원 이상일 때만 사용 가능`
        );
      }
    } else {
      alert("쿠폰을 선택해주세요.");
    }
  };

  // 컴포넌트가 마운트될 때 쿠폰 목록을 가져오는 함수
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await fetchAllCouponList(token); // API 호출
        setCoupons(data); // 받아온 쿠폰 데이터 상태에 저장
        setLoading(false); // 로딩 완료
      } catch (err) {
        setError("쿠폰을 불러오는 데 실패했습니다.");
        setLoading(false); // 로딩 완료
      }
    };

    fetchCoupons();
  }, [token]); // token이 변경될 때마다 호출

  // 로딩 중이면 로딩 메시지 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 에러가 발생하면 에러 메시지 표시
  if (error) {
    return <div>{error}</div>;
  }

  // 쿠폰 선택 처리 함수
  const handleCouponSelect = (coupon) => {
    setSelectedCoupon(coupon);
    setCouponError(null); // 쿠폰을 새로 선택했으므로 에러 메시지 초기화
  };

  return (
    <div className="coupon-page-container pt-7 pb-4 pl-4 pr-4">
      {/* 상단 "쿠폰 사용" 텍스트와 돌아가기 X 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">쿠폰 사용</h2>
        <button
          onClick={handleGoBack}
          className="text-2xl font-bold text-gray-800 hover:text-gray-600 mb-4"
        >
          X
        </button>
      </div>

      <p className="mb-1 font-bold">
        쿠폰은{" "}
        <span style={{ color: "red", textDecoration: "underline" }}>
          중복 사용이 불가능
        </span>
        합니다.
      </p>

      {/* 쿠폰 목록이 없으면 "쿠폰이 없습니다" 메시지 */}
      {coupons.length === 0 ? (
        <div className="text-center">보유한 쿠폰이 없습니다.</div>
      ) : (
        <div className="coupon-list grid">
          {coupons.map((coupon) => (
            <MyCoupon
              key={coupon.couponId}
              coupon={coupon}
              isSelected={selectedCoupon?.couponId === coupon.couponId} // 선택된 쿠폰 강조
              onSelect={handleCouponSelect} // 쿠폰 선택 시 처리
            />
          ))}
        </div>
      )}

      {/* 쿠폰 조건을 만족하지 않는 경우 에러 메시지 */}
      {couponError && (
        <div className="mt-4 text-center text-red-500 font-bold">
          {couponError}
        </div>
      )}

      {/* 쿠폰 목록 아래에 "적용하기" 버튼 추가 */}
      <div className="flex justify-center mt-2">
        <button
          className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-700"
          onClick={handleGoOrder}
        >
          적용하기
        </button>
      </div>
    </div>
  );
}

export default CouponUsePage;
