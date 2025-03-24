import React, { useState } from "react";
import ToggleComponents from "../../components/ui/admin/ToggleComponents"; // 경로 확인
import DetailComponents from "../../components/ui/admin/DetailComponents"; // 경로 확인 (파일명 수정)
import {
  fetchFindAllProductCode,
  fetchFindProductCode,
  fetchUpdateProductCode,
} from "../../api/httpAdminService"; // 경로 확인

const AdminUpdateProducts = () => {
  const [selectedCode, setSelectedCode] = useState(""); // 선택된 상품 코드를 상태로 관리
  const [isUpdated, setIsUpdated] = useState(false); // 수정 성공 여부 상태

  // 상품 코드가 선택되었을 때 호출되는 함수
  const handleCodeSelect = (code) => {
    console.log("선택된 상품 코드:", code);
    setSelectedCode(code); // 선택된 상품 코드 업데이트
    setIsUpdated(false); // 새 상품 선택 시 업데이트 상태 초기화
  };

  // 수정된 상품 정보를 처리하는 함수
  const handleProductUpdate = async (updatedProductDetail) => {
    try {
      console.log("상품 수정 시도:", updatedProductDetail);

      // 상품 코드 수정 API 호출
      const response = await fetchUpdateProductCode(
        selectedCode,
        updatedProductDetail
      );

      console.log("상품 수정 응답:", response);

      if (response) {
        setIsUpdated(true); // 수정 완료 표시
        // alert는 DetailsComponent 내부에서 처리됨
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
      <ToggleComponents
        onItemSelect={handleCodeSelect}
        fetchItems={fetchFindAllProductCode}
        extractCode={(product) => product.productCode}
        title="수정할 상품 코드"
        labelText="상품 코드"
        placeholderText="상품 코드를 선택하세요"
      />
      <hr className="my-4" />

      {/* 선택된 상품 코드가 있을 때, 해당 상품 코드의 상세 정보 컴포넌트 표시 */}
      {selectedCode && (
        <DetailComponents
          itemCode={selectedCode}
          fetchItemDetails={fetchFindProductCode}
          onItemUpdate={handleProductUpdate}
          title="상품 상세 정보"
          itemType="상품"
          submitText="수정하기"
          successText="상품 수정이 완료되었습니다."
        />
      )}

      {/* 수정 성공 메시지 */}
      {isUpdated && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          상품 정보가 성공적으로 업데이트되었습니다.
        </div>
      )}
    </div>
  );
};

export default AdminUpdateProducts;
