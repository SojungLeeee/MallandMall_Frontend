import React, { useState, useEffect } from "react";
import ChatbotComponent from "../chatbot/ChatbotComponent";

/**
 * 챗봇 플로팅 버튼 컴포넌트
 * @param {string} productCode - 현재 조회 중인 상품 코드 (선택적)
 */
const ChatbotButton = ({ productCode = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProductCode, setCurrentProductCode] = useState(productCode);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isButtonAnimated, setIsButtonAnimated] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isTooltipAnimating, setIsTooltipAnimating] = useState(false);

  // 페이지 변경 감지 및 productCode 확인
  useEffect(() => {
    // URL에서 productCode 추출 (URL 패턴: /product/{productCode})
    const checkProductCodeFromUrl = () => {
      const path = window.location.pathname;
      const match = path.match(/\/product\/([A-Za-z0-9-]+)/);

      if (match && match[1]) {
        setCurrentProductCode(match[1]);
        // 상품 페이지에서 버튼 애니메이션 추가 및 툴팁 표시
        animateTooltipFromButton();
      } else if (productCode) {
        setCurrentProductCode(productCode);
      } else {
        setCurrentProductCode(null);
      }
    };

    // 초기 체크
    checkProductCodeFromUrl();

    // 페이지 로드 시 초기 툴팁 애니메이션
    setTimeout(() => {
      animateTooltipFromButton();
    }, 1000);

    // History 변경 이벤트 리스너 (SPA에서 페이지 전환 감지)
    const handleLocationChange = () => {
      checkProductCodeFromUrl();
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [productCode]);

  // 15초 후 버튼 애니메이션 및 툴팁 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        animateTooltipFromButton();
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // 툴팁이 버튼에서 나오는 애니메이션
  const animateTooltipFromButton = () => {
    // 먼저 버튼 애니메이션
    setIsButtonAnimated(true);

    // 툴팁 숨기기
    setShowTooltip(false);
    setIsTooltipAnimating(true);

    // 잠시 후 툴팁이 버튼에서 나오는 애니메이션
    setTimeout(() => {
      setShowTooltip(true);

      // 버튼 애니메이션 종료
      setTimeout(() => {
        setIsButtonAnimated(false);

        // 애니메이션 완료 후 툴팁 애니메이션 상태 해제
        setTimeout(() => {
          setIsTooltipAnimating(false);
        }, 500);
      }, 800);
    }, 600);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setIsButtonAnimated(false);
  };

  // 채팅창이 열릴 때 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsButtonVisible(false);
      setTimeout(() => setIsButtonVisible(true), 500);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* 플로팅 버튼 - 챗봇이 열려있을 때는 숨김 */}
      {!isOpen && isButtonVisible && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center"
          style={{ transform: "translateY(-3rem)" }} // 상단으로 이동 (16=4rem)
        >
          {/* 메시지 툴팁 - 버튼에서 나오는 애니메이션 */}
          <div
            className={`mr-3  bg-white rounded-sm p-4 shadow-lg transition-all duration-500 origin-right w-50 ${
              !showTooltip
                ? "opacity-0 scale-0 translate-x-10"
                : isTooltipAnimating
                ? "opacity-100 scale-100 translate-x-0 animate-tooltip-emerge"
                : "opacity-100 scale-100 translate-x-0"
            }`}
            style={{
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              transform: "translateY(0rem)",
            }}
          >
            <div className="relative">
              <p className="text-sm font-medium text-gray-800 whitespace-normal">
                챗봇에게 상품을 추천받으세요
              </p>
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                <svg
                  className="h-4 w-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 0 0"
                >
                  <path d="M0 0L12 12L0 24Z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* 챗봇 버튼 */}
          <button
            onClick={toggleChatbot}
            onMouseEnter={() =>
              !isTooltipAnimating &&
              showTooltip === false &&
              animateTooltipFromButton()
            }
            className={`group bg-gradient-to-br  from-gray-900 to-black text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 
            ${isButtonAnimated ? "animate-button-pulse" : ""}`}
            aria-label="AI 쇼핑 도우미 열기"
            style={{
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div className="relative p-0.5 rounded-full bg-gradient-to-br from-gray-800 to-black group-hover:from-gray-700">
              <svg
                className="h-6 w-6 transform transition-transform duration-300 group-hover:rotate-12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="rgba(255,255,255,0.1)"
                />
                <path
                  d="M9 12H9.01M12 12H12.01M15 12H15.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* 챗봇 모달 */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-40 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col overflow-hidden transform transition-all duration-300 animate-scaleUp">
            <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-gray-900 to-black text-white">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="rgba(255,255,255,0.1)"
                  />
                  <path
                    d="M9 12H9.01M12 12H12.01M15 12H15.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="text-xl font-semibold">몰앤몰 AI 쇼핑 도우미</h2>
              </div>
              <button
                onClick={toggleChatbot}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-10 focus:outline-none"
                aria-label="챗봇 닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatbotComponent
                productCode={currentProductCode}
                showHeader={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations - should be moved to your global CSS */}
      <style jsx>{`
        @keyframes scaleUp {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes tooltip-emerge {
          0% {
            transform: translateX(20px) scale(0.5);
            opacity: 0;
          }
          60% {
            transform: translateX(-5px) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes button-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
            transform: scale(1.1);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
            transform: scale(1);
          }
        }

        .animate-scaleUp {
          animation: scaleUp 0.3s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-tooltip-emerge {
          animation: tooltip-emerge 0.6s ease-out forwards;
        }

        .animate-button-pulse {
          animation: button-pulse 1s ease-out;
        }

        /* 모바일 환경에서의 터치 움직임 방지 */
        @media (hover: none) {
          .mb-14 {
            margin-bottom: 3.5rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default ChatbotButton;
