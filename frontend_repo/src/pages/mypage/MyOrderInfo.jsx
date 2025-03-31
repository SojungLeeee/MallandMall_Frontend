import React, { useEffect, useState } from "react";
import {
  fetchUserOrderInfo,
  fetchProductDetail,
} from "../../api/httpMemberService";
import { getAuthToken } from "../../context/tokenProviderService";
import { useNavigate } from "react-router-dom";

const MyOrderInfo = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({}); // 상품 상세 정보를 저장하는 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [ordersPerPage] = useState(5); // 페이지당 표시할 주문 수

  const { token } = getAuthToken();
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchUserOrderInfo(token);
        setOrders(response.sort((a, b) => b.orderId - a.orderId)); // 최신 주문이 위로 정렬
      } catch (err) {
        setError("주문 내역을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  // 주문된 상품들의 상세 정보를 가져오는 함수
  useEffect(() => {
    const loadProductDetails = async () => {
      let details = {};
      for (let order of orders) {
        if (!productDetails[order.productCode]) {
          try {
            const productData = await fetchProductDetail(order.productCode);
            details[order.productCode] = productData;
          } catch (error) {
            console.error(`상품 정보 로드 실패: ${order.productCode}`, error);
          }
        }
      }
      setProductDetails((prevDetails) => ({ ...prevDetails, ...details }));
    };

    if (orders.length > 0) {
      loadProductDetails();
    }
  }, [orders]);

  if (loading)
    return (
      <p className="text-center mt-10 text-lg font-medium text-gray-700">
        주문 내역 불러오는 중...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 font-medium">{error}</p>;

  // 페이지당 보여줄 주문 목록
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // 페이지 번호 계산
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-md mt-6 border-t border-gray-100 pt-6 bg-white">
      <h3 className="text-xl font-bold mb-6 text-black">
        주문 내역 <span className="text-gray-500">({orders.length})</span>
      </h3>

      {/* 주문 내역 리스트 */}
      <div className="mt-4 space-y-5">
        {currentOrders.map((order) => {
          const product = productDetails[order.productCode];
          return (
            <div
              key={order.orderId}
              className="border border-gray-200 p-3 rounded-sm bg-white shadow-sm hover:border-gray-300 transition-all"
            >
              {/* 상품 정보 섹션 */}
              <div className="flex items-start border-b border-gray-100 pb-3 mb-1">
                {/* 상품 이미지 */}
                {product ? (
                  <div
                    className="cursor-pointer mr-4"
                    onClick={() => navigate(`/product/${order.productCode}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="w-24 h-24 object-cover rounded-sm border border-gray-200"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-sm flex items-center justify-center mr-4">
                    <p className="text-xs text-gray-500">이미지 로딩 중...</p>
                  </div>
                )}

                {/* 상품 정보 */}
                <div className="flex-1">
                  {product ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(`/product/${order.productCode}`)}
                    >
                      <p className="text-lg text-black hover:underline font-bold">
                        {product.productName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        상품 코드 : {order.productCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        수량 : {order.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        주문일자 : {order.orderDate}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      상품 정보를 불러오는 중...
                    </p>
                  )}
                </div>
              </div>

              {/* 배송 정보 섹션 */}
              <div className="mt-2">
                <h4 className="text-sm font-medium text-black mb-2">
                  배송 정보
                </h4>
                <div className="space-y-1 text-sm text-gray-600 text-left pl-5 pr-5">
                  <p>받는 사람: {order.receiverName}</p>
                  <p>연락처: {order.phoneNumber}</p>
                  <p>
                    배송지: {order.addr1} {order.addr2}{" "}
                    <span className="text-gray-500">({order.post})</span>
                  </p>
                  <p>주문일자 : {order.orderDate}</p>
                </div>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="text-center py-10 text-gray-500 border border-gray-200 rounded-sm">
            주문 내역이 없습니다.
          </div>
        )}
      </div>

      {/* 페이지 네비게이션 */}
      <div className="flex justify-center mt-4 mb-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-white bg-gray-700 rounded-md disabled:bg-gray-300"
        >
          이전
        </button>
        <span className="mx-2 text-lg font-medium text-gray-700">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-white bg-gray-700 rounded-md disabled:bg-gray-300"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MyOrderInfo;
