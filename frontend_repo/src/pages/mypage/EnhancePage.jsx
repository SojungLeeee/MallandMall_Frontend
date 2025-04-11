"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllCouponList,
  fetchMergeCoupons,
} from "../../api/httpCouponService";
import { getAuthToken } from "../../context/tokenProviderService";
import Coupon from "../../components/ui/coupon/MyCoupon";
import { motion, AnimatePresence } from "framer-motion";
import {
  FailureExplosion,
  MergeAnimation,
  SuccessExplosion,
} from "./AnimationComponents";

function EnhancePage() {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeResult, setMergeResult] = useState(null);
  const [showMergeAnimation, setShowMergeAnimation] = useState(false);
  const [mergeSuccess, setMergeSuccess] = useState(null);
  const [showSuccessEffect, setShowSuccessEffect] = useState(false);
  const [showFailureEffect, setShowFailureEffect] = useState(false);
  const [mergedCoupon, setMergedCoupon] = useState(null); // 병합된 쿠폰 정보를 저장할 상태 추가
  const { token } = getAuthToken();
  const navigate = useNavigate();
  // 쿠폰 목록 불러오기
  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllCouponList(token);
      setCoupons(data);
    } catch (err) {
      setError("쿠폰 목록을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [token]);

  // 쿠폰 선택 처리
  const handleSelect = (couponId) => {
    setSelectedCoupons((prev) =>
      prev.includes(couponId)
        ? prev.filter((id) => id !== couponId)
        : prev.length < 2
        ? [...prev, couponId]
        : prev
    );
  };

  // 병합 애니메이션 완료 후 처리 (성공)
  const handleMergeAnimationComplete = () => {
    setShowMergeAnimation(false);
    // 성공 시 폭발 효과 표시
    setShowSuccessEffect(true);
    // 로딩 상태 해제
    setIsMerging(false);

    // 폭발 효과 타이머
    setTimeout(() => {
      setShowSuccessEffect(false);
      setTimeout(() => {
        setMergeResult(null);
      }, 3000);
    }, 4000);
  };

  // 병합 애니메이션 실패 후 처리
  const handleMergeAnimationFailure = async () => {
    setShowMergeAnimation(false);
    // 로딩 상태 해제
    setIsMerging(false);

    // 즉시 오류 메시지 제거
    setError(null);

    // 선택된 쿠폰 초기화 - 이 부분이 추가됨
    setSelectedCoupons([]);

    // 실패 시에도 쿠폰 목록 새로고침
    await fetchCoupons();

    // 실패 시 끔찍한 효과 표시
    setShowFailureEffect(true);

    // 실패 효과 타이머
    setTimeout(() => {
      setShowFailureEffect(false);
      // 마지막으로 merge 결과 상태 초기화
      setMergeSuccess(null);
      setMergeResult(null);
    }, 3000);
  };

  // API 호출 및 결과 처리 함수 (개선)
  const processMergeRequest = async () => {
    try {
      // 쿠폰 강화 API 호출
      const result = await fetchMergeCoupons(
        selectedCoupons[0],
        selectedCoupons[1]
      );
      console.log("쿠폰 강화 결과:", result);

      // 강화 결과 처리
      setMergeResult(result);

      // 병합된 쿠폰 데이터 저장
      if (result) {
        // API 응답에서 병합된 쿠폰 정보 추출
        setMergedCoupon({
          couponId: result.couponId,
          couponName: result.couponName || "강화된 쿠폰",
          description:
            result.description || "두 개의 쿠폰이 성공적으로 강화되었습니다",
          benefits:
            result.benefits ||
            result.discount ||
            result.couponName?.match(/\d+%/)?.[0],
          validDays: result.validDays || result.validity || "60일",
          // 추가 속성이 있으면 여기에 포함
        });
      } else {
        // API 응답이 없는 경우 기본값 설정
        setMergedCoupon({
          couponName: "강화된 쿠폰",
          description: "두 개의 쿠폰이 강화되어 더 높은 등급이 되었습니다",
          benefits: "20% 할인",
          validDays: "60일",
        });
      }

      // 성공 상태 설정
      setMergeSuccess(true);

      // 쿠폰 목록 새로고침
      await fetchCoupons();

      // 선택된 쿠폰 초기화
      setSelectedCoupons([]);

      return true;
    } catch (err) {
      console.error("쿠폰 강화 에러:", err);

      // 실패 상태 설정
      setMergeSuccess(false);

      return false;
    }
  };
  //

  // 쿠폰 강화 처리
  const handleEnhance = async () => {
    if (selectedCoupons.length !== 2) {
      alert("강화를 위해 쿠폰 2개를 선택하세요!");
      return;
    }

    setIsMerging(true);
    setError(null);
    setMergeSuccess(null);

    // 병합 애니메이션 시작
    setShowMergeAnimation(true);

    try {
      // API 호출 및 결과 처리
      await processMergeRequest();
      // 참고: 성공/실패 애니메이션 완료 후 handleMergeAnimationComplete/Failure에서 isMerging 상태를 false로 설정
    } catch (error) {
      console.error("예상치 못한 오류:", error);
      setIsMerging(false); // 예상치 못한 오류 발생 시에도 로딩 상태 해제
      setShowMergeAnimation(false);
      setError(null); // 오류 메시지 제거 (추가)
    }
  };

  return (
    <div
      className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen relative overflow-hidden"
      style={{ width: "390px", height: "840px", margin: "0 auto" }}
    >
      {/* 병합 애니메이션 */}
      <AnimatePresence>
        {showMergeAnimation && (
          <MergeAnimation
            selectedCoupons={selectedCoupons}
            coupons={coupons}
            onComplete={handleMergeAnimationComplete}
            onFailure={handleMergeAnimationFailure}
            success={mergeSuccess}
          />
        )}
      </AnimatePresence>

      {/* 성공/실패 애니메이션 효과 */}
      <AnimatePresence>
        {showSuccessEffect && <SuccessExplosion />}
        {showFailureEffect && <FailureExplosion />}
      </AnimatePresence>

      {/* 헤더 섹션 */}
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          쿠폰 강화
        </h2>
        <p className="text-gray-600 text-sm">
          두 개의 쿠폰을 선택하여 더 좋은 쿠폰으로 강화해보세요!
        </p>

        {/* 선택된 쿠폰 카운터 */}
        <div className="mt-3 flex justify-center">
          <div className="bg-white px-4 py-2 rounded-full shadow-md inline-flex items-center gap-2">
            <span className="text-gray-700 text-sm">선택된 쿠폰:</span>
            <div className="flex gap-1">
              <div
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  selectedCoupons.length > 0 ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  selectedCoupons.length > 1 ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 강화 결과 메시지 */}
      <AnimatePresence>
        {mergeResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded shadow-lg relative z-10 text-sm"
          >
            <div className="flex items-start">
              <div className="py-1">
                <motion.svg
                  className="w-5 h-5 mr-3"
                  viewBox="0 0 20 20"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1], rotate: [0, 0, 0] }}
                  transition={{ duration: 0.5 }}
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </motion.svg>
              </div>
              <div>
                <p className="font-bold">쿠폰 강화 성공!</p>
                <p>선택한 두 개의 쿠폰이 성공적으로 강화되었습니다.</p>
                <p className="text-xs mt-1">
                  새로운 쿠폰이 목록에 추가되었습니다.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 에러 메시지 - 완전히 제거 */}
      {/* <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded shadow-lg relative z-10 text-sm"
          >
            <div className="flex">
              <div className="py-1">
                <motion.svg
                  className="w-5 h-5 mr-3"
                  viewBox="0 0 20 20"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: 1 }}
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </motion.svg>
              </div>
              <div>
                <p className="font-bold">오류 발생</p>
                <p>{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48 relative z-10">
          <motion.div
            className="h-12 w-12 border-3 border-blue-200 border-t-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          ></motion.div>
        </div>
      ) : (
        <>
          {/* 쿠폰 목록 */}
          {coupons.length === 0 ? (
            <div className="text-center py-12 text-gray-500 relative z-10">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                ></path>
              </svg>
              <h3 className="text-lg font-bold mb-1">쿠폰이 없습니다</h3>
              <p className="text-sm">
                사용 가능한 쿠폰이 없습니다. 나중에 다시 확인해주세요.
              </p>
            </div>
          ) : (
            <div className="space-y-3 relative z-10 max-h-[500px] overflow-y-auto pr-1">
              {coupons.map((coupon) => {
                const isSelected = selectedCoupons.includes(coupon.couponId);
                return (
                  <motion.div
                    key={coupon.couponId}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(coupon.couponId)}
                    className={`transition-all duration-200 ${
                      isSelected
                        ? "ring-2 ring-blue-500 shadow-lg transform translate-x-2"
                        : "hover:shadow-md"
                    }`}
                  >
                    {/* 선택 표시기 */}
                    {isSelected && (
                      <motion.div
                        className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-blue-500 text-white p-1 rounded-full z-10 shadow-lg"
                        initial={{ scale: 0, x: 10 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 15,
                        }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </motion.div>
                    )}
                    <Coupon coupon={coupon} />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 강화 버튼 */}
          <div className="flex justify-center mt-8 relative z-10">
            <motion.button
              onClick={handleEnhance}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              disabled={selectedCoupons.length !== 2 || isMerging}
              className={`px-8 py-3 text-white text-base font-bold rounded-xl shadow-lg transition-all duration-200 ${
                selectedCoupons.length === 2 && !isMerging
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  : "bg-gray-400"
              }`}
            >
              <span className="flex items-center gap-2">
                {isMerging ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    ></motion.div>
                    <span>강화 중...</span>
                  </>
                ) : (
                  <>
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
                      ></path>
                    </svg>
                    <span>쿠폰 강화하기</span>
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}

export default EnhancePage;
