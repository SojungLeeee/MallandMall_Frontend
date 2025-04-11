import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart",

  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
export async function fetchMergeCoupons(couponId1, couponId2) {
  try {
    console.log("fetchMergeCoupons 요청:", couponId1, couponId2);

    const response = await instance.post("/coupon/merge", {
      couponId1,
      couponId2,
    });

    console.log("fetchMergeCoupons.response:", response);
    return response.data;
  } catch (error) {
    console.error("쿠폰 강화 실패:", error);
    throw new Error("fetchMergeCoupons 예외발생");
  }
}
//회원가입 시 온라인 쿠폰 발급
export async function fetchOnlineCoupon(userId) {
  console.log("fetchOnlineCoupon 요청");

  const response = await instance.get(
    `/coupon/newMemberOnlineCoupon/${userId}`
  );

  console.log("fetchOnlineCoupon.response:", response);
  return response;
}

//회원가입 시 온라인 쿠폰 발급
export async function fetchOfflineCoupon(userId) {
  console.log("fetchOfflineCoupon 요청");

  const response = await instance.get(
    `/coupon/newMemberOfflineCoupon/${userId}`
  );

  console.log("fetchOfflineCoupon.response:", response);
  return response;
}

// 특정 사용자의 쿠폰 목록 가져오기
export async function fetchAllCouponList(token) {
  const response = await instance.get(`/coupon/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function fetchDeleteCoupon(couponId) {
  try {
    // DELETE 요청 보내기
    const response = await instance.delete(`/coupon/delete/${couponId}`);

    console.log("fetchDeleteCoupon.response: ", response);

    // 응답 상태가 200 또는 204인 경우만 정상 처리
    if (response.status !== 200 && response.status !== 204) {
      throw new Error("fetchDeleteCoupon 예외발생");
    }

    return response; // 응답 반환
  } catch (error) {
    console.error("삭제 실패:", error); // 에러 디버깅
    throw new Error("fetchDeleteCoupon 예외발생");
  }
}
