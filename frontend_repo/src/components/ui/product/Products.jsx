import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProductHome } from "../../../api/httpMemberService"; // API 호출

// 백엔드에서 받아온 데이터 useState로 상태관리 해버리기
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* 상품 데이터 가져오기, 비동기로 가져오기
 
  */
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProductHome();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="flex flex-col items-center bg-[#f8f5e6] min-h-screen">
      {/* 로딩 상태 */}
      {loading && <p className="mt-20 text-center text-xl">Loading products...</p>}

      {/* 에러 상태 */}
      {error && <p className="text-red-500">{error}</p>}

      {/* 상품 목록 */}
      <div className="mt-20 grid grid-cols-2 gap-4 max-w-4xl w-full p-4">
        {products.map((product) => (
          <Link to={`/product/${product.productCode}`} key={product.productCode} className="cursor-pointer">
            <div className="bg-white border rounded-md shadow-md overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition">
              <div className="w-full max-w-md border rounded-lg bg-yellow-400 flex items-center justify-center max-h-[400px]">
                <img src={product.image} alt={product.productName} className="w-full h-auto object-contain p-4" />
              </div>
              <div className="text-center flex flex-col gap-2 mt-3">
                <h3 className="text-lg font-semibold">{product.productName}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-lg font-bold text-red-500">{product.price.toLocaleString()}원</p>
                <p className="text-sm text-yellow-500">⭐ {product.averageRating}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;
