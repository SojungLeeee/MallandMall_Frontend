import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const OrderComplete = () => {
  const { imp_uid: paramImpUid } = useParams(); // PC 환경에서 경로 기반으로 전달받은 imp_uid
  const [searchParams] = useSearchParams(); // 모바일 환경에서 ?imp_uid=... 로 전달된 값
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const impUid = paramImpUid || searchParams.get("imp_uid"); // 둘 중 하나 사용

  useEffect(() => {
    if (!impUid) {
      setError("결제 정보가 없습니다.");
      return;
    }

    axios
      .get(`http://localhost:8090/emart/order/complete/${impUid}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError("결제 정보 조회에 실패했습니다."));
  }, [impUid]);

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-10 text-gray-600 font-semibold">
        결제 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
        🎉 결제가 완료되었습니다!
      </h2>
      <div className="text-gray-800 space-y-2">
        <p>
          <strong>주문번호:</strong> {order.orderId}
        </p>
        <p>
          <strong>상품코드:</strong> {order.productCode}
        </p>
        <p>
          <strong>수량:</strong> {order.quantity}
        </p>
        <p>
          <strong>수령인:</strong> {order.receiverName}
        </p>
        <p>
          <strong>연락처:</strong> {order.phoneNumber}
        </p>
        <p>
          <strong>주소:</strong> {order.addr1} {order.addr2}
        </p>
        <p>
          <strong>우편번호:</strong> {order.post}
        </p>
        <p>
          <strong>결제번호 (imp_uid):</strong> {order.impUid}
        </p>
      </div>
    </div>
  );
};

export default OrderComplete;
