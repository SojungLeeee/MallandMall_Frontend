import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchProductDetail,
  fetchProductReviews,
  fetchAddReview,
  fetchDeleteReview,
  fetchUpdateReview,
} from "../../../api/httpMemberService"; // API 호출

const ProductDetail = () => {
  const { productCode } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); // 리뷰 목록
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState(""); // 리뷰 입력값
  const [rating, setRating] = useState(5);
  const [editReviewId, setEditReviewId] = useState(null); //  현재 수정 중인 리뷰 ID
  const [editReviewText, setEditReviewText] = useState(""); // 수정할 리뷰 텍스트

  const userId = localStorage.getItem("userId"); //  로그인한 사용자 ID 가져오기
  const token = localStorage.getItem("jwtAuthToken"); //  JWT 토큰 가져오기

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductDetail(productCode);
        const reviewData = await fetchProductReviews(productCode);
        setProduct(productData);
        setReviews(reviewData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [productCode]);

  //  별점 만들기
  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  //  리뷰 작성
  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) return;

    if (!token) {
      alert(" 로그인이 필요합니다.");
      return;
    }

    if (!userId) {
      console.error(" 유저 ID가 없습니다.");
      return;
    }

    const newReview = { userId, productCode, rating, reviewText };

    try {
      await fetchAddReview(newReview, token);
      setReviewText("");
      const updatedReviews = await fetchProductReviews(productCode);
      setReviews(updatedReviews);
    } catch (error) {
      if (error.response?.status === 400) {
        alert(` 리뷰 작성 실패: ${error.response.data}`);
      } else {
        console.error(" 리뷰 작성 중 오류 발생:", error.response?.data || error.message);
      }
    }
  };

  //  리뷰 삭제 (본인 리뷰만 가능)
  const handleDeleteReview = async (reviewId) => {
    if (!token) return;
    await fetchDeleteReview(reviewId);
    setReviews(reviews.filter((review) => review.reviewId !== reviewId));
  };

  //  리뷰 수정 (입력 필드 표시)
  const startEditingReview = (review) => {
    setEditReviewId(review.reviewId);
    setEditReviewText(review.reviewText);
  };

  //  리뷰 업데이트
  const handleUpdateReview = async () => {
    if (!token) return;
    await fetchUpdateReview(editReviewId, { reviewText: editReviewText, rating: 4 }); // 예제 값
    setEditReviewId(null);
    const updatedReviews = await fetchProductReviews(productCode);
    setReviews(updatedReviews);
  };

  if (loading) return <p className="text-center mt-10 text-lg">상품 정보를 불러오는 중...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="flex flex-col items-center bg-[#f8f5e6] min-h-screen p-6">
      {/*  상품 정보 */}
      <div className="w-full max-w-md border rounded-lg bg-yellow-400 flex items-center justify-center max-h-[400px]">
        <img src={product.image} alt={product.productName} className="w-full h-auto object-contain p-4" />
      </div>
      <div className="w-full max-w-md mt-6">
        <h2 className="text-xl font-bold">{product.productName}</h2>
        <p className="text-gray-600">수량 n개 - 추후 적용 예정</p>
        <p className="text-red-500 font-bold text-lg">{product.price.toLocaleString()} 원</p>
      </div>

      {/*  리뷰 섹션 */}
      <div className="w-full max-w-md mt-6 border-t pt-4">
        <h3 className="text-lg font-bold mb-2">상품 리뷰</h3>

        {/*  리뷰 입력 */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="리뷰를 입력하세요..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <button onClick={handleReviewSubmit} className="bg-yellow-400 px-4 py-2 rounded-md">
            등록
          </button>
        </div>

        {/*  리뷰 리스트 */}
        <div className="mt-4 space-y-4">
          {reviews.map((review) => (
            <div key={review.reviewId} className="border p-3 rounded-md bg-yellow-100">
              <p className="text-sm text-gray-700">{review.userId}</p>
              <p className="text-yellow-500">{renderStars(review.rating)}</p>

              {/*  리뷰 수정  */}
              {editReviewId === review.reviewId ? (
                <div className="mt-2 flex flex-col">
                  <input
                    type="text"
                    value={editReviewText}
                    onChange={(e) => setEditReviewText(e.target.value)}
                    className="p-1 border rounded-md"
                  />
                  <button onClick={handleUpdateReview} className="mt-2 bg-green-500 px-2 py-1 text-white rounded-md">
                    수정 완료
                  </button>
                  <button onClick={() => setEditReviewId(null)} className="mt-1 text-gray-500 text-sm">
                    취소
                  </button>
                </div>
              ) : (
                <p className="text-gray-800">{review.reviewText}</p>
              )}

              {/*  본인 리뷰일 때만 수정/삭제 버튼 표시 */}
              {review.userId === userId && (
                <div className="flex space-x-2 mt-2">
                  <button onClick={() => startEditingReview(review)} className="text-blue-500 text-sm">
                    수정
                  </button>
                  <button onClick={() => handleDeleteReview(review.reviewId)} className="text-red-500 text-sm">
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
