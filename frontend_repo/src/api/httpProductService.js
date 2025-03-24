import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart",

  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export async function fetchProductFavoriteHome(token) {
  const response = await instance.get(`/product/likecategories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 응답 데이터에서 실제 상품 배열을 추출
  return response.data;
}
