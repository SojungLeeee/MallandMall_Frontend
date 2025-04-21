import axios from "axios";

const BASE_URL = "https://morek9.click/auth/kakao";

// 카카오 로그인 요청 함수
export const kakaoLogin = async (code) => {
  try {
    const response = await axios.post(BASE_URL, { code });

    console.log("🔹 백엔드 응답:", response.data);

    if (!response.data || !response.data.token) {
      throw new Error(" 백엔드에서 토큰을 받지 못했습니다!");
    }

    //  전체 응답 반환해야 userId, role도 사용할 수 있음
    return response.data;
  } catch (error) {
    console.error(" 카카오 로그인 실패:", error.response ? error.response.data : error.message);
    throw error;
  }
};

//  사용자 정보 가져오기
export const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (!token) {
      throw new Error(" JWT 토큰이 없습니다. 로그인이 필요합니다!");
    }

    console.log(" 저장된 userId:", userId);
    console.log(" 저장된 role:", role);

    const response = await axios.get(`${BASE_URL}/user/info`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(" 사용자 데이터 가져오기 실패:", error);
    throw error;
  }
};
