import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProductHome } from "../../../api/httpMemberService"; // API 호출

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      {loading && (
        <p className="mt-20 text-center text-xl">Loading products...</p>
      )}

      {/* 에러 상태 */}
      {error && <p className="text-red-500">{error}</p>}

      {/* 상품 목록 */}
      <div className="mt-5 grid grid-cols-2  gap-4 p-4">
        {products.map((product) => (
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
              <div className="text-center flex flex-col gap-2 mt-3 flex-grow">
                <h3 className="text-lg font-semibold">{product.productName}</h3>
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
        ))}
      </div>
    </div>
  );
};

export default Products;
