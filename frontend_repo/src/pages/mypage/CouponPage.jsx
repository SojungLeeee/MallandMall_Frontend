import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCouponList } from "../../api/httpCouponService"; // 쿠폰 API 임포트
import { getAuthToken } from "../../context/tokenProviderService";
import Coupon from "../../components/ui/MyCoupon"; // 쿠폰 정보 컴포넌트 임포트

function CouponPage({}) {
  const [coupons, setCoupons] = useState([]); // 쿠폰 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const { token } = getAuthToken(); // 토큰 가져오기
  console.log("Auth Token:", token);

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

  return (
    <div className="coupon-page-container p-3">
      <h2 className="text-2xl font-bold mb-1 text-center">내 쿠폰 목록</h2>
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
            <Coupon key={coupon.couponId} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CouponPage;
