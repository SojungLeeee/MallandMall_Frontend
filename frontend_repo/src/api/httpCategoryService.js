import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart",

  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

//선호 카테고리 저장
export async function fetchAddLikeCategory(likecategory) {
  try {
    const response = await instance.post(
      `/likecategories/saveLikeCategories`,
      likecategory
    );

    console.log("fetchAddLikeCategories.response: ", response);

    if (response.status !== 201) {
      throw new Error("fetchAddLikeCategories 예외발생");
    }

    return response; // 응답 반환
  } catch (error) {
    console.error("등록 실패:", error); // 에러 디버깅
    throw new Error("fetchAddLikeCategories 예외발생");
  }
}

// 찾기
export async function fetchFindCategory(category) {
  console.log("fetchFindCategory 요청");

  const response = await instance.get(`/product/${category}`);

  console.log("fetchFindCategory.response:", response);
  return response;
}
