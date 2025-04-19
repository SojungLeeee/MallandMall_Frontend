// src/services/chatbotService.js
// Axios 인스턴스 설정

export const sendChatMessage = async (message, sessionId, productCode = null) => {
  try {
    const response = await fetch("https://morek9.click/api/chatbot/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        sessionId,
        productCode,
      }),
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("챗봇 메시지 전송 오류:", error);
    throw error;
  }
};

/**
 * 챗봇 세션을 초기화하는 함수
 * @param {string} sessionId - 초기화할 세션 ID
 * @returns {Promise<void>}
 */
export const clearChatSession = async (sessionId) => {
  try {
    const response = await fetch(`https://morek9.click/api/chatbot/session/${sessionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`세션 초기화 오류: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("챗봇 세션 초기화 오류:", error);
    throw error;
  }
};

/**
 * 새 세션 ID를 생성하는 유틸리티 함수
 * @returns {string} - 생성된 세션 ID
 */
export const generateSessionId = () => {
  return "session_" + Math.random().toString(36).substring(2, 15);
};
