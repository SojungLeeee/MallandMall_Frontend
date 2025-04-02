import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ui/product/ProductCard";

import { fetchProductHome } from "../../api/httpMemberService";
import CircularMenuItem from "../../components/CircularMenuitem";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const navigate = useNavigate();

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
      {/* 스크롤 가능한 원형 메뉴 - 두 줄로 표시 */}
      <div className="mb-2 mt-2">
        {/* 첫 번째 줄 - 첫번째에 재고찾기 배치 */}
        <div className="flex flex-row justify-start ml-0 gap-2 mb-1">
          {/* 재고찾기 메뉴를 첫 번째로 배치 */}
          <div>
            <CircularMenuItem
              title="재고찾기"
              icon="package"
              bgColor="bg-blue-400"
              onClick={handleInventoryClick}
              imageSrc="/images/inventory.jpg"
            />
          </div>

          {/* 나머지 메뉴 아이템 */}
          {firstRowMenuItems.map((item, index) => (
            <div key={index}>
              <CircularMenuItem
                title={item.title}
                icon={item.icon}
                bgColor={item.bgColor}
                onClick={() => handleMenuClick(item.path)}
                imageSrc={item.imageSrc}
              />
            </div>
          ))}
        </div>

        {/* 두 번째 줄 */}
        <div className="flex flex-row justify-start ml-0 gap-2">
          {/* 매장안내를 첫 번째로 배치 */}
          <div>
            <CircularMenuItem
              title="매장안내"
              icon="shopping"
              bgColor="bg-green-400"
              onClick={handleStoreInfoClick}
              imageSrc="/images/store.jpg"
            />
          </div>

          {/* 나머지 메뉴 아이템 */}
          {secondRowMenuItems.map((item, index) => (
            <div key={index}>
              <CircularMenuItem
                title={item.title}
                icon={item.icon}
                bgColor={item.bgColor}
                onClick={() => handleMenuClick(item.path)}
                imageSrc={item.imageSrc}
              />
            </div>
          ))}
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
