import React, { useEffect, useState } from "react";
import {
  fetchFindAllProductCode,
  fetchAddProductCode,
} from "../../api/httpAdminService";
import AllProductCodes from "../../components/ui/admin/AllProductCodes";
import GenericForm from "../../components/ui/admin/AddComponents"; // 재사용 가능한 양식 컴포넌트 import

export default function AdminAllProducts() {
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState([]);

  // 상품 추가 양식을 위한 상태 및 필드 정의
  const [productValues, setProductValues] = useState({
    productCode: "",
    category: "",
    productName: "",
    description: "",
    price: "",
    image: "",
  });

  // 상품 양식 필드 정의
  const productFields = [
    { id: "productCode", label: "상품 코드", type: "text" },
    { id: "category", label: "카테고리", type: "text" },
    { id: "productName", label: "상품 이름", type: "text" },
    { id: "description", label: "상품 설명", type: "textarea" },
    { id: "price", label: "가격", type: "number" },
    { id: "image", label: "이미지 URL", type: "text" },
  ];

  // 상품 데이터를 가져오는 함수
  const fetchProductData = async () => {
    try {
      const productCodeList = await fetchFindAllProductCode();
      console.log("받아온 상품 목록:", productCodeList);

      if (Array.isArray(productCodeList)) {
        setProductData(productCodeList);
      } else {
        throw new Error("상품 데이터가 배열이 아닙니다.");
      }
    } catch (error1) {
      console.log("Error.name:", error1.name);
      console.log("Error.message:", error1.message);
      setError({ mesg: error1.message });
    }
  };

  // 상품 추가 처리 함수
  const handleProductSubmit = async (values) => {
    try {
      await fetchAddProductCode(values); // 상품 추가 API 호출

      // 폼 초기화
      setProductValues({
        productCode: "",
        category: "",
        productName: "",
        description: "",
        price: "",
        image: "",
      });

      await fetchProductData(); // 상품 목록을 새로 불러옵니다.
    } catch (error) {
      console.log("상품 추가 실패:", error);
      setError({ mesg: "상품 추가 실패" });
    }
  };

  useEffect(() => {
    fetchProductData(); // 컴포넌트가 마운트되었을 때 상품 데이터 가져오기
  }, []);

  // 오류가 있으면 화면에 오류 메시지 표시
  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-100 rounded">
        <div>{`Error: ${error.mesg}`}</div>
      </div>
    );
  }

  // 행 렌더링 함수 정의
  const renderRow = (product, index) => {
    return (
      <tr key={index}>
        <td className="px-3 py-2">{product.productCode}</td>
        <td className="px-3 py-2">{product.category}</td>
        <td className="px-3 py-2">{product.productName}</td>
        <td className="px-3 py-2">{product.price}</td>
        <td className="px-3 py-2">{product.image}</td>
      </tr>
    );
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">상품 코드 목록</h2>
      <hr className="mb-4" />

      {/* 재사용 가능한 상품 추가 양식 */}
      <div className="mb-6">
        <GenericForm
          title="상품 추가"
          fields={productFields}
          values={productValues}
          setValues={setProductValues}
          onSubmit={handleProductSubmit}
          submitButtonText="상품 추가"
          submitButtonClass="bg-[#ebe2d5] hover:bg-[#ddd3c6]"
        />
      </div>

      <hr className="mb-4" />

      {/* 상품 목록 표시 */}
      {productData.length > 0 ? (
        <AllProductCodes
          data={productData}
          dataType="product"
          renderRow={renderRow}
          showDeleteCheckbox={false}
          text1="상품코드"
          text2="카테고리"
          text3="상품명"
          text4="가격"
          text5="삭제"
        />
      ) : (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>로딩 중...</p>
        </div>
      )}
    </div>
  );
}
