import axios from "axios";

const API_BASE_URL = "http://localhost:8090";

/**
 * 1️⃣ 네이버 로그인 URL 요청
 */
export const getNaverLoginUrl = async () => {
  try {
    const response = await fetch(
      "http://localhost:8090/emart/login/naver/login"
    );
    const result = await response.json();
    console.log("✅ 백엔드 응답 데이터:", result);

    // result 자체가 { url: '...' } 인지 확인
    return result.url; // 이게 undefined이면 구조가 잘못된 것
  } catch (error) {
    console.error("❌ 네이버 로그인 URL 요청 중 오류 발생:", error);
    return null;
  }
};

/**
 * 2️⃣ 네이버 인가 코드로 JWT 요청
 */
export const getNaverJwtToken = async (code, state) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/emart/login/naver`, {
      params: { code, state },
    });

    return response.data; // JWT 응답 (token, userId, role 포함)
  } catch (error) {
    console.error("❌ 네이버 로그인 처리 실패:", error);
    throw error;
  }
};
