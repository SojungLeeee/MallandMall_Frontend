import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetail, addToCart } from "../../../api/httpMemberService";
import ReviewList from "./ReviewList";

const ProductDetail = () => {
  const { productCode } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleAddToCart = async () => {
    const token = localStorage.getItem("jwtAuthToken");
    if (!token) {
      alert("로그인이 필요합니다!");
      navigate("/login");
      return;
    }

    if (!product) {
      alert("상품 정보가 없습니다.");
      return;
    }

    const cartData = {
      productCode: product.productCode,
      quantity: 1,
    };

    try {
      await addToCart(cartData, token);
      console.log("장바구니에 추가된 상품:", cartData);
      alert(`'${product.productName}' 상품이 장바구니에 추가되었습니다!`);

      // 데이터 전달하면서 장바구니 페이지로 이동
      navigate("/carts", { state: { cartItem: cartData } });
    } catch (err) {
      alert("장바구니 추가 중 오류 발생");
      console.error(err);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-lg font-medium text-gray-700">
        상품 정보를 불러오는 중...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 font-medium">{error}</p>;
  if (!product) return null;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen p-6">
      <div className="w-full max-w-md border border-gray-200 rounded-sm bg-white flex items-center justify-center max-h-[400px] shadow-md overflow-hidden">
        <img
          src={product.image}
          alt={product.productName}
          className="w-full h-auto object-contain p-4"
        />
      </div>

      <div className="w-full max-w-md mt-6">
        <h2 className="text-xl font-bold text-black text-left">
          {product.productName}
        </h2>
        <p className="text-black font-bold text-lg mt-2 text-left">
          {product.price.toLocaleString()} 원
        </p>
      </div>

      <div className="w-full max-w-md mt-6 flex gap-4">
        {/* 구매하기 버튼 */}
        <button
          className="flex-1 bg-black text-white py-3 px-4 rounded-sm hover:bg-gray-800 transition-colors font-medium focus:outline-none"
          onClick={() => navigate("/order")}
        >
          구매하기
        </button>

        {/* 장바구니 추가 버튼 */}
        <button
          className="flex-1 bg-white text-black py-3 px-4 rounded-sm border border-gray-300 hover:bg-gray-100 transition-colors font-medium focus:outline-none"
          onClick={handleAddToCart}
        >
          장바구니에 담기
        </button>
      </div>

      <div className="w-full max-w-md mt-8 border-t border-gray-200 pt-6">
        <ReviewList productCode={productCode} />
      </div>
    </div>
  );
};

export default ProductDetail;
