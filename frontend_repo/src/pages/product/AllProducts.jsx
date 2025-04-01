import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ui/product/ProductCard";
import { fetchProductHome } from "../../api/httpMemberService"; // API 호출
import SemiWideComponent from "../../components/SemiWideComponent";
import { useNavigate } from "react-router-dom"; // Navigate가 아닌 useNavigate 임포트

/**
 * 모든 상품을 보여주는 Products 페이지 컴포넌트
 * ProductList 컴포넌트를 활용하여 리팩토링
 */

const AllProducts = () => {
  const navigate = useNavigate(); // 컴포넌트 내부에서 useNavigate 훅 호출
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 재고조회로 이동하는 함수
  const handleClick = () => {
    navigate("/map"); // Navigate가 아닌 navigate 함수 사용
  };

  useEffect(() => {
    // 상품 데이터 불러오기
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProductHome();
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
    <div>
      <div className="mb-2">
        <div className="flex flex-col md:flex-row justify-center ml-6">
          <div className="w-full md:w-1/2">
            <SemiWideComponent
              title="재고찾기"
              subtitle="내 근처의 매장 찾기"
              noMargin={true}
              onClick={handleClick} // 여기에 클릭 핸들러 연결
            />
          </div>
          <div className="w-full md:w-1/2">
            <SemiWideComponent
              title="매장안내"
              subtitle="가까운 매장 찾기"
              noMargin={true}
            />
          </div>
        </div>
      </div>

      {/* ProductCard 섹션 */}
      <div className="mt-0">
        <ProductCard
          products={products}
          loading={loading}
          error={error}
          basePath="/product"
          columns={2}
          containerStyle={{
            backgroundColor: "white",
            padding: "0.5rem",
          }}
        />
      </div>
    </div>
  );
};

export default AllProducts;
