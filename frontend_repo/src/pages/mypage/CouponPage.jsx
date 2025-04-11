import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCouponList } from "../../api/httpCouponService";
import { getAuthToken } from "../../context/tokenProviderService";
import Coupon from "../../components/ui/coupon/MyCoupon";

function CouponPage({}) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = getAuthToken();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await fetchAllCouponList(token);
        setCoupons(data);
        setLoading(false);
      } catch (err) {
        setError("쿠폰을 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [token]);

  const handleUpgradeClick = () => {
    navigate("/coupon/upgrade"); // 강화 페이지로 이동
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="coupon-page-container p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold text-center">내 쿠폰 목록</h2>
        <button
          onClick={handleUpgradeClick}
          className="ml-3 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          강화
        </button>
      </div>

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
