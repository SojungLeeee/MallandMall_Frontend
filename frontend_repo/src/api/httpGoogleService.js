import axios from "axios";

const BASE_URL = "https://morek9.click/auth/google";

// 구글 로그인 요청 함수
export const googleLogin = async (token) => {
  try {
    const response = await axios.post(BASE_URL, { token });

    console.log("🔹 백엔드 응답:", response.data);

    if (!response.data || !response.data.token) {
      throw new Error("백엔드에서 토큰을 받지 못했습니다!");
    }

    // 전체 응답 반환해야 userId, role도 사용할 수 있음
    return response.data;
  } catch (error) {
    console.error("구글 로그인 실패:", error.response ? error.response.data : error.message);
    throw error;
  }
};
