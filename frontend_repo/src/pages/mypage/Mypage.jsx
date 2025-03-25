import { useLoaderData, useNavigate } from "react-router-dom";
import { fetchMypageHome } from "../../api/httpMemberService";
import { getAuthToken } from "../../context/tokenProviderService";
import mart from "../../assets/images/logo/Loginimage.png"; // 이미지 경로
// 아이콘 import
import { User, ShoppingBag, MessageSquare, LogOut } from "lucide-react";

export default function MyPage() {
  const user = useLoaderData();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[390px] h-full text-xl">
      {user && (
        <div className="text-center mb-2">
          <p className="text-2xl font-bold">{user.username}님의 마이페이지</p>
        </div>
      )}

      {/* 로고 이미지 */}
      <div className="flex justify-center mb-6">
        <img src={mart} width="350" height="200" alt="Loginimage.png" />
      </div>

      {/* 버튼들 - 2x3 그리드로 변경 */}
      <div className="w-full px-4">
        <div className="border border-gray-300 rounded">
          {/* 첫 번째 줄 */}
          <div className="grid grid-cols-3 divide-x divide-gray-300 border-b border-gray-300">
            <button
              className="flex flex-col items-center justify-center py-4 hover:bg-gray-50"
              onClick={() => navigate("/mypage/edit")}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <User size={24} />
              </div>
              <span className="text-sm">회원정보 수정</span>
            </button>

            <button
              className="flex flex-col items-center justify-center py-4 hover:bg-gray-50"
              onClick={() => navigate("/mypage/orderinfo")}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <ShoppingBag size={24} />
              </div>
              <span className="text-sm">주문내역</span>
            </button>

            <button
              className="flex flex-col items-center justify-center py-4 hover:bg-gray-50"
              onClick={() => navigate("/mypage/myreview")}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <MessageSquare size={24} />
              </div>
              <span className="text-sm">내가 쓴 리뷰</span>
            </button>
          </div>

          {/* 두 번째 줄 */}
          <div className="grid grid-cols-3 divide-x divide-gray-300">
            <button
              className="flex flex-col items-center justify-center py-4 hover:bg-gray-50"
              onClick={() => navigate("/mypage/wishlist")}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <span className="text-sm">선호 카테고리</span>
            </button>

            <button
              className="flex flex-col items-center justify-center py-4 hover:bg-gray-50"
              onClick={() => navigate("/mypage/coupons")}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
                  <path d="M8 10h8" />
                  <path d="M8 14h8" />
                </svg>
              </div>
              <span className="text-sm">쿠폰함</span>
            </button>

            <button
              className="flex flex-col items-center justify-center py-4 hover:bg-gray-50"
              onClick={() => navigate("/mypage/delete")}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <LogOut size={24} />
              </div>
              <span className="text-sm">회원탈퇴</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

//  loader 내부에서 토큰 가져오기
export async function loader() {
  const { token } = getAuthToken(); // 토큰 가져오기
  console.log("Auth Token:", token);

  try {
    const response = await fetchMypageHome(token); // 토큰 포함 요청
    console.log("fetchMypageHome response:", response.data);
    return response.data;
  } catch (error) {
    console.error("마이페이지 데이터 로드 실패:", error);
    throw new Response("Failed to load mypage data", { status: 500 });
  }
}
