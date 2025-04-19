import axios from "axios";

const instance = axios.create({
  baseURL: "https://morek9.click",
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

//주문 완료 시 장바구니 목록에서 해당 품목 삭제
export async function fetchDeleteCartItems(cartIds) {
  try {
    // DELETE 요청 보내기
    const response = await instance.delete(`/cart/deleteAfterBuy`, {
      data: cartIds,
    });

    console.log("fetchDeleteCartItems.response: ", response);

    // 응답 상태가 200 또는 204인 경우만 정상 처리
    if (response.status !== 200 && response.status !== 204) {
      throw new Error("fetchDeleteCartItems 예외발생");
    }

    return response; // 응답 반환
  } catch (error) {
    console.error("삭제 실패:", error); // 에러 디버깅
    throw new Error("fetchDeleteCartItems 예외발생");
  }
}
