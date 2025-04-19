import React, { useState } from "react";
import { fetchProductsByCategory } from "../../api/httpAdminStock";
import { useNavigate } from "react-router-dom";

const categoryMap = {
  육류: "meat",
  해산물: "fish",
  유제품: "dairy",
  음료: "drink",
  채소: "vegetable",
  과일: "frcuit",
  간식: "snack",
  "조미/소스": "sauce",
  건강식품: "health",
  "기타(밥/면)": "etc",
};

const categories = Object.keys(categoryMap);

export default function StockChartPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const handleCategoryClick = async (category) => {
    try {
      const englishCategory = categoryMap[category];
      const data = await fetchProductsByCategory(englishCategory);
      setProducts(data);
      setSelectedCategory(category);
    } catch (error) {
      console.error("카테고리별 상품 조회 실패:", error);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="bg-black text-white p-2 rounded-sm shadow-sm mr-3">
          <span className="text-lg">📊</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">재고 그래프 확인</h1>
      </div>

      {/* 카테고리 버튼 */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`text-sm py-2 px-3 rounded-sm transition-all duration-200 font-medium ${
              selectedCategory === category
                ? "bg-black text-white"
                : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => handleCategoryClick(category)}
            style={{ whiteSpace: "nowrap", overflow: "visible" }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 선택된 카테고리 */}
      {selectedCategory && (
        <div className="border-l-4 border-black pl-3 py-0.5 mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {selectedCategory}
          </h2>
          <p className="text-gray-500 text-xs">총 {products.length}개의 상품</p>
        </div>
      )}

      {/* 상품 리스트 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.productCode}
            className="border border-gray-200 rounded-sm shadow-sm hover:shadow transition cursor-pointer"
            onClick={() => navigate(`/stock-chart/${product.productCode}`)}
          >
            <img
              src={product.image || "https://via.placeholder.com/300x150"}
              alt={product.productName}
              className="w-full h-36 object-cover"
            />
            <div className="p-3">
              <h3 className="text-base font-semibold text-gray-800 truncate">
                {product.productName}
              </h3>
              <p className="text-xs text-gray-600 h-8 overflow-hidden">
                {product.description}
              </p>
              <p className="mt-2 text-sm font-medium text-black">
                ₩ {product.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 상품이 없을 때 */}
      {selectedCategory && products.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          해당 카테고리에 상품이 없습니다.
        </div>
      )}
    </div>
  );
}
