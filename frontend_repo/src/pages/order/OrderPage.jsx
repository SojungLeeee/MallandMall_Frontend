import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUserProfile, sendOrderConfirm } from "../../api/httpOrderService";

const OrderPage = () => {
  const { state } = useLocation(); // state로 전달된 정보 받기
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

  // 상품상세페이지에서 넘어오는지, 장바구니에서 넘어오는지 확인
  const isFromCart = Array.isArray(state?.selectedItems); // 장바구니에서 넘어오는 경우
  const selectedItems = isFromCart ? state.selectedItems : [];

  // 총 결제 금액 계산
  const totalAmount = isFromCart
    ? selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : state.price * quantity; // 상품상세페이지에서 넘어오는 경우 단일 상품 결제

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
    // 필수 입력값 체크
    if (
      !formData.receiverName ||
      !formData.post ||
      !formData.addr1 ||
      !formData.addr2 ||
      !formData.phoneNumber
    ) {
      alert("모든 기본 정보를 입력해주세요.");
      return; // 빈 값이 있으면 결제 처리 중단
    }
    const { IMP } = window;
    IMP.init("imp42828803");

    const productName = isFromCart
      ? `${selectedItems[0].productName} 외 ${selectedItems.length - 1}개`
      : state.productName;

    IMP.request_pay(
      {
        pg: pgProvider,
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`,
        name: productName,
        amount: totalAmount, // 총 결제 금액
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

          // 장바구니 다수 상품 결제
          if (isFromCart) {
            const multiProductData = {
              ...formData,
              userId: profile.userId,
              impUid: rsp.imp_uid,
              orders: selectedItems.map((item) => ({
                productCode: item.productCode,
                quantity: item.quantity,
              })),
            };

            sendOrderConfirm(multiProductData, token)
              .then(() => {
                if (window.innerWidth > 768) {
                  navigate(`/order/complete?imp_uid=${rsp.imp_uid}`);
                }
              })
              .catch(() => alert("장바구니 주문 처리 중 오류 발생"));
          } else {
            // 단일 상품 결제
            const singleProductData = {
              ...formData,
              userId: profile.userId,
              productCode: state.productCode,
              quantity: quantity,
              impUid: rsp.imp_uid,
            };

            sendOrderConfirm(singleProductData, token)
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">기본 배송지</h2>
      {profile ? (
        <div className="bg-gray-100 p-4 rounded mb-6 text-left">
          <p className="mb-1">
            <strong>이름:</strong> {profile.userName}
          </p>
          <p className="mb-1">
            <strong>주소:</strong> {profile.addr1} {profile.addr2}
          </p>
          <p className="mb-1">
            <strong>우편번호:</strong> {profile.post}
          </p>
          <p className="mb-1">
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

      {/* 상품 이미지와 이름 표시 */}
      <div className="my-6">
        {isFromCart ? (
          selectedItems.map((item) => (
            <div
              key={item.productCode}
              className="flex items-center justify-between mb-4"
            >
              <img
                src={item.image}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <h3>{item.productName}</h3>
                <p>
                  {item.price.toLocaleString()}원 / {item.quantity}개
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-between mb-4">
            <img
              src={state.image}
              alt={state.productName}
              className="w-20 h-20 object-cover rounded-md mr-4"
            />
            <div className="flex-1">
              <h3>{state.productName}</h3>
              <p>
                {state.price.toLocaleString()}원 * {quantity}개
              </p>
            </div>
          </div>
        )}
      </div>

      <hr></hr>

      {/* 전체 결제 금액 */}
      <div className="my-6 text-right">
        <h3 className="text-lg font-bold">총 결제 금액</h3>
        <p className="text-xl font-semibold text-red-500">
          {totalAmount.toLocaleString()} 원
        </p>
      </div>

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
