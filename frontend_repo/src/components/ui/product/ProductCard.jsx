import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({
  products = [],
  loading = false,
  error = null,
  basePath = "/product",
  columns = 2,
  containerStyle = {},
  renderItem,
}) => {
  // 그리드 열 개수에 따른 클래스 결정
  const getGridColsClass = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      default:
        return "grid-cols-2";
    }
  };

  // 기본 아이템 렌더링 함수
  const defaultRenderItem = (product) => (
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
        {product.description && (
          <p className="text-sm text-gray-600">{product.description}</p>
        )}
        <p className="text-lg font-bold text-red-500">
          {product.price.toLocaleString()}원
        </p>
        {product.averageRating !== undefined && (
          <p className="text-sm text-yellow-500">⭐ {product.averageRating}</p>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col items-center bg-[#fff7f0] min-h-screen"
      style={containerStyle}
    >
      {/* 로딩 상태 */}
      {loading && (
        <p className="mt-20 text-center text-xl">Loading products...</p>
      )}

      {/* 에러 상태 */}
      {error && <p className="text-red-500">{error}</p>}

      {/* 상품 목록 */}
      <div className={`mt-5 grid ${getGridColsClass()} gap-4 p-4 w-full`}>
        {products.map((product) => (
          <Link
            to={`${basePath}/${product.productCode}`}
            key={product.productCode}
            className="cursor-pointer"
          >
            {renderItem ? renderItem(product) : defaultRenderItem(product)}
          </Link>
        ))}
      </div>

      {/* 상품이 없을 때 */}
      {!loading && !error && products.length === 0 && (
        <p className="mt-20 text-center text-xl">상품이 없습니다.</p>
      )}
    </div>
  );
};

export default ProductCard;
