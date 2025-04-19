import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "https://morek9.click", // 실제 URL이 맞는지 확인
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 상품 코드 1개 조회
export async function fetchFindProductCode(productCode) {
  try {
    console.log("fetchFindProductCode 요청");
    const response = await instance.get(`/admin/findByProductCode/${productCode}`);

    console.log("상품 목록 응답:", response); // 응답 확인

    // 응답 데이터 반환
    return response.data;
  } catch (error) {
    console.error("에러 발생:", error); // 에러 디버깅
    throw new Error("fetchFindProductCode 예외발생");
  }
}

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
    const response = await instance.delete(`/admin/deleteProductCode/${productCode}`);

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

// 개별 상품 목록 조회
export async function fetchFindAllGoods() {
  try {
    console.log("fetchFindAllGoods 요청");
    const response = await instance.get("/admin/findAllGoods");

    console.log("개별 상품 목록 응답:", response); // 응답 확인

    // 응답 데이터 반환
    return response.data;
  } catch (error) {
    console.error("에러 발생:", error); // 에러 디버깅
    throw new Error("fetchFindAllGoods 예외발생");
  }
}

// 여러 상품 삭제
export async function fetchDeleteGoods(goodsIds) {
  try {
    const response = await instance.post(`/admin/deleteGoods`, goodsIds); // goodsIds는 배열

    console.log("fetchDeleteGoods.response: ", response);

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("fetchDeleteGoods 예외발생");
    }

    return response; // 삭제 성공 응답 반환
  } catch (error) {
    console.error("삭제 실패:", error);
    throw new Error("fetchDeleteGoods 예외발생");
  }
}

// 개별 상품 추가가
export async function fetchAddGoods(goods) {
  try {
    //PUT 요청 보내기
    const response = await instance.post(`/admin/addGoods`, goods);

    console.log("fetchAddGoods.response: ", response);

    if (response.status !== 201) {
      throw new Error("fetchAddGoods 예외발생");
    }

    return response; // 응답 반환
  } catch (error) {
    console.error("등록 실패:", error); // 에러 디버깅
    throw new Error("fetchAddGoods 예외발생");
  }
}

// 인벤토리 목록 조회 (재고)
export async function fetchFindAllInventory() {
  try {
    console.log("fetchFindAllInventory 요청");
    const response = await instance.get("/inventory/findAllInventory");

    console.log("재고 목록 조회:", response); // 응답 확인

    // 응답 데이터 반환
    return response.data;
  } catch (error) {
    console.error("에러 발생:", error); // 에러 디버깅
    throw new Error("fetchFindAllInventory 예외발생");
  }
}

// 상품 코드 수정
export async function fetchUpdateProductCode(productCode, updatedProduct) {
  try {
    // PUT 요청 보내기 (상품 코드 수정)
    const response = await instance.put(`/admin/updateProductCode/${productCode}`, updatedProduct);

    console.log("fetchUpdateProductCode.response: ", response);

    // 응답 상태가 200이면 정상 처리
    if (response.status !== 201) {
      throw new Error("fetchUpdateProductCode 예외발생");
    }

    return response; // 응답 반환
  } catch (error) {
    console.error("수정 실패:", error); // 에러 디버깅
    throw new Error("fetchUpdateProductCode 예외발생");
  }
}
