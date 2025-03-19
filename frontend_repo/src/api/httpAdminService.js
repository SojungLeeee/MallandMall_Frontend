import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart", // 실제 URL이 맞는지 확인
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 상품 목록 조회
export async function fetchFindAllProductCode() {
  try {
    console.log("fetchFindAllProductCode 요청");
    const response = await instance.get("/admin/findAllProductCode");

    console.log("상품 목록 응답:", response); // 응답 확인

    // 응답 데이터 반환
    return response.data;
  } catch (error) {
    console.error("에러 발생:", error); // 에러 디버깅
    throw new Error("fetchFindAllProductCode 예외발생");
  }
}
