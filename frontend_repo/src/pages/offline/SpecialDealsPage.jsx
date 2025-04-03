"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDiscountedProducts } from "../../api/httpChartService"; // 할인된 상품 API 요청
import ProductCard from "../../components/ui/product/ProductCard"; // 기존 ProductCard 사용

const SpecialDealsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 할인된 상품과 가격을 가져오는 함수
  useEffect(() => {
    const fetchDiscounted = async () => {
      try {
        setLoading(true);
        // 할인된 상품 API 요청
        const data = await fetchDiscountedProducts();

        if (data && data.length > 0) {
          // 상품마다 현재 가격을 설정
          const updatedProducts = data.map((product) => {
            return {
              ...product,
              currentPrice: product.price, // 현재 가격은 이미 price 필드에 존재
            };
          });
          setProducts(updatedProducts); // 상품 업데이트
          setError(null);
        } else {
          setError("할인된 상품이 없습니다.");
        }
      } catch (err) {
        console.error("할인된 상품을 불러오는 중 오류 발생:", err);
        setError("할인 상품을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounted();
  }, []);

  const handleProductClick = (productCode) => {
    navigate(`/product-chart/${productCode}`); // 차트 페이지로 이동
  };

  return (
    <div className="relative p-4 bg-gradient-to-b from-red-50 to-white min-h-screen">
      {/* 헤더 섹션 */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2 text-red-800">
          오프라인 초특가 상품
        </h1>
        <p className="text-sm text-gray-600">
          한정 수량으로 제공되는 특별 할인 상품
        </p>
      </div>

      {/* 초특가 문구 - 화면 우측 상단 고정 */}
      <div className="absolute top-0 right-0 m-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse">
        초특가 대할인중!
      </div>

      {/* 상품 리스트 표시 */}
      <div className="product-list grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-full mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-red-500 text-lg mb-2">⚠️</div>
            <p className="text-gray-700">{error}</p>
            <button
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              다시 시도
            </button>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.productCode}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 relative transition-transform duration-200 active:scale-[0.98] hover:shadow-lg"
              onClick={() => handleProductClick(product.productCode)}
            >
              {/* 할인 배지 */}
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-md z-10 shadow-sm">
                특가 할인
              </div>

              {/* 상품 카드 래퍼 */}
              <div className="w-full p-3">
                <div className="w-full h-48">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="border w-full h-full object-contain" // object-contain으로 수정
                  />
                </div>
                <h3 className="text-lg font-semibold text-center mt-3">
                  {product.productName}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {product.description}
                </p>
                <p className="text-xl font-bold text-red-500 text-center mt-2">
                  {product.price.toLocaleString()}원
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 하단 정보 */}
      <div className="mt-6 p-3 bg-white rounded-lg shadow-sm text-center text-xs text-gray-500 max-w-[390px] mx-auto">
        <p className="mb-1">
          * 상품 재고는 한정되어 있으며, 조기 품절될 수 있습니다.
        </p>
        <p>* 오프라인 매장에서만 적용되는 가격입니다.</p>
      </div>
    </div>
  );
};

export default SpecialDealsPage;
