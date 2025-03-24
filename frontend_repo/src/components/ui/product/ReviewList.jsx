import React, { useEffect, useState } from "react";
import { fetchProductReviews, fetchDeleteReview, fetchUpdateReview } from "../../../api/httpMemberService";
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

        //  최신 리뷰가 가장 위로 오도록 정렬
        setReviews([...reviewData].sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)));
      } catch (err) {
        setError(err.message);
        setReviews([]); //  오류 발생 시에도 빈 배열로 설정하여 오류 방지
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [productCode]);

  //  날짜 포맷 함수 (YYYY-MM-DD)
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split("T")[0] : "N/A";
  };

  //  별점 UI 생성
  const renderStars = (selectedRating, setRatingFunction) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-xl ${star <= selectedRating ? "text-yellow-500" : "text-gray-300"}`}
          onClick={() => setRatingFunction(star)}
        >
          ★
        </span>
      ))}
    </div>
  );

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
      setReviews(updatedReviews.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))); // 최신순 유지
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

      {/*  리뷰 작성 폼 */}
      <ReviewForm productCode={productCode} setReviews={setReviews} />

      {/*  리뷰 리스트 */}
      <div className="mt-4 space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.reviewId} className="border p-3 rounded-md bg-yellow-100">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">{review.userId}</p>
                <p className="text-sm text-gray-500">작성날짜: {formatDate(review.reviewDate)}</p>
              </div>

              {editReviewId === review.reviewId ? (
                <div className="mt-2">
                  {/*  별점 수정 UI */}
                  {renderStars(editRating, setEditRating)}

                  <input
                    type="text"
                    value={editReviewText}
                    onChange={(e) => setEditReviewText(e.target.value)}
                    className="w-full p-1 border rounded-md mt-2"
                  />
                  <button onClick={handleUpdateReview} className="mt-2 bg-green-500 px-2 py-1 text-white rounded-md">
                    수정 완료
                  </button>
                  <button onClick={() => setEditReviewId(null)} className="mt-1 text-gray-500 text-sm">
                    취소
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-yellow-500">{renderStars(review.rating, () => {})}</p>
                  <p className="text-gray-800">{review.reviewText}</p>
                </>
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
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">아직 작성된 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
