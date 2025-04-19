import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "https://morek9.click",

  timeout: 50000,
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

// 🛒 장바구니 관련 API
export async function fetchCartItems(token) {
  if (!token) throw new Error("🚨 인증 토큰이 없습니다.");

  const response = await instance.get(`/cart/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!Array.isArray(response.data)) {
    console.error("🚨 서버 응답 형식 오류:", response);
    throw new Error("서버 응답이 배열이 아닙니다.");
  }

  return response.data;
}

export async function addToCart(cartData, token) {
  if (!token) throw new Error("🚨 인증 토큰이 없습니다.");
  if (!cartData.productCode) throw new Error("🚨 상품 코드는 필수입니다.");
  if (typeof cartData.quantity !== "number" || cartData.quantity < 1) throw new Error("🚨 수량은 1 이상이어야 합니다.");

  return (
    await instance.post(`/cart/add`, cartData, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
}

export async function removeCartItem(productCode, token) {
  if (!token) throw new Error("🚨 인증 토큰이 없습니다.");
  if (!productCode) throw new Error("🚨 상품 코드는 필수입니다.");

  console.log(`🗑️ 상품(${productCode}) 삭제 요청`);

  return (
    await instance.delete(`/cart/${productCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
}
// 리뷰 분석 API - 수정 후
export const fetchReviewAnalysis = async (productCode) => {
  try {
    const response = await instance.get(`/api/review-analysis/${productCode}`);
    return response.data;
  } catch (error) {
    console.error("리뷰 분석 데이터 불러오기 실패:", error);
    throw error;
  }
};

export const updateCartQuantity = async (productCode, quantity, token) => {
  if (isNaN(quantity) || quantity < 1) {
    console.error("🚨 잘못된 수량 값:", quantity);
    return;
  }

  return await instance.patch(
    `/cart/${productCode}?quantity=${quantity}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

//특정 상품 별점 별 리뷰 보기
export async function fetchProductReviewsByRating(productCode, rating) {
  try {
    const response = await instance.get(`/review/${productCode}/${rating}`);
    return response.data;
  } catch (error) {
    // 404 오류를 처리하여 메시지를 반환
    if (error.response && error.response.status === 404) {
      return { message: "해당 별점 리뷰가 없습니다" };
    }
    throw error; // 다른 오류는 그대로 던짐
  }
}
