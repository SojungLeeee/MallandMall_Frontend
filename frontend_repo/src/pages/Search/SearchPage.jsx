import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchSearchProducts } from "../../api/httpSearchService"; // axios 요청을 가져옵니다.

const SearchPage = () => {
  const { productName } = useParams(); // URL에서 productName을 가져옵니다.
  const [products, setProducts] = useState([]); // 상품 데이터를 상태로 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 오류 상태 관리

  // 카테고리명에 해당하는 상품 목록을 가져오는 함수
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchSearchProducts(productName); // HTTP 요청을 보내고 응답을 받음
        console.log("fetchSearchProducts.response:", response); // 응답 확인

        if (response.status === 204) {
          // 204 상태 코드일 경우 데이터가 없음을 알리고 빈 배열을 설정
          setProducts([]);
        } else if (response && response.data) {
          setProducts(response.data); // 응답 데이터로 상품 목록을 설정
        } else {
          throw new Error("상품 목록을 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        setError(error.message); // 오류 발생 시 오류 메시지 설정
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchProducts(); // 컴포넌트 마운트 시 상품 목록을 가져옵니다.
  }, [productName]); // 카테고리가 변경될 때마다 API를 새로 호출

  // 로딩 중일 때 보여줄 로딩 메시지
  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  // 오류가 있을 경우 오류 메시지 표시
  if (error) {
    return (
      <div className="text-center text-xl font-semibold text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-center mb-6">
        '<span className="text-green-500">{productName}</span>' 키워드를
        포함하는 상품 목록
      </h1>

      {/* 상품이 없을 때 화면 전체를 차지하게 표시 */}
      {products.length === 0 ? (
        <div className="text-center text-base font-semibold h-full flex items-center justify-center">
          이 키워드를 포함하는 상품명이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* 상품 목록을 반복문으로 렌더링 */}
          {products.map((product) => (
            <Link
              to={`/product/${product.productCode}`}
              key={product.productCode}
              className="cursor-pointer"
            >
              <div className="bg-white border rounded-md shadow-md overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition h-full">
                {/* 이미지 컨테이너 */}
                <div className="w-full max-h-72 border rounded-lg bg-yellow-400 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-full object-cover p-4"
                  />
                </div>
                <div className="text-center flex flex-col gap-2 mt-3">
                  <h3 className="text-lg font-semibold">
                    {product.productName}
                  </h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-lg font-bold text-red-500">
                    {product.price.toLocaleString()}원
                  </p>
                  <p className="text-sm text-yellow-500">
                    ⭐ {product.averageRating}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
