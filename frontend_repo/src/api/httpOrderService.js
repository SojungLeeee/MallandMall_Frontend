import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8090/emart",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 1. 사용자 프로필 정보 조회 (기본 배송지용)
export async function fetchUserProfile(token) {
  try {
    const response = await instance.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    throw new Error("fetchUserProfile 예외 발생");
  }
}

// 2. 주문 정보 서버로 전송
export async function sendOrderConfirm(orderData, token) {
  try {
    const response = await instance.post("/order/confirm", orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("주문 전송 실패:", error);
    throw new Error("sendOrderConfirm 예외 발생");
  }
}

export async function fetchOrderComplete(impUid, token) {
  try {
    const response = await instance.get(`/order/complete/${impUid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("결제 완료 정보 조회 실패:", error);
    throw new Error("fetchOrderComplete 예외 발생");
  }
}
