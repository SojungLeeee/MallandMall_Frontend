import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetail, addToCart } from "../../../api/httpMemberService"; // addToCart를 가져옴
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
      <p className="text-center mt-10 text-lg">상품 정보를 불러오는 중...</p>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="flex flex-col items-center bg-[#f8f5e6] min-h-screen p-6">
      <div className="w-full max-w-md border rounded-lg bg-yellow-400 flex items-center justify-center max-h-[400px]">
        <img
          src={product.image}
          alt={product.productName}
          className="w-full h-auto object-contain p-4"
        />
      </div>

      <div className="w-full max-w-md mt-6">
        <h2 className="text-xl font-bold">{product.productName}</h2>
        <p className="text-red-500 font-bold text-lg">
          {product.price.toLocaleString()} 원
        </p>
      </div>

      <div className="w-full max-w-md mt-6 flex gap-4">
        {/* 구매하기 버튼 */}
        <button
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={() => navigate("/order")}
        >
          구매하기
        </button>

        {/* 장바구니 추가 버튼 */}
        <button
          className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none"
          onClick={handleAddToCart} // 장바구니 추가 및 페이지 이동
        >
          장바구니에 담기
        </button>
      </div>

      <ReviewList productCode={productCode} />
    </div>
  );
};

export default ProductDetail;
