import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProductHome } from "../../api/httpMemberService";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  //  상품 데이터 가져오기
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProductHome(); //  API 호출 통합
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  //  스크롤 이벤트 핸들러 (네비게이션 바 숨기기)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="flex flex-col items-center bg-[#f8f5e6] min-h-screen">
      {/* 네비게이션 바 */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-all duration-300 ${
          showNavbar ? "top-0" : "-top-16"
        }`}
      >
        <div className="p-4 text-lg font-bold text-center">네비게이션 바</div>
      </nav>

      {/* 로딩 상태 */}
      {loading && <p className="mt-20 text-center text-xl">Loading products...</p>}

      {/* 에러 상태 */}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ 상품 그리드 */}
      <div className="mt-20 grid grid-cols-2 gap-4 max-w-4xl w-full p-4">
        {products.map((product) => (
          <div
            key={product.productCode}
            className="bg-white border rounded-md shadow-md overflow-hidden flex flex-col items-center p-4"
          >
            {/* 상품 이미지 */}
            <div className="w-full h-44 bg-green-200 flex items-center justify-center">
              <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
            </div>

            {/* 상품 정보 */}
            <div className="text-center flex flex-col gap-2 mt-3">
              <h3 className="text-lg font-semibold">{product.productName}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-lg font-bold text-red-500">{product.price.toLocaleString()}원</p>
              <p className="text-sm text-yellow-500">⭐ {product.averageRating}</p>

              {/* ✅ 상세 페이지 이동 버튼 */}
              <Link
                to={`/product/${product.productCode}`}
                className="mt-2 bg-yellow-400 px-4 py-2 rounded-md text-black"
              >
                상세 보기
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
