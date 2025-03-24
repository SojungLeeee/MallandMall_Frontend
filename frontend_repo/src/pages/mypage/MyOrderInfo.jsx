import React, { useEffect, useState } from "react";
import { fetchUserOrderInfo, fetchProductDetail } from "../../api/httpMemberService";
import { getAuthToken } from "../../context/tokenProviderService";
import { useNavigate } from "react-router-dom";

const MyOrderInfo = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({}); //  상품 상세 정보를 저장하는 상태

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

  //  주문된 상품들의 상세 정보를 가져오는 함수
  useEffect(() => {
    const loadProductDetails = async () => {
      let details = {};
      for (let order of orders) {
        if (!productDetails[order.productCode]) {
          try {
            const productData = await fetchProductDetail(order.productCode);
            details[order.productCode] = productData;
          } catch (error) {
            console.error(` 상품 정보 로드 실패: ${order.productCode}`, error);
          }
        }
      }
      setProductDetails((prevDetails) => ({ ...prevDetails, ...details }));
    };

    if (orders.length > 0) {
      loadProductDetails();
    }
  }, [orders]);

  if (loading) return <p className="text-center mt-10 text-lg">주문 내역 불러오는 중...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-md mt-6 border-t pt-4">
      <h3 className="text-lg font-bold mb-2">주문 내역 ({orders.length})</h3>

      {/* 주문 내역 리스트 */}
      <div className="mt-4 space-y-4">
        {orders.map((order) => {
          const product = productDetails[order.productCode];
          return (
            <div key={order.orderId} className="border p-3 rounded-md bg-yellow-100">
              {/*  상품 이미지 및 상세 페이지 이동 */}
              {product ? (
                <div
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() => navigate(`/product/${order.productCode}`)} //  상품 상세 페이지 이동
                >
                  <img src={product.image} alt={product.productName} className="w-32 h-32 object-cover rounded-md" />
                  <p className="text-lg font-bold mt-2">{product.productName}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">상품 정보를 불러오는 중...</p>
              )}

              {/*  주문 정보 */}
              <p className="text-sm text-gray-700">주문 ID: {order.orderId}</p>
              <p className="text-sm text-gray-700">상품 코드: {order.productCode}</p>
              <p className="text-sm text-gray-700">수량: {order.quantity}</p>
              <p className="text-sm text-gray-700">받는 사람: {order.receiverName}</p>
              <p className="text-sm text-gray-700">
                배송지: {order.addr1} {order.addr2} ({order.post})
              </p>
              <p className="text-sm text-gray-700">연락처: {order.phoneNumber}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrderInfo;
