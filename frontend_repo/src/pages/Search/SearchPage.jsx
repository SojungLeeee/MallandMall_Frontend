import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchSearchProducts } from "../../api/httpSearchService"; // axios 요청을 가져옵니다.
import ProductCard from "../../components/ui/product/ProductCard"; // ProductCard 컴포넌트 import
import RealTimeKeywords from "./keyword/RealTimeKeywords"; // 실시간 검색어 컴포넌트 추가

const SearchPage = () => {
  const { productName } = useParams(); // URL에서 productName을 가져옵니다.
  const [products, setProducts] = useState([]); // 상품 데이터를 상태로 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 오류 상태 관리

  // 카테고리명에 해당하는 상품 목록을 가져오는 함수
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchSearchProducts(productName); // HTTP 요청을 보내고 응답을 받음
        console.log("fetchSearchProducts.response:", response); // 응답 확인

        if (response.status === 204) {
          // 204 상태 코드일 경우 데이터가 없음을 알리고 빈 배열을 설정
          setProducts([]);
        } else if (response && response.data) {
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
  }, [productName]); // 카테고리가 변경될 때마다 API를 새로 호출

  // 실시간 검색어 클릭 핸들러
  const handleKeywordClick = (keyword) => {
    // 현재 페이지에서 새로운 검색을 위해 URL 이동
    window.location.href = `/search/${encodeURIComponent(keyword)}`;
  };

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
      <h1 className="text-xl font-bold text-center mb-6 text-black bg-white py-3 border-b-2 shadow-sm">
        '<span className="text-indigo-600">{productName}</span>' 키워드를
        포함하는 상품 목록
      </h1>

      {/* 실시간 인기 검색어 섹션 추가 */}
      <div className="mb-6">
        <RealTimeKeywords limit={10} onKeywordClick={handleKeywordClick} />
      </div>

      {/* 상품이 없을 때 화면 전체를 차지하게 표시 */}
      {products.length === 0 ? (
        <div className="text-center text-base font-semibold h-full flex items-center justify-center bg-white text-gray-800 p-8 rounded-sm border border-gray-300 shadow-sm">
          이 키워드를 포함하는 상품명이 없습니다.
        </div>
      ) : (
        <div>
          <ProductCard
            products={products} // 상품 데이터 전달
            loading={loading} // 로딩 상태 전달
            error={error} // 에러 상태 전달
            basePath="/product" // 기본 경로 지정
            columns={2} // 그리드 열 개수 지정
          />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
