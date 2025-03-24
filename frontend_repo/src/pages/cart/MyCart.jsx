import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCartItems,
  removeCartItem,
  updateCartQuantity,
} from "../../api/httpMemberService";

const MyCart = () => {
  const [items, setItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false); // 중복 요청 방지
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtAuthToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCartItems(token)
      .then((data) => {
        if (!Array.isArray(data)) return;
        setItems(data);
      })
      .catch(() => {});
  }, [token, navigate]);

  const handleRemoveItem = async (productCode) => {
    if (!token) return;
    try {
      await removeCartItem(productCode, token);
      setItems((prevItems) =>
        prevItems.filter((item) => item.productCode !== productCode)
      );
    } catch (error) {}
  };

  const handleQuantityChange = async (productCode, newQuantity) => {
    if (!token || isNaN(newQuantity) || newQuantity < 1 || isUpdating) return;

    setIsUpdating(true); // 중복 요청 방지

    // UI를 먼저 업데이트 (Optimistic UI)
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productCode === productCode
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    try {
      const updatedItem = await updateCartQuantity(
        productCode,
        newQuantity,
        token
      );
      if (!updatedItem || typeof updatedItem.quantity !== "number") return;

      // 서버 응답 반영 (최종 확정)
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.productCode === productCode
            ? { ...item, quantity: updatedItem.quantity }
            : item
        )
      );
    } catch (error) {
    } finally {
      setIsUpdating(false); // 업데이트 완료 후 해제
    }
  };

  const handleCheckout = () => {
    // 구매하기 버튼 클릭 시 장바구니 내용 처리
    if (items.length === 0) {
      alert("장바구니에 상품이 없습니다.");
      return;
    }

    // 실제 구매 로직을 추가할 수 있음
    navigate("/order"); // 주문 페이지로 이동
  };

  return (
    <div>
      <h1>장바구니</h1>
      {items.length === 0 ? (
        <p>장바구니가 비었습니다.</p>
      ) : (
        items.map((item) => (
          <div key={item.productCode} style={cartItemStyle}>
            <div>
              <h2>{item.productName}</h2>
              <p>가격: {item.price.toLocaleString()}원</p>
              <div style={quantityContainerStyle}>
                <button
                  onClick={() =>
                    handleQuantityChange(item.productCode, item.quantity - 1)
                  }
                  style={quantityButtonStyle}
                  disabled={isUpdating} // 중복 클릭 방지
                >
                  ➖
                </button>
                <span>{item.quantity}개</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.productCode, item.quantity + 1)
                  }
                  style={quantityButtonStyle}
                  disabled={isUpdating} // 중복 클릭 방지
                >
                  ➕
                </button>
              </div>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.productName}
                  style={imageStyle}
                />
              )}
            </div>
            <button
              onClick={() => handleRemoveItem(item.productCode)}
              style={deleteButtonStyle}
            >
              ❌
            </button>
          </div>
        ))
      )}

      {/* 구매하기 버튼 */}
      <div style={checkoutButtonContainerStyle}>
        <button onClick={handleCheckout} style={checkoutButtonStyle}>
          구매하기
        </button>
      </div>
    </div>
  );
};

// 스타일
const cartItemStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const quantityContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const quantityButtonStyle = {
  background: "#007bff",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
  opacity: 1,
  transition: "opacity 0.3s",
};

const deleteButtonStyle = {
  background: "red",
  color: "white",
  border: "none",
  padding: "8px 12px",
  fontSize: "16px",
  borderRadius: "5px",
  cursor: "pointer",
  width: "80px",
  height: "40px",
};

const imageStyle = {
  width: "100px",
  marginTop: "10px",
};

const checkoutButtonContainerStyle = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
};

const checkoutButtonStyle = {
  background: "#28a745",
  color: "white",
  border: "none",
  padding: "10px 20px",
  fontSize: "18px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export default MyCart;
