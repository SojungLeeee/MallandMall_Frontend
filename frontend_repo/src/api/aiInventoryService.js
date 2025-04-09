import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8090/emart/api/inventory-analysis",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 전국 재고 AI 분석 요청
export async function fetchNationalInventoryAiAnalysis(productCode) {
  const jwt = localStorage.getItem("jwtAuthToken");
  if (!jwt) throw new Error("JWT 토큰이 없습니다.");

  const response = await instance.get(`/nationwide/${productCode}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  return response.data;
}

// 지점별 재고 AI 분석 요청
export async function fetchBranchInventoryAiAnalysis(productCode, branchName) {
  const jwt = localStorage.getItem("jwtAuthToken");
  if (!jwt) throw new Error("JWT 토큰이 없습니다.");

  const encodedBranchName = encodeURIComponent(branchName); // 한글 인코딩
  const response = await instance.get(`/${productCode}/${encodedBranchName}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  return response.data;
}
