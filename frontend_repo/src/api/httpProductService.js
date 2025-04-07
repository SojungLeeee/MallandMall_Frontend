import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart",

  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export async function fetchProductFavoriteHome(token) {
  const response = await instance.get(`/product/likecategories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 응답 데이터에서 실제 상품 배열을 추출
  return response.data;
}

// productCode 별 상품 totalQuantity 찾기
export async function fetchtotalQuantityByProductCode(productCode) {
  console.log("fetchtotalQuantityByProductCode 요청");

  const response = await instance.get(
    `/inventory/findByProductCode/${productCode}`
  );

  console.log("fetchtotalQuantityByProductCode.response:", response);
  return response;
}

// productCode, branchName 별 상품 quantity 찾기
export async function fetchQuantityByProductCodeAndBranchName(
  productCode,
  branchName
) {
  console.log("fetchQuantityByProductCodeAndBranchName 요청");

  // 브랜치명을 URL 인코딩 처리
  const encodedBranchName = encodeURIComponent(branchName);

  const response = await instance.get(
    `/inventory/findByProductCodeAndBranchName/${productCode}/${encodedBranchName}`
  );

  console.log("fetchQuantityByProductCodeAndBranchName.response:", response);
  return response;
}

// 상품 전체 조회 (정렬 옵션 포함)
export async function fetchAllProducts(sort = "default") {
  try {
    const response = await instance.get(`/product`, {
      params: {
        sort: sort,
      },
    });
    return response.data;
  } catch (error) {
    console.error("상품 조회 실패:", error);
    throw error;
  }
}

// 상품 차감 요청 (결제 시 호출)
export async function consumeGoods({ productCode, branchName, quantity }) {
  try {
    const response = await instance.delete(`/admin/consume`, {
      // ✅ params는 config 위치에 있어야 함!
      params: {
        productCode,
        branchName,
        quantity,
      },
    });
    return response.data;
  } catch (error) {
    console.error("상품 차감 중 오류 발생:", error.response?.data || error);
    throw error;
  }
}
