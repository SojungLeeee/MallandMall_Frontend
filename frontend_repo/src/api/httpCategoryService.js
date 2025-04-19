import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "https://morek9.click",

  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

//선호 카테고리 저장
export async function fetchAddLikeCategory(likecategory) {
  try {
    const response = await instance.post(`/likecategories/saveLikeCategories`, likecategory);

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

//선호 카테고리 수정을 위해 userId로 선호 카테고리 확인
export async function fetchLikeCategoriesByUserId(userId) {
  console.log("fetchFindCategory 요청");

  const response = await instance.get(`/likecategories/showLikeCategories/${userId}`);

  console.log("fetchLikeCategoriesByUserId.response:", response);
  return response;
}

//선호 카테고리에서 체크 해제되면 삭제
export async function fetchDeleteCategories(userId, category) {
  try {
    // DELETE 요청 보내기
    const response = await instance.delete(`/likecategories/deleteLikeCategories/${userId}/${category}`);

    console.log("fetchDeleteCategories.response: ", response);

    // 응답 상태가 200 또는 204인 경우만 정상 처리
    if (response.status !== 200 && response.status !== 204) {
      throw new Error("fetchDeleteCategories 예외발생");
    }

    return response; // 응답 반환
  } catch (error) {
    console.error("삭제 실패:", error); // 에러 디버깅
    throw new Error("fetchDeleteCategories 예외발생");
  }
}

// 카테고리로 이벤트 찾기
export async function fetchFindLikeCategories(userId, token) {
  const response = await instance.get(`event/favorites/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
