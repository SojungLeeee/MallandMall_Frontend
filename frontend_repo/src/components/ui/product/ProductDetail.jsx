import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetail, addToCart } from "../../../api/httpMemberService"; // 기존 함수들 import
import { fetchtotalQuantityByProductCode } from "../../../api/httpProductService"; // 전체 재고량 함수 import
import { fetchAllBranches } from "../../../api/httpAdminBranch"; // 지점 목록을 가져오는 함수 import
import { fetchQuantityByProductCodeAndBranchName } from "../../../api/httpProductService"; // 새로 만든 API 함수 import
import ReviewList from "./ReviewList";
import axios from "axios"; // Axios를 사용하여 API 호출

const ProductDetail = () => {
  const { productCode } = useParams();
  const [product, setProduct] = useState(null);
  const [inventoryQuantity, setInventoryQuantity] = useState(0); // 전체 재고량
  const [branchInventoryQuantity, setBranchInventoryQuantity] = useState(0); // 선택한 지점의 재고량
  const [branches, setBranches] = useState([]); // 지점 목록
  const [selectedBranch, setSelectedBranch] = useState(""); // 선택된 지점
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 상품 정보 가져오기
        const productData = await fetchProductDetail(productCode);
        setProduct(productData);

        // 전체 재고량 가져오기
        const inventoryData = await fetchtotalQuantityByProductCode(
          productCode
        );
        setInventoryQuantity(inventoryData.data.totalQuantity);

        // 모든 지점 목록 가져오기
        const branchList = await fetchAllBranches();
        if (Array.isArray(branchList)) {
          setBranches(branchList); // 응답이 배열이면 그 자체를 상태에 저장
        } else {
          throw new Error("지점 데이터가 배열이 아닙니다.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productCode]);

  // 지점이 변경되었을 때 호출되는 함수
  const handleBranchChange = async (event) => {
    const branchName = event.target.value;
    setSelectedBranch(branchName);

    if (branchName) {
      try {
        // 선택된 지점과 상품 코드로 재고량을 가져오는 API 호출
        const response = await fetchQuantityByProductCodeAndBranchName(
          productCode,
          branchName
        );

        if (response.status === 200 && response.data) {
          setBranchInventoryQuantity(response.data.quantity); // 응답에서 재고량 가져오기
        } else {
          setBranchInventoryQuantity(0); // 지점에 재고가 없으면 0
        }
      } catch (error) {
        console.error("Error fetching branch inventory:", error);
        setBranchInventoryQuantity(0); // API 호출 오류시 재고량을 0으로 설정
      }
    }
  };

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

      // 장바구니 페이지로 이동
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

        <p className="text-red-500 font-bold text-lg mt-2">
          {product.price.toLocaleString()} 원
        </p>
      </div>

      {/* 지점별 재고량과 전체 재고량을 양옆에 배치 */}
      <div className="w-full max-w-md mt-6 flex justify-between items-center">
        {/* 지점별 재고량 */}
        <div className="flex-1">
          <label htmlFor="branchSelect" className="font-semibold">
            지점별 재고:
          </label>
        </div>
        <div className="flex-1 text-right">
          <select
            id="branchSelect"
            value={selectedBranch}
            onChange={handleBranchChange}
            className="w-full mt-2 p-2 border rounded-lg bg-white text-black"
          >
            <option value="">지점을 선택하세요</option>
            {branches.map((branch, index) => (
              <option key={index} value={branch.branchName}>
                {branch.branchName}
              </option>
            ))}
          </select>
          {/* 지점별 재고량 표시 */}
          {selectedBranch && (
            <div className="w-full max-w-md mt-2 flex justify-end items-center">
              <p className="text-gray-700">
                해당 지점 재고량: {branchInventoryQuantity}개
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 전체 재고량 표시 */}
      <div className="w-full max-w-md mt-2 flex justify-end items-center">
        <p className="text-gray-700">전국 총 재고량: {inventoryQuantity}개</p>
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
          onClick={handleAddToCart}
        >
          장바구니에 담기
        </button>
      </div>

      <ReviewList productCode={productCode} />
    </div>
  );
};

export default ProductDetail;
