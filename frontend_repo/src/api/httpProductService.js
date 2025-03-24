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

  const response = await instance.get(
    `/inventory/findByProductCodeAndBranchName/${productCode}/${branchName}`
  );

  console.log("fetchQuantityByProductCodeAndBranchName.response:", response);
  return response;
}
