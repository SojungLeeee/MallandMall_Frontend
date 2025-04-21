import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "https://morek9.click/offprice",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 상품 코드로 가격 변동 이력 조회
export async function fetchPriceHistory(productCode) {
  console.log("fetchPriceHistory 요청");

  const response = await instance.get(`/history/${productCode}`);

  console.log("fetchPriceHistory.response:", response);
  return response.data;
}

export async function fetchDiscountedProducts() {
  const jwtAuthToken = localStorage.getItem("jwtAuthToken");

  if (!jwtAuthToken) {
    throw new Error("토큰이 존재하지 않습니다.");
  }

  const response = await instance.get(`/discount`, {
    headers: { Authorization: `Bearer ${jwtAuthToken}` },
  });

  return response.data;
}
