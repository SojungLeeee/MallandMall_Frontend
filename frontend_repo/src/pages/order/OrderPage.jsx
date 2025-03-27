import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUserProfile, sendOrderConfirm } from "../../api/httpOrderService";

const OrderPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [useDefault, setUseDefault] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    receiverName: "",
    post: "",
    addr1: "",
    addr2: "",
    phoneNumber: "",
    memo: "",
  });

  const isFromCart = Array.isArray(state?.selectedItems);
  const selectedItems = isFromCart ? state.selectedItems : [];

  useEffect(() => {
    const token = localStorage.getItem("jwtAuthToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    fetchUserProfile(token)
      .then((data) => {
        setProfile(data);
        setFormData((prev) => ({
          ...prev,
          receiverName: data.userName,
          post: data.post,
          addr1: data.addr1,
          addr2: data.addr2,
          phoneNumber: data.phoneNumber,
        }));
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDefaultToggle = () => {
    if (!profile) return;
    setUseDefault(true);
    setFormData({
      receiverName: profile.userName,
      post: profile.post,
      addr1: profile.addr1,
      addr2: profile.addr2,
      phoneNumber: profile.phoneNumber,
      memo: "",
    });
  };

  const handleClear = () => {
    setUseDefault(false);
    setFormData({
      receiverName: "",
      post: "",
      addr1: "",
      addr2: "",
      phoneNumber: "",
      memo: "",
    });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({
          ...prev,
          post: data.zonecode,
          addr1: data.roadAddress || data.jibunAddress,
        }));
      },
    }).open();
  };

  const handlePayment = (pgProvider) => {
    const { IMP } = window;
    IMP.init("imp42828803");

    const totalAmount = isFromCart
      ? selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      : state.price * quantity;

    const productName = isFromCart
      ? `${selectedItems[0].productName} 외 ${selectedItems.length - 1}개`
      : state.productName;

    IMP.request_pay(
      {
        pg: pgProvider,
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`,
        name: productName,
        amount: totalAmount,
        buyer_email: profile.email,
        buyer_name: formData.receiverName,
        buyer_tel: formData.phoneNumber,
        buyer_addr: formData.addr1 + " " + formData.addr2,
        buyer_postcode: formData.post,
        m_redirect_url: "http://localhost:3000/order/complete",
      },
      (rsp) => {
        if (rsp.success) {
          const token = localStorage.getItem("jwtAuthToken");

          // 여러 상품 주문
          if (isFromCart) {
            const requests = selectedItems.map((item) => {
              return sendOrderConfirm(
                {
                  ...formData,
                  userId: profile.userId,
                  productCode: item.productCode,
                  quantity: item.quantity,
                  impUid: rsp.imp_uid,
                },
                token
              );
            });

            Promise.all(requests)
              .then(() => {
                if (window.innerWidth > 768) {
                  navigate(`/order/complete?imp_uid=${rsp.imp_uid}`);
                }
              })
              .catch(() => alert("장바구니 주문 처리 중 오류 발생"));
          } else {
            // 단일 상품 주문
            const orderData = {
              ...formData,
              userId: profile.userId,
              productCode: state.productCode,
              quantity: quantity,
              impUid: rsp.imp_uid,
            };

            sendOrderConfirm(orderData, token)
              .then(() => {
                if (window.innerWidth > 768) {
                  navigate(`/order/complete?imp_uid=${rsp.imp_uid}`);
                }
              })
              .catch(() => alert("주문 처리 중 오류 발생"));
          }
        } else {
          alert("결제 실패: " + rsp.error_msg);
        }
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">기본 배송지</h2>
      {profile ? (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <p>
            <strong>이름:</strong> {profile.userName}
          </p>
          <p>
            <strong>주소:</strong> {profile.addr1} {profile.addr2}
          </p>
          <p>
            <strong>우편번호:</strong> {profile.post}
          </p>
          <p>
            <strong>연락처:</strong> {profile.phoneNumber}
          </p>
        </div>
      ) : (
        <p>배송지 정보를 불러오는 중...</p>
      )}

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleDefaultToggle}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          기본 배송지 사용
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          직접 입력
        </button>
      </div>

      <div className="grid gap-4">
        <input
          name="receiverName"
          placeholder="수령인 이름"
          value={formData.receiverName}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <div className="flex gap-2">
          <input
            name="post"
            placeholder="우편번호"
            value={formData.post}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddressSearch}
            className="px-4 bg-gray-200 rounded"
          >
            주소검색
          </button>
        </div>
        <input
          name="addr1"
          placeholder="주소"
          value={formData.addr1}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="addr2"
          placeholder="상세주소"
          value={formData.addr2}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="phoneNumber"
          placeholder="연락처"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="memo"
          placeholder="배송 메모"
          value={formData.memo}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      {!isFromCart && (
        <div className="my-6">
          <label className="block mb-1 font-semibold">구매 수량</label>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => handlePayment("kakaopay.TC0ONETIME")}
          className="w-full py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500"
        >
          카카오페이 결제
        </button>
        <button
          onClick={() => handlePayment("tosspay.tosstest")}
          className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
        >
          토스페이 결제
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
