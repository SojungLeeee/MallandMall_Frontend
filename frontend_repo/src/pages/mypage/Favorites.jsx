import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ui/product/ProductCard";
import { getAuthToken } from "../../context/tokenProviderService";
import { fetchProductFavoriteHome } from "../../api/httpProductService"; // API 호출

/**
 * 모든 상품을 보여주는 Products 페이지 컴포넌트
 * ProductList 컴포넌트를 활용하여 리팩토링
 */

const Favorites = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = getAuthToken(); // 토큰 가져오기
  console.log("Auth Token:", token);

  useEffect(() => {
    // 상품 데이터 불러오기
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProductFavoriteHome(token);
        console.log("Fetched Products:", data); // 응답 데이터 확인
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("상품을 불러오는 중 오류 발생:", err);
        setError("상품을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      {/* ProductList 컴포넌트 사용 */}
      <ProductCard
        products={products}
        loading={loading}
        error={error}
        basePath="/product"
        columns={2}
        containerStyle={{
          backgroundColor: "#fff7f0",
          padding: "0.5rem",
        }}
      />
    </div>
  );
};

export default Favorites;
