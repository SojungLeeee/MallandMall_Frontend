import React, { useEffect, useState } from "react";
import { fetchUserReviews } from "../../api/httpMemberService";
import { getAuthToken } from "../../context/tokenProviderService";
import { useNavigate } from "react-router-dom";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = getAuthToken();
  const userId = localStorage.getItem("userId"); // 로컬 스토리지에서 userId 가져오기

  useEffect(() => {
    const loadUserReviews = async () => {
      try {
        setLoading(true);
        if (!userId || !token) {
          setError("로그인이 필요합니다.");
          return;
        }
        const reviewData = await fetchUserReviews(userId, token);
        setReviews(
          reviewData.sort(
            (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
          )
        ); // 최신순 정렬
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserReviews();
  }, [userId, token]);

  // 날짜 포맷 함수
  const formatDate = (dateString) =>
    new Date(dateString).toISOString().split("T")[0];

  if (loading)
    return <p className="text-center mt-10 text-lg">리뷰 불러오는 중...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center bg-[#f8f5e6] min-h-screen p-6 w-full max-w-md">
      <h3 className="text-lg font-bold mb-2">
        내가 작성한 리뷰 ({reviews.length})
      </h3>

      <div className="mt-4 space-y-4 w-full">
        {reviews.map((review) => (
          <div
            key={review.reviewId}
            className="border p-3 rounded-md bg-yellow-100"
          >
            <p className="text-sm text-gray-700">
              상품 코드: {review.productCode} | 작성날짜:{" "}
              {formatDate(review.reviewDate)}
            </p>
            <p className="text-yellow-500">{"⭐".repeat(review.rating)}</p>
            <p className="text-gray-800">{review.reviewText}</p>
          </div>
        ))}
      </div>

      <button
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
        onClick={() => navigate("/mypage")}
      >
        마이페이지로 돌아가기
      </button>
    </div>
  );
};

export default MyReviews;
