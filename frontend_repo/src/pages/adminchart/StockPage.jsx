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
  "조미료/소스": "sauce",
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">재고 그래프 확인</h1>

      {/* 카테고리 버튼 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className="bg-white text-gray-800 border border-gray-200 py-2.5 px-5 rounded-lg
           hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent
           hover:-translate-y-[2px] shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_15px_rgba(67,100,255,0.2)]
           transition-all duration-200 ease-in-out font-medium"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 선택된 카테고리 */}
      {selectedCategory && <h2 className="text-xl font-semibold mb-2">"{selectedCategory}" 상품 목록</h2>}

      {/* 상품 리스트 */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.productCode}
            className="border p-4 rounded shadow hover:shadow-md transition"
            onClick={() => navigate(`/stock-chart/${product.productCode}`)}
          >
            <img src={product.image} alt={product.productName} className="w-full h-40 object-cover mb-2" />
            <h3 className="text-lg font-bold">{product.productName}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="mt-1 text-red-600 font-semibold">₩ {product.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
