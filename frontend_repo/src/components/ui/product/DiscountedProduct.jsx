import React, { useState, useEffect } from "react";
import { fetchDiscountedProducts } from "../../../api/httpChartService";
import ProductCard from "./ProductCard";
import OfflinePriceChart from "../chart/OfflinePriceChart";

const DiscountedProducts = () => {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductCode, setSelectedProductCode] = useState(null); // 선택된 상품의 productCode

  useEffect(() => {
    const loadDiscountedProducts = async () => {
      try {
        const response = await fetchDiscountedProducts(); // 백엔드에서 할인된 상품 목록 요청
        setDiscountedProducts(response);
      } catch (err) {
        setError("상품 목록을 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadDiscountedProducts();
  }, []); // 컴포넌트 최초 렌더링 시에만 실행

  const handleProductClick = (productCode) => {
    setSelectedProductCode(productCode);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-5">선호 카테고리 기반 할인된 상품</h2>
      <ProductCard
        products={discountedProducts}
        loading={loading}
        error={error}
        renderItem={(product) => (
          <div
            className="bg-white border rounded-sm shadow-md overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition h-full cursor-pointer"
            onClick={() => handleProductClick(product.productCode)}
          >
            <div className="w-full max-h-72 border rounded-s flex items-center justify-center">
              <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-start gap-2 mt-3 flex-grow">
              <h3 className="text-lg font-semibold text-center">{product.productName}</h3>
              <p className="text-lg font-bold text-red-500 text-left">{product.price.toLocaleString()}원</p>
            </div>
          </div>
        )}
      />
      {selectedProductCode && (
        <div className="mt-8">
          {/* 여기에서 selectedProductCode를 통해 가격 변동 차트를 보여주는 컴포넌트를 렌더링 */}
          <OfflinePriceChart productCode={selectedProductCode} />
        </div>
      )}
    </div>
  );
};

export default DiscountedProducts;
