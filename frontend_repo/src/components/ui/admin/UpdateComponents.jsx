import React, { useEffect, useState } from "react";
import { fetchFindAllProductCode } from "../../../api/httpAdminService"; // 경로에 맞게 수정

const UpdateComponents = ({ onCodeSelect }) => {
  const [productCodes, setProductCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // onCodeSelect가 함수인지 확인 (디버깅)
  useEffect(() => {
    if (typeof onCodeSelect !== "function") {
      console.error("onCodeSelect는 함수가 아닙니다. 확인해주세요.");
    }
  }, [onCodeSelect]);

  useEffect(() => {
    const fetchProductCodes = async () => {
      try {
        const data = await fetchFindAllProductCode(); // 모든 상품 목록 가져오기
        const codes = data.map((product) => product.productCode); // productCode만 추출
        setProductCodes(codes); // 상태에 저장
      } catch (err) {
        setError("상품 목록을 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchProductCodes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        수정할 상품 코드
      </h2>
      <div className="flex items-center space-x-4">
        {/* 라벨 */}
        <label
          htmlFor="productCode"
          className="font-medium text-gray-700 w-1/4"
        >
          상품 코드
        </label>

        {/* 상품 코드 선택 드롭다운 */}
        <select
          id="productCode"
          onChange={(e) => onCodeSelect(e.target.value)} // 부모 컴포넌트에 선택된 코드 전달
          className="w-3/4 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">상품 코드를 선택하세요</option>
          {productCodes.map((code, index) => (
            <option key={index} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UpdateComponents;
