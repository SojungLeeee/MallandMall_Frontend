import axios from "axios";

const instance = axios.create({
  baseURL: "https://morek9.click", // 컨텍스트 경로 포함
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
});
/**
 * Elasticsearch 검색 API 호출 함수
 */
export async function fetchElasticSearch(keyword, limit = 10) {
  console.log("Elasticsearch 검색 요청:", keyword, limit);

  try {
    const response = await instance.get("/product/elastic-search", {
      params: {
        keyword,
        limit,
      },
    });

    console.log("Elasticsearch 검색 응답:", response);
    return response;
  } catch (error) {
    console.error("Elasticsearch 검색 API 오류:", error);
    throw error;
  }
}

/**
 * Elasticsearch 스마트 검색 API 호출 함수
 */
export async function fetchSmartSearch(keyword, limit = 10) {
  console.log("Elasticsearch 스마트 검색 요청:", keyword, limit);

  try {
    const response = await instance.get("/product/smart-search", {
      params: {
        keyword,
        limit,
      },
    });

    console.log("Elasticsearch 스마트 검색 응답:", response);
    return response;
  } catch (error) {
    console.error("Elasticsearch 스마트 검색 API 오류:", error);
    throw error;
  }
}

/**
 * Elasticsearch 제안 검색어 가져오기
 */
export async function fetchSearchSuggestions(keyword, limit = 5) {
  console.log("검색어 제안 요청:", keyword, limit);

  try {
    const response = await instance.get("/product/suggestions", {
      params: {
        query: keyword,
        limit,
      },
    });

    console.log("검색어 제안 응답:", response);
    return response.data;
  } catch (error) {
    console.error("검색어 제안 API 오류:", error);
    return [];
  }
}
