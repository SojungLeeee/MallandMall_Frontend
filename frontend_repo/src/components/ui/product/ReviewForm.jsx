import React, { useState } from "react";
import {
  fetchAddReview,
  fetchProductReviews,
} from "../../../api/httpMemberService";

const ReviewForm = ({ productCode, setReviews }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const token = localStorage.getItem("jwtAuthToken");
  const userId = localStorage.getItem("userId");

  // 별점 선택 UI
  const renderStars = (selectedRating, setRatingFunction) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-xl ${
            star <= selectedRating ? "text-yellow-500" : "text-gray-200"
          }`}
          onClick={() => setRatingFunction(star)}
        >
          ★
        </span>
      ))}
    </div>
  );

  const handleSubmit = async () => {
    if (!token || !reviewText.trim()) return;

    const newReview = { userId, productCode, rating, reviewText };

    try {
      await fetchAddReview(newReview, token);
      setReviewText("");
      setRating(5);

      // 최신순 정렬 유지
      const updatedReviews = await fetchProductReviews(productCode);
      setReviews(
        [...updatedReviews].sort(
          (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
        )
      );
    } catch (error) {
      if (error.response?.status === 400) {
        alert(
          `리뷰 작성 실패: ${
            error.response.data || "구매한 상품에만 리뷰를 작성할 수 있습니다."
          }`
        );
      } else {
        console.error(
          "리뷰 작성 중 오류 발생:",
          error.response?.data || error.message
        );
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-sm">
      <h4 className="text-sm font-medium text-gray-700 mb-3">리뷰 작성</h4>

      {/* 별점 선택 UI */}
      <div className="mb-3">{renderStars(rating, setRating)}</div>

      <div className="flex flex-col space-y-3">
        <textarea
          placeholder="리뷰를 입력하세요..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
          rows="3"
        />
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors font-medium self-end"
        >
          리뷰 등록
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
