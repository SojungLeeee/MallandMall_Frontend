import React, { useState, useEffect } from "react";
import ChatbotComponent from "../chatbot/ChatbotComponent";

/**
 * 챗봇 플로팅 버튼 컴포넌트
 * @param {string} productCode - 현재 조회 중인 상품 코드 (선택적)
 */
const ChatbotButton = ({ productCode = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProductCode, setCurrentProductCode] = useState(productCode);

  // 페이지 변경 감지 및 productCode 확인
  useEffect(() => {
    // URL에서 productCode 추출 (URL 패턴: /product/{productCode})
    const checkProductCodeFromUrl = () => {
      const path = window.location.pathname;
      const match = path.match(/\/product\/([A-Za-z0-9-]+)/);

      if (match && match[1]) {
        setCurrentProductCode(match[1]);
      } else if (productCode) {
        setCurrentProductCode(productCode);
      } else {
        setCurrentProductCode(null);
      }
    };

    // 초기 체크
    checkProductCodeFromUrl();

    // History 변경 이벤트 리스너 (SPA에서 페이지 전환 감지)
    const handleLocationChange = () => {
      checkProductCodeFromUrl();
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [productCode]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // 채팅창이 열릴 때 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
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
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="mb-14 fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-105 z-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          aria-label="AI 쇼핑 도우미 열기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* 챗봇 모달 */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-blue-600">
                몰앤몰 AI 쇼핑 도우미
              </h2>
              <button
                onClick={toggleChatbot}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="챗봇 닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatbotComponent productCode={currentProductCode} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
