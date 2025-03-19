import { useLoaderData, useNavigate } from "react-router-dom";
import { fetchMypageHome } from "../../api/httpMemberService";
import { getAuthToken } from "../../context/tokenProviderService";
import mart from "../../assets/images/mart.png"; // 이미지 경로

export default function MyPage() {
  const user = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[390px] h-full text-xl bg-[#fcf3e3]">
      {user && (
        <div className="text-center mb-6">
          <p className="text-2xl font-bold">{user.username}님의 마이페이지</p>
        </div>
      )}

      {/* 로고 이미지 */}
      <div className="flex justify-center mb-6">
        <img src={mart} width="350" height="200" alt="Emart Logo" />
      </div>

      {/* 버튼들 */}
      <div className="space-y-4 flex flex-col items-center justify-center">
        <button
          className="w-full py-3 text-xl bg-[#f9e687] text-black font-bold rounded-2xl focus:outline-none hover:bg-[#e2d267]"
          onClick={() => navigate("/mypage/edit")}
        >
          회원정보 수정
        </button>
        <button
          className="w-full py-3 text-xl bg-[#f9e687] text-black font-bold rounded-2xl focus:outline-none hover:bg-[#e2d267]"
          onClick={() => navigate("/mypage/orderinfo")} // 주문내역 페이지로 이동
        >
          주문내역
        </button>
        {/* 리뷰 페이지로 이동 */}
        <button
          className="w-full py-3 text-xl bg-[#f9e687] text-black font-bold rounded-2xl focus:outline-none hover:bg-[#e2d267]"
          onClick={() => navigate("/mypage/myreview")}
        >
          내가 쓴 리뷰
        </button>
        <button
          className="w-full py-3 text-xl bg-[#eeba7a] text-black font-bold rounded-2xl focus:outline-none hover:bg-[#d39e4c]"
          onClick={() => navigate("/mypage/delete")}
        >
          회원탈퇴
        </button>
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
