import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        {categoryName} 상품 목록
      </h1>
      <div className="grid grid-cols-2 gap-4">
        {/* 상품 목록을 반복문으로 렌더링 */}
        {products.length === 0 ? (
          <p className="text-center text-xl font-semibold">
            이 카테고리에는 상품이 없습니다.
          </p>
        ) : (
          products.map((product) => (
            <Link
              to={`/product/${product.productCode}`}
              key={product.productCode}
              className="cursor-pointer"
            >
              <div className="bg-white border rounded-md shadow-md overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition h-full">
                {/* 이미지 컨테이너 */}
                <div className="w-full max-h-72 border rounded-lg bg-yellow-400 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-full object-cover p-4"
                  />
                </div>
                <div className="text-center flex flex-col gap-2 mt-3">
                  <h3 className="text-lg font-semibold">
                    {product.productName}
                  </h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-lg font-bold text-red-500">
                    {product.price.toLocaleString()}원
                  </p>
                  <p className="text-sm text-yellow-500">
                    ⭐ {product.averageRating}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
