import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "https://morek9.click", // 컨텍스트 경로 포함
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
});

// 기본 키워드 검색 함수
export async function fetchSearchProducts(productName) {
  console.log("fetchSearchProducts 요청");

  // 콤마(,)가 포함되어 있으면 복수의 productCode로 인식하여 다른 API 호출
  if (productName && productName.includes(",")) {
    console.log("다중 제품 조회 요청:", productName);
    return fetchMultipleProducts(productName);
  }

  const response = await instance.get(`/product/search/${productName}`);

  console.log("fetchSearchProducts.response:", response);
  return response;
}

// 다중 제품 정보 조회 함수 (추가됨)
export async function fetchMultipleProducts(productCodes) {
  console.log("다중 제품 정보 조회 요청:", productCodes);

  try {
    const response = await instance.get(`/product/multiple`, {
      params: {
        productCodes: productCodes,
      },
    });

    console.log("다중 제품 정보 응답:", response);
    return response;
  } catch (error) {
    console.error("다중 제품 정보 API 호출 실패:", error);
    return { status: 500, data: [] };
  }
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

/**
 * 실시간 인기 검색어 가져오기
 * @param {number} limit 검색어 개수 (기본값: 10)
 * @returns {Promise<Array>} 인기 검색어 배열
 */
export async function fetchTrendingKeywords(limit = 10) {
  console.log("실시간 인기 검색어 요청, limit:", limit);

  try {
    const response = await instance.get(`/api/search/trending-keywords`, {
      params: {
        limit,
      },
    });

    console.log("실시간 인기 검색어 응답:", response);
    return response.data;
  } catch (error) {
    console.error("인기 검색어 API 호출 실패:", error);
    throw error;
  }
}

/**
 * 검색어 기록하기 (검색 실행 시 호출)
 * @param {string} keyword 검색어
 * @returns {Promise<Object>} 성공 여부
 */
export async function recordSearchKeyword(keyword) {
  console.log("검색어 기록 요청:", keyword);

  try {
    const response = await instance.post("/api/search/record-keyword", {
      keyword,
    });

    console.log("검색어 기록 응답:", response);
    return response.data;
  } catch (error) {
    console.error("검색어 기록 API 호출 실패:", error);
    // 실패해도 검색 프로세스는 계속 진행되도록 조용히 실패
    return { success: false };
  }
}
