import axios from "axios";

const API_BASE_URL = "http://localhost:8090/emart/api";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 리뷰 분석 API
export const getReviewAnalysis = async (productCode) => {
  try {
    const response = await api.get(`/review-analysis/${productCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching review analysis:", error);
    throw error;
  }
};

// 상품 정보 가져오기 API
export const getProduct = async (productCode) => {
  try {
    const response = await api.get(`/product/detail/${productCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// 상품 리뷰 가져오기 API
export const getProductReviews = async (productCode) => {
  try {
    const response = await api.get(`/review/product/${productCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw error;
  }
};

export default api;
