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
    return (
      <p className="text-center mt-10 text-lg font-medium text-gray-700">
        리뷰 불러오는 중...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 font-medium">{error}</p>;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen p-6 w-full max-w-md shadow-md border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-black">
        내가 작성한 리뷰{" "}
        <span className="text-gray-500">({reviews.length})</span>
      </h3>

      <div className="mt-4 space-y-5 w-full">
        {reviews.map((review) => (
          <div
            key={review.reviewId}
            className="border border-gray-200 p-4 rounded-sm bg-white shadow-sm hover:border-gray-300 transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500 font-medium">
                {formatDate(review.reviewDate)}
              </p>
              <p className="text-sm text-gray-500">
                상품 코드: {review.productCode}
              </p>
            </div>
            <div className="mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < review.rating ? "text-black" : "text-gray-200"}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-800 mt-2 border-t border-gray-100 pt-2">
              {review.reviewText}
            </p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            작성한 리뷰가 없습니다.
          </div>
        )}
      </div>

      <button
        className="mt-6 bg-black text-white px-6 py-3 rounded-sm hover:bg-gray-800 transition-colors font-medium"
        onClick={() => navigate("/mypage")}
      >
        마이페이지로 돌아가기
      </button>
    </div>
  );
};

export default MyReviews;
