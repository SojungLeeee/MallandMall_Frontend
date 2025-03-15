import React, { useState } from "react";
import { fetchAddReview, fetchProductReviews } from "../../../api/httpMemberService";

const ReviewForm = ({ productCode, setReviews }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const token = localStorage.getItem("jwtAuthToken");
  const userId = localStorage.getItem("userId");

  const handleSubmit = async () => {
    if (!token || !reviewText.trim()) return;
    const newReview = { userId, productCode, rating, reviewText };

    await fetchAddReview(newReview, token);
    setReviewText("");
    setRating(5);
    setReviews(await fetchProductReviews(productCode));
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      <input
        type="text"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <button onClick={handleSubmit} className="bg-yellow-400 px-4 py-2 rounded-md">
        등록
      </button>
    </div>
  );
};

export default ReviewForm;
