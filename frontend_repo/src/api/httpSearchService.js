import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart", // 컨텍스트 경로 포함
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
});

// 기본 키워드 검색 함수
export async function fetchSearchProducts(productName) {
  console.log("fetchSearchProducts 요청");

  const response = await instance.get(`/product/search/${productName}`);

  console.log("fetchSearchProducts.response:", response);
  return response;
}

// 벡터 검색 제안 가져오기
export async function fetchVectorSuggestions(query, limit = 5) {
  console.log("벡터 검색 제안 요청:", query);

  try {
    // 경로에서 /emart 제거 (이미 baseURL에 포함되어 있음)
    const response = await instance.get(`/api/vector-search/suggestions`, {
      params: {
        query,
        limit,
      },
    });

    console.log("벡터 검색 제안 응답:", response);
    return response.data;
  } catch (error) {
    console.error("벡터 검색 제안 API 호출 실패:", error);
    throw error;
  }
}

// 이하 다른 함수들도 마찬가지로 이미 baseURL에 /emart가 포함되어 있다고 가정
