import React from "react";
import { fetchDeleteAccount } from "../../api/httpMemberService";
import { useNavigate, useLoaderData } from "react-router-dom";
import { getAuthToken } from "../../context/tokenProviderService";

const DeleteAccount = () => {
  const user = useLoaderData();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (
      window.confirm(`${user?.userName || "사용자"}님, 정말 탈퇴하시겠습니까?`)
    ) {
      try {
        const { token } = getAuthToken();

        console.log(" 회원탈퇴 요청 -token:", token);

        await fetchDeleteAccount(token);
        alert("회원탈퇴가 완료되었습니다.");
        navigate("/");
      } catch (error) {
        console.error(" 회원탈퇴 실패:", error);
        alert("회원탈퇴에 실패했습니다.");
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-sm shadow-lg w-full max-w-md mx-auto flex flex-col border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-black text-center">
        회원탈퇴
      </h2>

      <div className="bg-gray-50 p-5 rounded-sm border-l-4 border-black mb-6">
        <p className="text-gray-700 mb-2">
          회원탈퇴 시 다음 사항을 확인해주세요:
        </p>
        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-3">
          <li>모든 개인정보는 즉시 삭제됩니다</li>
          <li>주문 내역 및 리뷰는 삭제되지 않을 수 있습니다</li>
          <li>탈퇴 후에는 복구가 불가능합니다</li>
        </ul>
      </div>

      <p className="text-center mb-6 font-medium">
        <span className="text-gray-700">
          {user?.userName || "사용자"}님, 정말 탈퇴하시겠습니까?
        </span>
      </p>

      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={handleDelete}
          className="py-3 px-6 bg-black text-white font-medium rounded-sm hover:bg-gray-800 transition-colors"
        >
          회원탈퇴 확인
        </button>

        <button
          onClick={() => navigate("/mypage")}
          className="py-3 px-6 bg-white text-black font-medium rounded-sm border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          취소하고 돌아가기
        </button>
      </div>
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
