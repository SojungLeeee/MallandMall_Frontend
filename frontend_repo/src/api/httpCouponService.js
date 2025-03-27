import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart",

  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

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

// 특정 사용자의 쿠폰 목록 가져오기기
export async function fetchAllCouponList(token) {
  const response = await instance.get(`/coupon/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
