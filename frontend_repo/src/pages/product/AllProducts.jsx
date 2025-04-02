import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ui/product/ProductCard";

import { fetchProductHome } from "../../api/httpMemberService"; // API 호출
import SemiWideComponent from "../../components/SemiWideComponent";
import { useNavigate } from "react-router-dom"; // Navigate가 아닌 useNavigate 임포트

/**
 * 모든 상품을 보여주는 Products 페이지 컴포넌트
 * ProductList 컴포넌트를 활용하여 리팩토링
 */

const AllProducts = () => {
  const navigate = useNavigate(); // 컴포넌트 내부에서 useNavigate 훅 호출

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 재고찾기로 이동하는 함수 - 서치 페이지로 이동
  const handleInventoryClick = () => {
    navigate("/map"); // Search 페이지로 이동
  };

  // 매장안내로 이동하는 함수
  const handleStoreInfoClick = () => {
    navigate("/map"); // 기존의 map 경로 유지
  };

  // 메뉴 아이템 클릭 핸들러
  const handleMenuClick = (path) => {
    navigate(path);
  };

  // 재고조회로 이동하는 함수
  const handleClick = () => {
    navigate("/map"); // Navigate가 아닌 navigate 함수 사용
  };

  useEffect(() => {
    // 상품 데이터 불러오기
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProductHome();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("상품을 불러오는 중 오류 발생:", err);
        setError("상품을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 메뉴 아이템 설정
  const menuItems = [
    {
      title: "명품개런티",
      icon: "package",
      bgColor: "bg-indigo-400",
      path: "/premium",
      imageSrc: "/images/premium.jpg",
    },
    {
      title: "HAZZYS",
      icon: "shopping",
      bgColor: "bg-gray-400",
      path: "/brands/hazzys",
      imageSrc: "/images/hazzys.jpg",
    },
    {
      title: "+2,000P",
      icon: "gift",
      bgColor: "bg-pink-400",
      path: "/points",
      imageSrc: "/images/points.jpg",
    },
    {
      title: "미니게임",
      icon: "game",
      bgColor: "bg-pink-200",
      path: "/minigame",
      imageSrc: "/images/minigame.jpg",
    },
    {
      title: "11번가로또",
      icon: "award",
      bgColor: "bg-pink-500",
      path: "/lotto",
      imageSrc: "/images/lotto.jpg",
    },
    {
      title: "쿠폰/출첵",
      icon: "gift",
      bgColor: "bg-blue-500",
      path: "/coupons",
      imageSrc: "/images/coupons.jpg",
    },
    {
      title: "베스트랭킹",
      icon: "award",
      bgColor: "bg-indigo-400",
      path: "/best-rankings",
      imageSrc: "/images/ranking.jpg",
    },
    {
      title: "숙박페스타",
      icon: "package",
      bgColor: "bg-gray-400",
      path: "/accommodation-festa",
      imageSrc: "/images/accommodation.jpg",
    },
  ];

  // 각 줄에 표시할 메뉴 아이템 (첫 번째 줄은 재고찾기 + 메뉴 4개, 총 5개)
  const firstRowMenuItems = menuItems.slice(0, 4);
  const secondRowMenuItems = menuItems.slice(4);

  return (
    <div>
      <div className="mb-2">
        <div className="flex flex-col md:flex-row justify-center ml-6">
          <div className="w-full md:w-1/2">
            <SemiWideComponent
              title="재고찾기"
              subtitle="내 근처의 매장 찾기"
              noMargin={true}
              onClick={handleClick} // 여기에 클릭 핸들러 연결
            />
          </div>
          <div className="w-full md:w-1/2">
            <SemiWideComponent
              title="매장안내"
              subtitle="가까운 매장 찾기"
              noMargin={true}
            />
          </div>
        </div>
      </div>

      {/* ProductCard 섹션 */}
      <div className="mt-0">
        <ProductCard
          products={products}
          loading={loading}
          error={error}
          basePath="/product"
          columns={2}
          containerStyle={{
            backgroundColor: "white",
            padding: "0.5rem",
          }}
        />
      </div>
    </div>
  );
};

export default AllProducts;
