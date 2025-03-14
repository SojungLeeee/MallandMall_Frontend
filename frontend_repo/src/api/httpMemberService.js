import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart",

  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 회원가입
export async function fetchSignup(user) {
  console.log("fetchSignup 요청");

  const response = await instance.post(`/signup`, user);
  return response;
}

// 로그인 처리 (AuthContext 내 login 호출로 이동, 여기서는 API 호출만 처리)
export async function fetchAuthenticate(authData) {
  const response = await instance.post(`/authenticate`, authData);
  console.log("authenticate.response:", response);

  return response;
}

// 마이페이지 홈
export async function fetchMypageHome(token) {
  return await instance.get(`/mypage/home`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 회원정보 수정
export async function fetchUpdateProfile(userData, token) {
  return await instance.post(`/mypage/memedit`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 회원탈퇴
export async function fetchDeleteAccount(token) {
  return await instance.delete(`/mypage/delete`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchProductHome() {
  const response = await instance.get(`/product/home`);
  return response.data;
}

// 상품 상세 정보 가져오기 (새로 추가)
export async function fetchProductDetail(productCode) {
  const response = await instance.get(`/product/detail/${productCode}`);
  return response.data;
}
