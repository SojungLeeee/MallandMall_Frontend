import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart", // 실제 URL이 맞는지 확인
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 상품 목록 조회
export async function fetchFindAllProductCode() {
  try {
    console.log("fetchFindAllProductCode 요청");
    const response = await instance.get("/admin/findAllProductCode");

    console.log("상품 목록 응답:", response); // 응답 확인

    // 응답 데이터 반환
    return response.data;
  } catch (error) {
    console.error("에러 발생:", error); // 에러 디버깅
    throw new Error("fetchFindAllProductCode 예외발생");
  }
}

// 상품 코드 삭제
export async function fetchDeleteProductCode(productCode) {
  try {
    // DELETE 요청 보내기
    const response = await instance.delete(
      `/admin/deleteProductCode/${productCode}`
    );

    console.log("fetchDeleteProductCode.response: ", response);

    // 응답 상태가 200 또는 204인 경우만 정상 처리
    if (response.status !== 200 && response.status !== 204) {
      throw new Error("fetchDeleteProductCode 예외발생");
    }

    return response; // 응답 반환
  } catch (error) {
    console.error("삭제 실패:", error); // 에러 디버깅
    throw new Error("fetchDeleteProductCode 예외발생");
  }
}

// 상품 코드 추가
export async function fetchAddProductCode(product) {
  try {
    //PUT 요청 보내기
    const response = await instance.post(`/admin/addProductCode`, product);

    console.log("fetchAddProductCode.response: ", response);

    if (response.status !== 201) {
      throw new Error("fetchAddProductCode 예외발생");
    }

    return response; // 응답 반환
  } catch (error) {
    console.error("등록 실패:", error); // 에러 디버깅
    throw new Error("fetchAddProductCode 예외발생");
  }
}
