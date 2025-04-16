import React, { useState, useEffect } from "react";
import { fetchAllProducts } from "../../api/httpProductService";
import ProductCard from "../../components/ui/product/ProductCard";
import findQuantity from "../../assets/images/findQuantity.png";
import offline from "../../assets/images/offline.png";
import findBranch from "../../assets/images/findBranch.png";
import question from "../../assets/images/question.jpg";

import { fetchProductHome } from "../../api/httpMemberService";
import CircularMenuItem from "../../components/CircularMenuitem";
import { useNavigate } from "react-router-dom";
import { fetchDiscountedProducts } from "../../api/httpChartService";

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
    navigate("/BranchInfo"); // 기존의 map 경로 유지
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

  // 오프라인 초특가
  const handleSpecialDealsClick = async () => {
    try {
      const discountedProducts = await fetchDiscountedProducts(); // 할인된 상품 가져오기
      setProducts(discountedProducts); // 할인 상품으로 상태 업데이트
      navigate("/special-deals"); // SpecialDealsPage로 이동
    } catch (err) {
      setError("할인 상품을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 고객문의로 이동
  const handleQuestionClick = () => {
    navigate("/questions");
  };

  return (
    <div>
      {/* 스크롤 가능한 원형 메뉴 - 두 줄로 표시 */}
      <div className="mb-2 mt-2">
        {/* 첫 번째 줄 - 첫번째에 재고찾기 배치 */}
        <div className="flex flex-row justify-start ml-0 gap-2 mb-1">
          <div className="flex flex-row justify-start ml-0 gap-2">
            {/* 매장안내를 첫 번째로 배치 */}
            <div>
              <CircularMenuItem
                title="매장안내"
                bgColor="bg-green-400"
                onClick={handleStoreInfoClick}
                imageSrc={findBranch}
              />
            </div>

            {/* 재고찾기 메뉴를 첫 번째로 배치 */}
            <div>
              <CircularMenuItem
                title="재고찾기"
                icon="package"
                bgColor="bg-blue-200"
                onClick={handleInventoryClick}
                imageSrc="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGlvY3c1eDZocDB4dTljZXYweDZkbWdhOGd1dXR6MDczbXB0cmxpbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AIipJHfzehHtmto1qy/giphy.gif"
              />
            </div>

            <div>
              <CircularMenuItem
                title="초특가"
                icon="tag"
                bgColor="bg-red-400"
                onClick={handleSpecialDealsClick} // 버튼 클릭 시 할인 상품 불러오기
                imageSrc={offline} // 아이콘 이미지
              />
            </div>

            <div>
              <CircularMenuItem
                title="고객문의"
                bgColor="bg-blue-200"
                onClick={handleQuestionClick}
                imageSrc={question}
              />
            </div>

            <div>
              <CircularMenuItem
                title="화이팅"
                bgColor="bg-blue-200"
                onClick={handleQuestionClick}
                imageSrc="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWNtb2EwaXJnbTNvbTY0N3lpeDl0eTJuemJ6bHY5MGptMjdpdWM4NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CjmvTCZf2U3p09Cn0h/giphy.gif"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 정렬 셀렉트 박스 */}
      <div className="flex justify-end px-4 mt-2">
        <select
          onChange={async (e) => {
            const sortValue = e.target.value;
            try {
              setLoading(true);
              const sorted = await fetchAllProducts(sortValue);
              setProducts(sorted);
            } catch (err) {
              console.error("정렬 중 오류:", err);
              setError("정렬된 상품을 불러오는 중 오류가 발생했습니다.");
            } finally {
              setLoading(false);
            }
          }}
          className="border rounded p-1"
        >
          <option value="default">전체 상품</option>
          <option value="priceAsc">가격 낮은순</option>
          <option value="priceDesc">가격 높은순</option>
        </select>
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
