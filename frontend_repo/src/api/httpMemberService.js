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

// 리뷰 목록 불러오기
export async function fetchProductReviews(productCode) {
  const response = await instance.get(`/review/product/${productCode}`);
  return response.data;
}

//  리뷰 추가
export async function fetchAddReview(reviewData, token) {
  if (!token) {
    console.error(" JWT 토큰이 없습니다. 로그인 여부를 확인하세요.");
    return;
  }

  try {
    console.log(" 전송할 리뷰 데이터:", JSON.stringify(reviewData));
    console.log(" 전송할 Authorization 헤더:", `Bearer ${token}`);

    const response = await instance.post(`/review/add`, reviewData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(" 리뷰 작성 실패:", error.response?.data || error.message);
    throw error;
  }
}

// 리뷰 삭제
export async function fetchDeleteReview(reviewId, token) {
  return await instance.delete(`/review/delete/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//  리뷰 업데이트
export async function fetchUpdateReview(reviewId, updatedData, token) {
  return await instance.put(`/review/update/${reviewId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 특정 사용자 리뷰 불러오기
// 특정 사용자의 리뷰 목록 불러오기
export async function fetchUserReviews(userId, token) {
  const response = await instance.get(`/review/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// 특정 사용자의 주문목록 불러오깅깅
export async function fetchUserOrderInfo(token) {
  const response = await instance.get(`/order/myorder`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
