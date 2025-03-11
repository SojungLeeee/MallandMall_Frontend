import { useLoaderData, useNavigate } from "react-router-dom";
import { fetchMypageHome } from "../../api/httpMemberService";
import { getAuthToken } from "../../context/tokenProviderService";
import "./Mypage.css";
import mart from "../../assets/images/mart.png";

function MyPage() {
  const user = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="mypage-container">
      {user && (
        <div className="mypage-header">
          <p className="username">{user.username}님의 마이페이지</p>
        </div>
      )}

      <img src={mart} width="350" height="200" alt="Emart Logo"></img>

      <button className="mypage-btn" onClick={() => navigate("/mypage/edit")}>
        회원정보 수정
      </button>
      <button className="mypage-btn" onClick={() => navigate("/mypage/orders")}>
        주문내역
      </button>
      <button className="mypage-btn">내가 쓴 리뷰</button>
      <button className="mypage-btn delete" onClick={() => navigate("/mypage/delete")}>
        회원탈퇴
      </button>
    </div>
  );
}

//  loader 내부에서 토큰 가져오기
export async function loader() {
  const { token } = getAuthToken(); // 토큰 가져오기
  console.log(" Auth Token:", token);

  try {
    const response = await fetchMypageHome(token); // 토큰 포함 요청
    console.log(" fetchMypageHome response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" 마이페이지 데이터 로드 실패:", error);
    throw new Response("Failed to load mypage data", { status: 500 });
  }
}

export default MyPage;
