import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetail } from "../../../api/httpMemberService";
import ReviewList from "./ReviewList"; // 리뷰 컴포넌트 불러오기

const ProductDetail = () => {
  const { productCode } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductDetail(productCode);
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [productCode]);

  if (loading)
    return (
      <p className="text-center mt-10 text-lg">상품 정보를 불러오는 중...</p>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="flex flex-col items-center bg-[#f8f5e6] min-h-screen p-6">
      {/* 상품 이미지 */}
      <div className="w-full max-w-md border rounded-lg bg-yellow-400 flex items-center justify-center max-h-[400px]">
        <img
          src={product.image}
          alt={product.productName}
          className="w-full h-auto object-contain p-4"
        />
      </div>

      {/* 상품 이름과 가격 */}
      <div className="w-full max-w-md mt-6">
        <h2 className="text-xl font-bold">{product.productName}</h2>
        <p className="text-red-500 font-bold text-lg">
          {product.price.toLocaleString()} 원
        </p>
      </div>

      {/* 구매하기와 장바구니 버튼 (양옆 배치) */}
      <div className="w-full max-w-md mt-6 flex gap-4">
        {/* 구매하기 버튼 */}
        <button
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={() => navigate("/order")} // 구매하기 버튼 클릭 시 /buy로 이동
        >
          구매하기
        </button>

        {/* 장바구니 버튼 */}
        <button
          className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none"
          onClick={() => alert("상품을 장바구니에 담았습니다!")}
        >
          장바구니에 담기
        </button>
      </div>

      {/* 리뷰 목록 컴포넌트 */}
      <ReviewList productCode={productCode} />
    </div>
  );
};

export default ProductDetail;
