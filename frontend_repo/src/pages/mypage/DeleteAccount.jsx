import React from "react";
import { fetchDeleteAccount } from "../../api/httpMemberService";
import { useNavigate, useLoaderData } from "react-router-dom";
import { getAuthToken } from "../../context/tokenProviderService";

const DeleteAccount = () => {
  const user = useLoaderData(); //
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (
      window.confirm(`${user?.userName || "사용자"}님, 정말 탈퇴하시겠습니까?`)
    ) {
      try {
        const { token } = getAuthToken(); //

        console.log(" 회원탈퇴 요청 -token:", token);

        await fetchDeleteAccount(token); //
        alert("회원탈퇴가 완료되었습니다.");
        navigate("/"); //
      } catch (error) {
        console.error(" 회원탈퇴 실패:", error);
        alert("회원탈퇴에 실패했습니다.");
      }
    }
  };

  return (
    <div className="delete-account">
      <h2>회원탈퇴</h2>
      <p>{user?.userName || "사용자"}님, 정말 탈퇴하시겠습니까?</p>
      <button
        onClick={handleDelete}
        style={{ backgroundColor: "red", color: "white" }}
      >
        회원탈퇴
      </button>
      <button onClick={() => navigate("/mypage")}>취소</button>
    </div>
  );
};

// loader()에서 fetchDeleteAccount를 호출하면 안됨
export async function loader() {
  const { token } = getAuthToken();
  console.log(" MyPage Loader - JWT Token:", token);
  return { token }; // 토큰만 반환
}

export default DeleteAccount;
