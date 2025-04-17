"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCouponList } from "../../api/httpCouponService";
import { getAuthToken } from "../../context/tokenProviderService";
import Coupon from "../../components/ui/coupon/MyCoupon";
import { motion, AnimatePresence } from "framer-motion";

function CouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTip, setShowTip] = useState(false);
  const navigate = useNavigate();
  const { token } = getAuthToken();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await fetchAllCouponList(token);
        setCoupons(data);
        setLoading(false);
        // 쿠폰 로딩 후 팁 표시
        setTimeout(() => setShowTip(true), 1000);
        setTimeout(() => setShowTip(false), 5000);
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

  // 애니메이션 변수
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="relative h-full bg-white">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-10 px-5 py-2 bg-white border-b border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">내 쿠폰 보관함</h2>
            <motion.button
              onClick={handleUpgradeClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 text-white font-medium rounded-md bg-black shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>쿠폰 강화</span>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* 플로팅 팁 */}
        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed bottom-4 right-4 left-4 mx-auto max-w-xs p-4 bg-black text-white rounded-md shadow-lg z-20"
            >
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">
                  '쿠폰 강화' 버튼을 누르면 두 개의 쿠폰을 조합하여 더 큰 혜택의
                  쿠폰을 얻을 수 있어요!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 컨텐츠 영역 */}
        <div className="p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1.2,
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="w-10 h-10 mb-4 border-2 border-gray-200 border-t-black rounded-full"
              ></motion.div>
              <p className="text-gray-700">쿠폰을 불러오는 중...</p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md text-red-700"
            >
              <div className="flex">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{error}</p>
              </div>
            </motion.div>
          ) : coupons.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-64 p-6 bg-gray-50 rounded-md text-center"
            >
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 12H4m8-8v16m2-8h.01M12 12h.01M8 12h.01"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                쿠폰이 없습니다
              </h3>
              <p className="text-gray-500 text-sm">
                앱을 이용하면서 쿠폰을 획득해보세요!
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-0 pb-4"
            >
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon.couponId || index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    backgroundColor: "#fafafa",
                  }}
                  className="transition-all duration-200 bg-white border border-gray-100 rounded-md overflow-hidden"
                >
                  <Coupon coupon={coupon} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CouponPage;
