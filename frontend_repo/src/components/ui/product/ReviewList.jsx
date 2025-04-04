import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchProductReviews,
  fetchDeleteReview,
  fetchUpdateReview,
} from "../../../api/httpMemberService";
import ReviewForm from "./ReviewForm"; // 리뷰 작성 폼 컴포넌트

const ReviewList = ({ productCode }) => {
  const [reviews, setReviews] = useState([]); // 초기값을 빈 배열로 설정
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

        if (!reviewData || !Array.isArray(reviewData)) {
          // 데이터 검증 추가
          throw new Error("서버에서 유효한 리뷰 데이터를 반환하지 않았습니다.");
        }

        // 최신 리뷰가 가장 위로 오도록 정렬
        setReviews(
          [...reviewData].sort(
            (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
          )
        );
      } catch (err) {
        setError(err.message);
        setReviews([]); // 오류 발생 시에도 빈 배열로 설정하여 오류 방지
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [productCode]);

  // 날짜 포맷 함수 (YYYY-MM-DD)
  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toISOString().split("T")[0]
      : "N/A";
  };

  // 별점 UI 생성
  const renderStars = (selectedRating, setRatingFunction) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-xl ${
            star <= selectedRating ? "text-yellow-500" : "text-gray-200"
          }`}
          onClick={() => setRatingFunction && setRatingFunction(star)}
        >
          ★
        </span>
      ))}
    </div>
  );

  // 리뷰 수정 시작
  const startEditingReview = (review) => {
    setEditReviewId(review.reviewId);
    setEditReviewText(review.reviewText);
    setEditRating(review.rating);
  };

  // 리뷰 업데이트
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
      setReviews(
        updatedReviews.sort(
          (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
        )
      ); // 최신순 유지
    } catch (error) {
      console.error(
        "리뷰 업데이트 중 오류 발생:",
        error.response?.data || error.message
      );
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    if (!token) return;

    try {
      await fetchDeleteReview(reviewId, token);
      setReviews(reviews.filter((review) => review.reviewId !== reviewId));
    } catch (error) {
      console.error("리뷰 삭제 실패:", error.response?.data || error.message);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-lg font-medium text-gray-700">
        리뷰 불러오는 중...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 font-medium">{error}</p>;

  return (
    <div className="w-full max-w-md mt-6">
      {/* 헤더와 AI 분석 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-black">
          상품 리뷰 <span className="text-gray-500">({reviews.length})</span>
        </h3>

        {/* 리뷰가 있을 때만 분석 버튼 표시 */}
        {reviews.length > 0 && (
          <Link
            to={`/review-analysis/${productCode}`}
            className="bg-black text-white px-3 py-1.5 rounded-sm hover:bg-gray-800 transition-colors text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            AI 리뷰 분석
          </Link>
        )}
      </div>

      {/* 리뷰 작성 폼 */}
      <ReviewForm productCode={productCode} setReviews={setReviews} />

      {/* 리뷰 리스트 */}
      <div className="mt-6 space-y-5 text-left">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.reviewId}
              className="border border-gray-200 p-4 rounded-sm bg-white shadow-sm hover:border-gray-300 transition-all"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
                <p className="text-sm font-medium text-black">
                  {review.userId}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(review.reviewDate)}
                </p>
              </div>

              {editReviewId === review.reviewId ? (
                <div className="mt-3">
                  {/* 별점 수정 UI */}
                  {renderStars(editRating, setEditRating)}

                  <textarea
                    value={editReviewText}
                    onChange={(e) => setEditReviewText(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-sm mt-3 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
                    rows="3"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleUpdateReview}
                      className="px-4 py-2 bg-black text-white font-medium rounded-sm hover:bg-gray-800 transition-colors"
                    >
                      수정 완료
                    </button>
                    <button
                      onClick={() => setEditReviewId(null)}
                      className="px-4 py-2 bg-white text-black font-medium rounded-sm border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-2">{renderStars(review.rating, null)}</div>
                  <p className="text-gray-800 mb-3">{review.reviewText}</p>
                </>
              )}

              {review.userId === userId && editReviewId !== review.reviewId && (
                <div className="flex justify-end space-x-3 mt-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => startEditingReview(review)}
                    className="text-gray-600 text-sm hover:text-black transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.reviewId)}
                    className="text-gray-600 text-sm hover:text-black transition-colors"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 border border-gray-200 rounded-sm">
            아직 작성된 리뷰가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
