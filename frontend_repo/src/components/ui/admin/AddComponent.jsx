import React, { useState } from "react";
import { fetchAddProductCode } from "../../../api/httpAdminService"; // 상품 추가 API 호출 함수

const AddComponents = ({ onProductAdded }) => {
  // 상태 정의
  const [productCode, setProductCode] = useState("");
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      productCode,
      category,
      productName,
      description,
      price,
      image,
    };

    console.log("상품 데이터 제출:", productData);

    try {
      const response = await fetchAddProductCode(productData); // 상품 코드 추가 API 호출
      console.log("상품 추가 성공:", response);
      alert("상품 코드가 정상적으로 등록되었습니다.");

      // 상품 추가 후 부모 컴포넌트로 갱신 요청
      onProductAdded(); // 부모에게 갱신 요청
      // 폼 초기화
      setProductCode("");
      setCategory("");
      setProductName("");
      setDescription("");
      setPrice("");
      setImage("");
    } catch (error) {
      console.error("상품 추가 실패:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">상품 추가</h2>
      <form onSubmit={handleSubmit}>
        {/* 상품 코드 */}
        <div className="mb-4 flex items-center">
          <label
            htmlFor="productCode"
            className="w-1/3 text-sm font-medium text-gray-700"
          >
            상품 코드
          </label>
          <input
            type="text"
            id="productCode"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            required
            className="mt-1 p-2 w-2/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 카테고리 */}
        <div className="mb-4 flex items-center">
          <label
            htmlFor="category"
            className="w-1/3 text-sm font-medium text-gray-700"
          >
            카테고리
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-1 p-2 w-2/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 상품 이름 */}
        <div className="mb-4 flex items-center">
          <label
            htmlFor="productName"
            className="w-1/3 text-sm font-medium text-gray-700"
          >
            상품 이름
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="mt-1 p-2 w-2/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 상품 설명 */}
        <div className="mb-4 flex items-center">
          <label
            htmlFor="description"
            className="w-1/3 text-sm font-medium text-gray-700"
          >
            상품 설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 p-2 w-2/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 가격 */}
        <div className="mb-4 flex items-center">
          <label
            htmlFor="price"
            className="w-1/3 text-sm font-medium text-gray-700"
          >
            가격
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 p-2 w-2/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 이미지 URL */}
        <div className="mb-4 flex items-center">
          <label
            htmlFor="image"
            className="w-1/3 text-sm font-medium text-gray-700"
          >
            이미지 URL
          </label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="mt-1 p-2 w-2/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-3/5 py-3 mt-6 bg-[#ebe2d5] font-semibold"
        >
          상품 추가
        </button>
      </form>
    </div>
  );
};

export default AddComponents;
