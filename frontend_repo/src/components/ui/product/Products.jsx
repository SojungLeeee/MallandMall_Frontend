import React, { useEffect, useState } from "react";
import image1 from "../../../assets/images/choco.jpg"; // 이미지를 import

const Products = () => {
  const [products, setProducts] = useState([]); // 상품 데이터

  // 상품 데이터 가져오기 함수
  const getProducts = async () => {
    // 더미 데이터 (상품 10개로 늘림)
    const dummyData = [
      {
        id: 1,
        imageUrl: image1, // import한 이미지 사용 (변수로 사용)
        productName: "상품1",
        price: 10000,
        rating: 4,
      },
      {
        id: 2,
        imageUrl: image1, // import한 이미지 사용
        productName: "상품2",
        price: 20000,
        rating: 5,
      },
      {
        id: 3,
        imageUrl: image1, // import한 이미지 사용
        productName: "상품3",
        price: 15000,
        rating: 3,
      },
      {
        id: 4,
        imageUrl: image1, // import한 이미지 사용
        productName: "상품4",
        price: 30000,
        rating: 4,
      },
      {
        id: 5,
        imageUrl: image1, // import한 이미지 사용
        productName: "상품5",
        price: 12000,
        rating: 2,
      },
      {
        id: 6,
        imageUrl: image1, // import한 이미지 사용
        productName: "상품6",
        price: 25000,
        rating: 5,
      },
      {
        id: 7,
        imageUrl: image1, // import한 이미지 사용
        productName: "상품7",
        price: 18000,
        rating: 3,
      },
      {
        id: 8,
        imageUrl: image1, // import한 이미지 사용
        productName: "상품8",
        price: 22000,
        rating: 4,
      },
      {
        id: 9,
        imageUrl: image1, // import한 이미지 사용
        productName: "상품9",
        price: 28000,
        rating: 5,
      },
      {
        id: 10,
        imageUrl: image1, // import한 이미지 사용
        productName: "상품10",
        price: 35000,
        rating: 4,
      },
    ];

    // 더미 데이터 설정
    setProducts(dummyData);
  };

  useEffect(() => {
    getProducts(); // 컴포넌트가 마운트되면 상품 데이터 불러오기
  }, []);

  return (
    <div className="container mx-auto px-3 py-8">
      <div className="grid grid-cols-2 gap-3 ">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border  bg-custom-bg" //border-black 은 보려고해둔것것
          >
            <div className="relative pb-2/3">
              <img
                src={product.imageUrl} // imageUrl에 import된 값 사용
                alt={product.productName}
                className="w-52 h-52  object-cover rounded-t-lg px-2 py-2" // 이미지 크기 조정
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product.productName}
              </h3>
              <div className="mt-2 text-gray-600">{product.price}원</div>
              <div className="mt-2 text-yellow-500">
                {"★".repeat(product.rating || 0)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
