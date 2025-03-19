import React, { useEffect, useState } from "react";
import { fetchFindAllProductCode } from "../../api/httpAdminService";

// 상품 리스트를 렌더링하는 컴포넌트
function ProductTable({ products }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left w-1/4">상품코드</th>
            <th className="px-4 py-2 text-left w-1/4">카테고리</th>
            <th className="px-4 py-2 text-left w-1/4">상품명</th>
            <th className="px-4 py-2 text-left w-1/4">가격</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{product.productCode}</td>
              <td className="px-4 py-2">{product.category}</td>
              <td className="px-4 py-2">{product.productName}</td>
              <td className="px-4 py-2">{product.price}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminAllProducts() {
  const [error, setError] = useState(null); // 오류 상태
  const [productData, setProductData] = useState([]); // 상품 데이터를 위한 상태

  useEffect(() => {
    async function fetchProductData() {
      try {
        const productCodeList = await fetchFindAllProductCode();
        console.log("받아온 상품 목록:", productCodeList); // 받아온 데이터를 콘솔에 출력

        if (Array.isArray(productCodeList)) {
          setProductData(productCodeList); // 응답이 배열이면 그 자체를 상태에 저장
        } else {
          throw new Error("상품 데이터가 배열이 아닙니다.");
        }
      } catch (error1) {
        console.log("Error.name:", error1.name);
        console.log("Error.message:", error1.message);
        setError({ mesg: error1.message }); // 오류 발생 시 상태 업데이트
      }
    }

    fetchProductData();
  }, []);

  // 오류가 있으면 화면에 오류 메시지 표시
  if (error) {
    return (
      <div>
        <div>{`Error: ${error.mesg}`}</div>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>
      <hr className="mb-4" />
      {productData.length > 0 ? (
        <ProductTable products={productData} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
