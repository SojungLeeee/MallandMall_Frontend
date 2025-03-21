import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchFindCategory } from "../../api/httpCategoryService"; // axios 요청을 가져옵니다.
import ProductCard from "../../components/ui/product/ProductCard"; // ProductCard 컴포넌트 임포트

const CategoryPage = () => {
  const { categoryName } = useParams(); // URL에서 categoryName을 가져옵니다.
  const [products, setProducts] = useState([]); // 상품 데이터를 상태로 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 오류 상태 관리

  // 카테고리명에 해당하는 상품 목록을 가져오는 함수
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchFindCategory(categoryName);
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
  }, [categoryName]);

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
      {/* ProductCard 컴포넌트 사용 */}
      <ProductCard
        products={products}
        loading={loading}
        error={error}
        basePath={`/product`} // 상품 상세 페이지로의 기본 경로 설정
      />
    </div>
  );
};

export default CategoryPage;
