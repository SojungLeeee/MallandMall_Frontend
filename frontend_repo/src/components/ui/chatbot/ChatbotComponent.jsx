import React, { useState, useEffect, useRef } from "react";
import {
  sendChatMessage,
  generateSessionId,
} from "../../../api/chatbotService";

// 챗 메시지 컴포넌트 - 내부 컴포넌트로 정의
export const ChatMessage = ({ message, isUser }) => {
  // 제품 추천인 경우 표시할 컴포넌트
  if (
    !isUser &&
    message.isProductRecommendation &&
    message.suggestedProducts &&
    message.suggestedProducts.length > 0
  ) {
    return (
      <div className="flex mb-6 animate-fadeIn">
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center shadow-md border-2 border-white">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(255,255,255,0.1)"
              />
              <path
                d="M9 12H9.01M12 12H12.01M15 12H15.01"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white p-4 rounded-2xl shadow-md mb-3 transform transition-all duration-300 hover:shadow-lg border-l-2 border-black">
            <p className="text-gray-700 leading-relaxed text-left">
              {message.message}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {message.suggestedProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-gray-300 transform hover:-translate-y-1"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-gray-800">
                    {product.productName}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.averageRating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 ml-1 text-sm">
                      {product.averageRating
                        ? product.averageRating.toFixed(1)
                        : "평점 없음"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                    <p className="font-bold text-red-600">
                      {product.price ? product.price.toLocaleString() : 0}원
                    </p>
                  </div>
                  {product.reason && (
                    <p className="text-gray-700 text-sm border-t pt-3 mt-3 leading-relaxed">
                      <span className="font-semibold text-black">
                        추천 이유:
                      </span>{" "}
                      {product.reason}
                    </p>
                  )}
                  <button
                    className="mt-4 w-full bg-gradient-to-r from-gray-900 to-black text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transform hover:-translate-y-0.5"
                    onClick={() =>
                      (window.location.href = `/product/${product.productCode}`)
                    }
                  >
                    상품 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 일반 메시지인 경우
  return (
    <div className={`flex mb-5 ${isUser ? "justify-end" : ""} animate-fadeIn`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center shadow-md border-2 border-white">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(255,255,255,0.1)"
              />
              <path
                d="M9 12H9.01M12 12H12.01M15 12H15.01"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
      <div
        className={`rounded-2xl p-4 shadow-md max-w-md transform transition-all duration-300 ${
          isUser
            ? "bg-black text-white rounded-br-none"
            : "bg-white text-gray-700 rounded-bl-none hover:shadow-lg border-l-2 border-black"
        }`}
      >
        <p className="leading-relaxed text-left">
          {message.message || message}
        </p>
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shadow-md">
            <span className="text-white font-bold">나</span>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatbotComponent = ({ productCode = null, showHeader = true }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    // URL에서 productCode 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const productCodeParam = urlParams.get("productCode");
    if (productCodeParam && !productCode) {
      productCode = productCodeParam;
    }

    // 세션 ID 생성
    setSessionId(generateSessionId());

    // 초기 환영 메시지 표시
    setMessages([
      {
        message:
          "안녕하세요! 몰앤몰 AI 쇼핑 도우미입니다. 원하시는 상품을 말씀하시면 추천을 도와드리겠습니다.",
        isUser: false,
      },
    ]);
  }, [productCode]);

  // 메시지 스크롤 처리
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 메시지가 추가될 때마다 스크롤 하단으로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const userMessage = { message: input, isUser: true };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // API 서비스를 통한 메시지 전송
      const data = await sendChatMessage(input, sessionId, productCode);

      // 챗봇 응답 추가
      setMessages([...newMessages, { ...data, isUser: false }]);
    } catch (error) {
      console.error("Error sending message:", error);
      // 에러 메시지 표시
      setMessages([
        ...newMessages,
        {
          message:
            "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
      // 스크롤 바로 하단으로 이동시키기
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 헤더 - showHeader가 true일 때만 표시 */}
      {showHeader && (
        <header className="bg-gradient-to-r from-gray-900 to-black text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg
                className="w-7 h-7"
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
              <h1 className="text-xl font-bold">몰앤몰 AI 쇼핑 어시스턴트</h1>
            </div>
            <div className="flex items-center bg-white bg-opacity-10 px-3 py-1 rounded-full">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              <span className="text-sm font-medium">실시간 상담</span>
            </div>
          </div>
        </header>
      )}

      {/* 메시지 영역 */}
      <div
        className={`flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 ${
          !showHeader && "pt-2"
        }`}
        ref={chatContainerRef}
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23333333' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E')",
        }}
      >
        <div className="container mx-auto max-w-4xl space-y-4">
          {/* 메시지 목록 */}
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} isUser={msg.isUser} />
          ))}

          {/* 로딩 표시기 */}
          {loading && (
            <div className="flex mb-4 animate-fadeIn">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center shadow-md border-2 border-white">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="rgba(255,255,255,0.1)"
                    />
                    <path
                      d="M9 12H9.01M12 12H12.01M15 12H15.01"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-md inline-flex items-center rounded-bl-none border-l-2 border-black">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* 스크롤 참조 지점 */}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex items-center relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="w-full border border-gray-200 bg-gray-50 rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-black focus:border-gray-300 focus:bg-white transition-all duration-300"
              disabled={loading}
            />
            <button
              type="submit"
              className="absolute right-1 bg-gradient-to-r from-gray-900 to-black text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300 hover:shadow-md w-10 h-10 flex items-center justify-center"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 5L20 12L13 19M20 12H4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </form>
          <div className="mt-3 text-xs text-gray-500 flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p>상품 추천, 배송 문의 등 몰앤몰과 관련된 질문을 해보세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// CSS 애니메이션을 위한 전역 스타일 추가 (index.css 또는 App.css에 추가)
//
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
//
// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out forwards;
// }

export default ChatbotComponent;
