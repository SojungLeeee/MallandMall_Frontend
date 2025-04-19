import axios from "axios";

// 공통 인스턴스 설정 (기반 경로: /emart)
const instance = axios.create({
  baseURL: "https://morek9.click",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 카테고리 상품 조회
export async function fetchProductsByCategory(category) {
  const jwtAuthToken = localStorage.getItem("jwtAuthToken");

  if (!jwtAuthToken) {
    throw new Error("토큰이 존재하지 않습니다.");
  }

  const response = await instance.get(`/product/${category}`, {
    headers: { Authorization: `Bearer ${jwtAuthToken}` },
  });

  return response.data;
}

// 전국 재고량 추이 조회 (날짜별 합계)
export async function fetchAverageStockHistoryByProduct(productCode) {
  const jwtAuthToken = localStorage.getItem("jwtAuthToken");

  if (!jwtAuthToken) {
    throw new Error("토큰이 존재하지 않습니다.");
  }

  const response = await instance.get(`/inventory/log/avg/${productCode}`, {
    headers: { Authorization: `Bearer ${jwtAuthToken}` },
  });

  return response.data;
}

// 지점별 재고량 추이 조회 (날짜별 해당 지점 잔량)
export async function fetchStockHistoryByProductAndBranch(productCode, branchName) {
  const jwtAuthToken = localStorage.getItem("jwtAuthToken");

  if (!jwtAuthToken) {
    throw new Error("토큰이 존재하지 않습니다.");
  }

  const encodedBranch = encodeURIComponent(branchName);

  const response = await instance.get(`/inventory/log/${productCode}/${encodedBranch}`, {
    headers: { Authorization: `Bearer ${jwtAuthToken}` },
  });

  return response.data;
}
