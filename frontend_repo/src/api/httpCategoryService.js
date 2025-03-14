import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart",

  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 찾기
export async function fetchFindCategory(category) {
  console.log("fetchFindCategory 요청");

  const response = await instance.get(`/product/${category}`);

  console.log("fetchFindCategory.response:", response);
  return response;
}
