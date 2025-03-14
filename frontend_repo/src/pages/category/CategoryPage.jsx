import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchFindCategory } from "../../api/httpCategoryService"; // axios 요청을 가져옵니다.

const CategoryPage = () => {
  const { categoryName } = useParams(); // URL에서 categoryName을 가져옵니다.
  const [products, setProducts] = useState([]); // 상품 데이터를 상태로 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 오류 상태 관리

  // 카테고리명에 해당하는 상품 목록을 가져오는 함수
  useEffect(() => {
    // fetchFindCategory 함수를 사용하여 상품 목록을 가져옵니다.
    const fetchProducts = async () => {
      try {
        const response = await fetchFindCategory(categoryName); // HTTP 요청을 보내고 응답을 받음
        if (response && response.data) {
          setProducts(response.data); // 응답 데이터로 상품 목록을 설정
        } else {
          throw new Error("상품 목록을 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        setError(error.message); // 오류 발생 시 오류 메시지 설정
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchProducts(); // 컴포넌트 마운트 시 상품 목록을 가져옵니다.
  }, [categoryName]); // 카테고리가 변경될 때마다 API를 새로 호출

  // 로딩 중일 때 보여줄 로딩 메시지
  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  // 오류가 있을 경우 오류 메시지 표시
  if (error) {
    return (
      <div className="text-center text-xl font-semibold text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        {categoryName} 상품 목록
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
        {/* 상품 목록을 반복문으로 렌더링 */}
        {products.length === 0 ? (
          <p className="text-center text-xl font-semibold">
            이 카테고리에는 상품이 없습니다.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.productCode}
              className="border p-4 rounded-lg bg-white shadow-md"
            >
              <img
                src={product.image}
                alt={product.productName}
                className="w-52 h-52  object-cover rounded-t-lg px-2 py-2"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {product.productName}
              </h2>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <p className="text-lg font-bold mt-2">{product.price} 원</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
