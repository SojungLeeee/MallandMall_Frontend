import { motion } from "framer-motion";

// 실패 애니메이션 컴포넌트
export const FailureExplosion = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 flex items-center justify-center pointer-events-none z-40"
      style={{ width: "390px", height: "840px", margin: "0 auto" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 배경 어둡게 */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0 }}
      />

      {/* 중앙 폭발 - 좀 더 화려하게 */}
      <motion.div
        className="relative h-60 w-60"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.8, 0] }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-red-700 rounded-full blur-xl"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-red-500 rounded-full blur-md"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-orange-500 rounded-full blur-sm"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-yellow-500 rounded-full opacity-70 blur-sm"></div>

        {/* 번개 효과 - 더 많이, 더 화려하게 */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`lightning-${i}`}
            className="absolute top-1/2 left-1/2 h-2 bg-yellow-300 rounded-full origin-left"
            style={{
              width: `${Math.random() * 100 + 100}px`,
              transform: `rotate(${i * 30}deg)`,
              filter: "blur(1px)",
              boxShadow: "0 0 15px 4px rgba(255, 255, 0, 0.7)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1, 0.5, 1, 0],
              opacity: [0, 1, 0.5, 1, 0],
            }}
            transition={{
              duration: 0.8,
              times: [0, 0.2, 0.3, 0.4, 1],
              delay: i * 0.05,
            }}
          />
        ))}

        {/* 파편 효과 - 더 많이, 더 다양하게 */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`debris-${i}`}
            className={`absolute w-${Math.random() > 0.5 ? 3 : 2} h-${
              Math.random() > 0.5 ? 3 : 2
            } bg-${
              ["red-600", "orange-500", "yellow-500"][
                Math.floor(Math.random() * 3)
              ]
            } rounded-full top-1/2 left-1/2 z-30`}
            style={{
              boxShadow: "0 0 10px 3px rgba(220, 38, 38, 0.8)",
            }}
            initial={{ x: 0, y: 0 }}
            animate={{
              x: Math.sin(i * 0.8) * (Math.random() * 200 + 50),
              y: Math.cos(i * 0.8) * (Math.random() * 200 + 50),
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        ))}
      </motion.div>

      {/* 화면 흔들림 효과 - 더 강하게 */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        animate={{
          x: [0, -10, 15, -15, 10, -5, 0],
          y: [0, 10, -8, 12, -6, 4, 0],
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* 실패 메시지 */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-50"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: [0, 1.5, 1], rotate: [-20, 10, 0] }}
        transition={{ duration: 0.6, delay: 0.4 }}
      ></motion.div>

      {/* 깨진 유리 효과 - 더 많이 */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`glass-${i}`}
          className="absolute bg-white/20 backdrop-blur-sm"
          style={{
            clipPath: `polygon(${Math.random() * 100}% ${
              Math.random() * 100
            }%, ${Math.random() * 100}% ${Math.random() * 100}%, ${
              Math.random() * 100
            }% ${Math.random() * 100}%)`,
            width: `${Math.random() * 150 + 50}px`,
            height: `${Math.random() * 150 + 50}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{
            duration: 1.5,
            delay: 0.2 + Math.random() * 0.3,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
};

// 카드 병합 애니메이션 컴포넌트
export const MergeAnimation = ({
  selectedCoupons,
  coupons,
  onComplete,
  onFailure,
  success,
}) => {
  // 선택된 쿠폰 정보 찾기
  const selectedCouponData = coupons.filter((coupon) =>
    selectedCoupons.includes(coupon.couponId)
  );

  return (
    <motion.div
      className="fixed top-0 left-0 bg-black/50 flex items-center justify-center z-40"
      style={{ width: "390px", height: "840px", margin: "0 auto" }} // 화면 크기에 맞춤
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative h-64 w-full max-w-[320px]">
        {" "}
        {/* h-80 -> h-64로 축소, max-w-[350px] -> max-w-[320px]로 축소 */}
        {/* 첫 번째 카드 */}
        <motion.div
          className="absolute top-1/2 left-0 transform -translate-y-1/2 w-48 h-32 bg-white rounded-xl shadow-xl z-10 overflow-hidden" // w-56 h-36 -> w-48 h-32로 축소
          initial={{ x: "-100%", y: "-50%", rotate: -5 }}
          animate={{
            x: success !== null ? "50%" : "0%",
            y: "-50%",
            rotate: 0,
            scale: success !== null ? [1, 0.8, 0] : 1,
          }}
          transition={{
            duration: success !== null ? 1.5 : 0.8,
            times: success !== null ? [0, 0.6, 1] : [0, 1],
          }}
        >
          {selectedCouponData[0] && (
            <div className="w-full h-full p-3 flex flex-col justify-between">
              {" "}
              {/* p-4 -> p-3으로 축소 */}
              <div className="text-base font-bold">
                {" "}
                {/* text-lg -> text-base로 축소 */}
                {selectedCouponData[0].couponName || "쿠폰"}
              </div>
              <div className="text-xs text-gray-600">
                {" "}
                {/* text-sm -> text-xs로 축소 */}
                {selectedCouponData[0].description || "쿠폰 설명"}
              </div>
            </div>
          )}
        </motion.div>
        {/* 두 번째 카드 */}
        <motion.div
          className="absolute top-1/2 right-0 transform -translate-y-1/2 w-48 h-32 bg-white rounded-xl shadow-xl z-10 overflow-hidden" // w-56 h-36 -> w-48 h-32로 축소
          initial={{ x: "100%", y: "-50%", rotate: 5 }}
          animate={{
            x: success !== null ? "-50%" : "0%",
            y: "-50%",
            rotate: 0,
            scale: success !== null ? [1, 0.8, 0] : 1,
          }}
          transition={{
            duration: success !== null ? 1.5 : 0.8,
            times: success !== null ? [0, 0.6, 1] : [0, 1],
          }}
        >
          {selectedCouponData[1] && (
            <div className="w-full h-full p-3 flex flex-col justify-between">
              {" "}
              {/* p-4 -> p-3으로 축소 */}
              <div className="text-base font-bold">
                {" "}
                {/* text-lg -> text-base로 축소 */}
                {selectedCouponData[1].couponName || "쿠폰"}
              </div>
              <div className="text-xs text-gray-600">
                {" "}
                {/* text-sm -> text-xs로 축소 */}
                {selectedCouponData[1].description || "쿠폰 설명"}
              </div>
            </div>
          )}
        </motion.div>
        {/* 병합 효과 - 성공 시에만 표시 */}
        {success === true && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1],
              scale: [0, 0, 1.1, 1], // 1.2 -> 1.1로 축소
            }}
            transition={{
              duration: 2,
              times: [0, 0.8, 0.9, 1],
              onComplete,
            }}
          >
            <motion.div
              className="absolute top-0 left-0 bg-white/20 rounded-xl"
              animate={{
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 1,
                repeat: 1,
              }}
            />
          </motion.div>
        )}
        {/* 실패 효과 - 실패 시에만 표시 */}
        {success === false && (
          <motion.div
            className="mb-4 ml-[8%] bg-black-100 border-l-4 border-black-500 text-green-700 p-4 rounded-lg shadow-lg relative z-20 text-base" // 전체 화면 기준 중앙 정렬" // w-64 h-40 -> w-56 h-36으로 축소
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1],
              scale: [0, 1.1], // 1.2 -> 1.1로 축소
            }}
            transition={{
              duration: 0.5,
              onComplete: onFailure,
            }}
          >
            <motion.div
              className="absolute top-0 left-0 bg-red-800/50 rounded-xl"
              animate={{
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 2,
              }}
            />
            <motion.div
              className="fixed inset-2 flex items-center justify-center z-50"
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: 1 }}
            >
              <div className="text-white text-xl font-bold">강화 실패!</div>{" "}
              {/* text-2xl -> text-xl로 축소 */}
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// SuccessExplosion 컴포넌트 - mergedCoupon 정보를 제대로 표시
export const SuccessExplosion = ({ mergedCoupon }) => {
  return (
    <motion.div
      className="fixed top-0 left-0 flex items-center justify-center pointer-events-none z-40"
      style={{ width: "390px", height: "840px", margin: "0 auto" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 배경 어둡게 */}
      <motion.div
        className="absolute inset-0 bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
      />

      {/* 중앙 폭발 효과 (기존 코드 유지) */}
      <motion.div
        className="relative h-40 w-40"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 0] }}
        transition={{ duration: 1.2 }}
      >
        {/* 폭발 효과 관련 코드는 그대로 유지 */}
        <div className="absolute inset-0 bg-orange-600 rounded-full blur-xl"></div>
        <div className="absolute inset-0 bg-yellow-500 rounded-full blur-md"></div>
        <div className="absolute inset-0 bg-white rounded-full blur-sm"></div>

        {/* 폭발 파편 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full top-1/2 left-1/2 z-30"
            initial={{ x: 0, y: 0 }}
            animate={{
              x: Math.sin(i * 0.5) * (Math.random() * 150 + 50),
              y: Math.cos(i * 0.5) * (Math.random() * 150 + 50),
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        ))}

        <motion.div
          className="absolute inset-0 border-2 border-white rounded-full"
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </motion.div>

      {/* FIFA-style 강화 카드 애니메이션 - 여기에 mergedCoupon 정보 표시 */}
      <motion.div
        className="absolute z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.div
          className="relative w-64 h-96 bg-gradient-to-br from-blue-900 to-indigo-800 rounded-2xl overflow-hidden shadow-2xl"
          animate={{
            scale: [1, 1.1, 1],
            rotateY: [0, 10, -10, 0],
          }}
          transition={{
            delay: 1.1,
            duration: 1.5,
            times: [0, 0.3, 0.6, 1],
          }}
        >
          {/* 빛나는 테두리 효과 */}
          <motion.div
            className="absolute inset-0 border-2 border-white/30 rounded-2xl"
            animate={{
              boxShadow: [
                "0 0 5px rgba(255,255,255,0.3)",
                "0 0 15px rgba(255,255,255,0.8)",
                "0 0 5px rgba(255,255,255,0.3)",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: 2,
              repeatType: "reverse",
            }}
          />

          {/* 빛나는 배경 효과 */}
          <motion.div
            className="absolute inset-0 bg-radial-gradient rounded-2xl opacity-0"
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ delay: 1.2, duration: 1.8 }}
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
            }}
          />

          {/* 슬라이딩 빛 효과 */}
          <motion.div
            className="absolute -inset-full bg-white/30 rotate-45 z-10"
            animate={{ left: ["-150%", "150%"] }}
            transition={{
              delay: 1.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              width: "200%",
              height: "300%",
              background:
                "linear-gradient(120deg, transparent 10%, rgba(255,255,255,0.6) 50%, transparent 90%)",
            }}
          />

          {/* 카드 내용 */}
          <div className="relative flex flex-col items-center justify-between p-4 h-full z-20">
            {/* 상단: 등급 표시 */}
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-6 py-2 rounded-full shadow-lg text-lg font-bold">
              강화 성공!
            </div>

            {/* 중앙: 쿠폰 아이콘 */}
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                delay: 1.5,
                duration: 0.8,
              }}
            >
              <svg
                className="w-14 h-14 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                  clipRule="evenodd"
                />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
            </motion.div>

            {/* 하단: 쿠폰 정보 - 여기에 mergedCoupon 정보 표시 */}
            <div className="text-center w-full">
              <motion.h3
                className="text-xl font-bold text-white mb-2"
                animate={{ y: [10, 0], opacity: [0, 1] }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                {mergedCoupon?.couponName || "강화쿠폰"}
              </motion.h3>
              <motion.div
                className="text-white/80 mb-4"
                animate={{ y: [10, 0], opacity: [0, 1] }}
                transition={{ delay: 1.7, duration: 0.5 }}
              >
                {mergedCoupon?.description || "쿠폰이 업그레이드되었습니다"}
              </motion.div>

              {/* 할인율 정보 - 더 눈에 띄게 표시 */}
              <motion.div
                className="flex justify-center gap-4 mt-2"
                animate={{ y: [10, 0], opacity: [0, 1] }}
                transition={{ delay: 1.8, duration: 0.5 }}
              >
                <div className="bg-indigo-900/70 px-4 py-2 rounded-lg">
                  <div className="bg-indigo-900/70 px-4 py-2 rounded-lg text-lg font-bold text-white">
                    {mergedCoupon?.couponName || "성공!"}
                  </div>
                </div>
              </motion.div>

              {/* 유효기간 정보 추가 */}
              {mergedCoupon?.validDays && (
                <motion.div
                  className="text-white/70 mt-3 text-sm"
                  animate={{ y: [10, 0], opacity: [0, 1] }}
                  transition={{ delay: 1.9, duration: 0.5 }}
                >
                  유효기간: {mergedCoupon.validDays}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 확인 버튼 */}
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 0.5 }}
        >
          <button className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-8 py-2 rounded-lg shadow-lg font-bold">
            확인
          </button>
        </motion.div>
      </motion.div>

      {/* 배경 파티클 효과 (기존 코드 유지) */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute bg-yellow-300/70 rounded-full"
          style={{
            width: Math.random() * 8 + 4 + "px",
            height: Math.random() * 8 + 4 + "px",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, Math.random() * -100 - 50],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 1.5 + 1.5,
            delay: Math.random() * 0.5 + 1,
            repeat: 1,
            repeatType: "mirror",
          }}
        />
      ))}
    </motion.div>
  );
};
