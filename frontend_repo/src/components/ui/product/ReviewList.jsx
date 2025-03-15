import React, { useEffect, useState } from "react";
import { fetchProductReviews, fetchDeleteReview, fetchUpdateReview } from "../../../api/httpMemberService";
import ReviewForm from "./ReviewForm"; // 리뷰 작성 폼 컴포넌트

const ReviewList = ({ productCode }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editRating, setEditRating] = useState(5);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("jwtAuthToken");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const reviewData = await fetchProductReviews(productCode);
        setReviews(reviewData.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))); // 최신순 정렬
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [productCode]);

  //  날짜 포맷 함수 (YYYY-MM-DD)
  const formatDate = (dateString) => new Date(dateString).toISOString().split("T")[0];

  //  별점 UI 생성
  const renderStars = (selectedRating) => {
    return "★".repeat(selectedRating) + "☆".repeat(5 - selectedRating);
  };

  //  리뷰 수정 시작
  const startEditingReview = (review) => {
    setEditReviewId(review.reviewId);
    setEditReviewText(review.reviewText);
    setEditRating(review.rating);
  };

  //  리뷰 업데이트
  const handleUpdateReview = async () => {
    if (!token) return;

    const updatedReview = {
      reviewText: editReviewText,
      rating: editRating,
    };

    try {
      await fetchUpdateReview(editReviewId, updatedReview, token);
      setEditReviewId(null);
      const updatedReviews = await fetchProductReviews(productCode);
      setReviews(updatedReviews.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)));
    } catch (error) {
      console.error(" 리뷰 업데이트 중 오류 발생:", error.response?.data || error.message);
    }
  };

  //  리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    if (!token) return;

    try {
      await fetchDeleteReview(reviewId, token);
      setReviews(reviews.filter((review) => review.reviewId !== reviewId));
    } catch (error) {
      console.error(" 리뷰 삭제 실패:", error.response?.data || error.message);
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">리뷰 불러오는 중...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-md mt-6 border-t pt-4">
      <h3 className="text-lg font-bold mb-2">상품 리뷰 ({reviews.length})</h3>

      {/* 리뷰 작성 폼 */}
      <ReviewForm productCode={productCode} setReviews={setReviews} />

      {/* 리뷰 리스트 */}
      <div className="mt-4 space-y-4">
        {reviews.map((review) => (
          <div key={review.reviewId} className="border p-3 rounded-md bg-yellow-100">
            <p className="text-sm text-gray-700">
              {review.userId} | 작성날짜: {formatDate(review.reviewDate)}
            </p>
            <p className="text-yellow-500">{renderStars(review.rating)}</p>

            {editReviewId === review.reviewId ? (
              <div className="mt-2">
                <input
                  type="text"
                  value={editReviewText}
                  onChange={(e) => setEditReviewText(e.target.value)}
                  className="w-full p-1 border rounded-md mt-2"
                />
                <button onClick={handleUpdateReview} className="mt-2 bg-green-500 px-2 py-1 text-white rounded-md">
                  수정 완료
                </button>
              </div>
            ) : (
              <p className="text-gray-800">{review.reviewText}</p>
            )}

            {review.userId === userId && editReviewId !== review.reviewId && (
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
  );
};

export default ReviewList;
