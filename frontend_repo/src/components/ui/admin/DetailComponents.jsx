import React, { useEffect, useState } from "react";
import { fetchFindProductCode } from "../../../api/httpAdminService"; // 경로에 맞게 수정

const DetailsComponents = ({ productCode, onProductUpdate }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 입력 필드 수정용 상태
  const [editedProductDetails, setEditedProductDetails] = useState({
    productName: "",
    category: "",
    description: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await fetchFindProductCode(productCode); // 상품 코드에 대한 상세 정보 가져오기
        setProductDetails(data); // 상태에 저장
        setEditedProductDetails({
          productName: data.productName,
          category: data.category,
          description: data.description,
          price: data.price,
          image: data.image,
        });
      } catch (err) {
        setError("상품 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    if (productCode) {
      fetchProductDetails();
    }
  }, [productCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onProductUpdate(editedProductDetails); // 부모로 수정된 데이터 전달
    alert("수정되었습니다!");

    // 폼 데이터 초기화
    setEditedProductDetails({
      productName: "",
      category: "",
      description: "",
      price: "",
      image: "",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!productDetails) {
    return <div>상품 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-gray-700 mb-2">
        {productCode}에 대한 상세 정보
      </h3>

      <form onSubmit={handleSubmit}>
        {/* 상품 이름 */}
        <div className="mb-2">
          <label className="text-lg text-gray-800">상품명: </label>
          <input
            type="text"
            name="productName"
            value={editedProductDetails.productName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* 카테고리 */}
        <div className="mb-2">
          <label className="text-lg text-gray-800">카테고리: </label>
          <input
            type="text"
            name="category"
            value={editedProductDetails.category}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* 상품 설명 */}
        <div className="mb-2">
          <label className="text-lg text-gray-800">상세 설명: </label>
          <textarea
            name="description"
            value={editedProductDetails.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* 가격 */}
        <div className="mb-2">
          <label className="text-lg text-gray-800">가격: </label>
          <input
            type="number"
            name="price"
            value={editedProductDetails.price}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* 이미지 */}
        <div className="mb-2">
          <label className="text-lg text-gray-800">상품 이미지 URL: </label>
          <input
            type="text"
            name="image"
            value={editedProductDetails.image}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* 수정 버튼 */}
        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailsComponents;
