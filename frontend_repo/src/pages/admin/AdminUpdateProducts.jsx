import React, { useState } from "react";
import UpdateComponents from "../../components/ui/admin/UpdateComponents"; // 경로에 맞게 수정
import ProductDetails from "../../components/ui/admin/ProductDetails"; // 경로에 맞게 수정
import { fetchUpdateProductCode } from "../../api/httpAdminService"; // 경로에 맞게 수정

const AdminUpdateProducts = () => {
  const [selectedCode, setSelectedCode] = useState(""); // 선택된 상품 코드를 상태로 관리
  const [updatedProduct, setUpdatedProduct] = useState(null); // 수정된 상품 정보
  const [isUpdated, setIsUpdated] = useState(false); // 수정 성공 여부 상태

  // 상품 코드가 선택되었을 때 호출되는 함수
  const handleCodeSelect = (code) => {
    setSelectedCode(code); // 선택된 상품 코드 업데이트
  };

  // 수정된 상품 정보를 처리하는 함수
  const handleProductUpdate = async (updatedProductDetails) => {
    try {
      // 상품 코드 수정 API 호출
      const response = await fetchUpdateProductCode(
        selectedCode,
        updatedProductDetails
      );

      if (response.status === 200) {
        setUpdatedProduct(updatedProductDetails); // 수정된 정보 업데이트
        setIsUpdated(true); // 수정 완료 표시
        alert("상품 수정이 완료되었습니다.");
      }
    } catch (error) {
      console.error("상품 수정 오류:", error);
      alert("상품 수정에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">상품 수정</h1>
      <hr className="my-4" />

      {/* 상품 코드 목록 컴포넌트 */}
      <UpdateComponents onCodeSelect={handleCodeSelect} />
      <hr className="my-4" />

      {/* 선택된 상품 코드가 있을 때, 해당 상품 코드의 상세 정보 컴포넌트 표시 */}
      {selectedCode && (
        <ProductDetails
          productCode={selectedCode}
          onProductUpdate={handleProductUpdate} // 수정된 데이터를 부모 컴포넌트로 전달
        />
      )}
    </div>
  );
};

export default AdminUpdateProducts;
