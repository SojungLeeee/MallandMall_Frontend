import React, { useState } from "react";
import { fetchAddReview, fetchProductReviews } from "../../../api/httpMemberService";

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
          className={`cursor-pointer text-xl ${star <= selectedRating ? "text-yellow-500" : "text-gray-300"}`}
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

    await fetchAddReview(newReview, token);
    setReviewText("");
    setRating(5);
    setReviews(await fetchProductReviews(productCode));
  };

  return (
    <div className="flex flex-col space-y-2 mt-2">
      {/*  별점 선택 UI */}
      {renderStars(rating, setRating)}

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="리뷰를 입력하세요..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <button onClick={handleSubmit} className="bg-yellow-400 px-4 py-2 rounded-md">
          등록
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
