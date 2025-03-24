import React, { useEffect, useState } from "react";
import {
  fetchFindAllInventory,
  fetchAddGoods,
} from "../../api/httpAdminService";
import ListComponents from "../../components/ui/admin/ListComponents";
import GenericForm from "../../components/ui/admin/AddComponents"; // 재사용 가능한 양식 컴포넌트 import

export default function AdminAllProducts() {
  const [error, setError] = useState(null); // 오류 상태
  const [inventoryData, setInventoryData] = useState([]); // 재고 데이터 상태

  // 상품 추가 양식을 위한 상태 및 필드 정의
  const [goodsValues, setGoodsValues] = useState({
    productCode: "",
    branchName: "",
    expirationDate: "",
  });

  // 상품 양식 필드 정의
  const productFields = [
    { id: "productCode", label: "상품 코드", type: "text" },
    { id: "branchName", label: "지점명", type: "text" },
    { id: "expirationDate", label: "유통기한", type: "text" },
  ];

  // 재고 데이터를 가져오는 함수
  const fetchInventoryData = async () => {
    try {
      const inventoryList = await fetchFindAllInventory();
      console.log("받아온 재고 목록:", inventoryList);

      if (Array.isArray(inventoryList)) {
        setInventoryData(inventoryList);
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
  const handleGoodsSubmit = async (values) => {
    try {
      await fetchAddGoods(values); // 상품 추가 API 호출

      alert("상품이 정상적으로 추가되었습니다.");
      setError(null);
      // 폼 초기화
      setGoodsValues({
        productCode: "",
        branchName: "",
        expirationDate: "",
      });

      await fetchInventoryData(); // 재고 목록을 새로 불러옵니다.
    } catch (error) {
      console.log("상품 추가 실패:", error);
      setError({
        mesg: "'상품코드' 또는 '지점'이 존재하지 않습니다. 다시 확인해주세요.",
      });
    }
  };

  useEffect(() => {
    fetchInventoryData(); // 컴포넌트가 마운트되었을 때 재고 데이터 가져오기
  }, []);

  // 오류가 있으면 화면에 오류 메시지 표시
  const errorMessage =
    error && error.mesg ? (
      <div className="p-4 text-red-500 bg-red-100 rounded mb-4">
        <div>{`${error.mesg}`}</div>
      </div>
    ) : null;

  // 행 렌더링 함수 정의
  const renderRow = (inventory, index) => {
    return (
      <tr key={index}>
        <td className="px-3 py-2">{inventory.productCode}</td>
        <td className="px-3 py-2">{inventory.quantity}</td>
        <td className="px-3 py-2">{inventory.branchName}</td>
      </tr>
    );
  };

  return (
    <div className="w-full p-4">
      {/* 오류 메시지 표시 */}
      {errorMessage}

      {/* 재사용 가능한 상품 추가 양식 */}
      <div className="mb-6">
        <GenericForm
          title="개별 상품 추가"
          fields={productFields}
          values={goodsValues}
          setValues={setGoodsValues}
          onSubmit={handleGoodsSubmit}
          submitButtonText="개별 상품 추가"
          submitButtonClass="bg-[#ebe2d5] hover:bg-[#ddd3c6]"
        />
      </div>

      <hr className="mb-4" />

      {/* 상품 목록 표시 */}
      {inventoryData.length > 0 ? (
        <ListComponents
          data={inventoryData} // 재고 데이터
          dataType="inventory" // 데이터 타입
          renderRow={renderRow} // 행 렌더링 함수
          showDeleteCheckbox={false} // 삭제 체크박스 여부
          text1="상품코드" // 헤더 텍스트
          text2="수량"
          text3="지점명"
        />
      ) : (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>로딩 중...</p>
        </div>
      )}
    </div>
  );
}
