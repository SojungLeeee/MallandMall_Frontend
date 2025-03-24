import React, { useState, useEffect } from "react";
import {
  fetchMypageHome,
  fetchUpdateProfile,
} from "../../api/httpMemberService";
import { useNavigate, useLoaderData } from "react-router-dom";
import { getAuthToken } from "../../context/tokenProviderService";

const EditProfile = () => {
  const user = useLoaderData();
  const navigate = useNavigate();

  // ✅ 상태 변수 초기화 (기본값: 빈 문자열)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [post, setPost] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");

  // ✅ 회원 정보 불러와서 초기값 설정
  useEffect(() => {
    if (user) {
      setUsername(user.username || ""); // ✅ username으로 변경
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setPost(user.post || "");
      setAddr1(user.addr1 || "");
      setAddr2(user.addr2 || "");
    }
  }, [user]);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        console.log("📢 선택한 주소:", data);
        setPost(data.zonecode);
        setAddr1(data.roadAddress);
      },
    }).open();
  };

  const handleUpdate = async () => {
    try {
      const { token } = getAuthToken();

      // ✅ username으로 변경
      const updatedUsername = username.trim() === "" ? user.username : username;
      const updatedEmail = email.trim() === "" ? user.email : email;
      const updatedPhone =
        phoneNumber.trim() === "" ? user.phoneNumber : phoneNumber;
      const updatedPost = post.trim() === "" ? user.post : post;
      const updatedAddr1 = addr1.trim() === "" ? user.addr1 : addr1;
      const updatedAddr2 = addr2.trim() === "" ? user.addr2 : addr2;

      console.log("📢 회원정보 수정 API 호출 시도!", {
        username: updatedUsername,
        email: updatedEmail,
        phoneNumber: updatedPhone,
        post: updatedPost,
        addr1: updatedAddr1,
        addr2: updatedAddr2,
      });

      await fetchUpdateProfile(
        {
          username: updatedUsername,
          email: updatedEmail,
          phoneNumber: updatedPhone,
          post: updatedPost,
          addr1: updatedAddr1,
          addr2: updatedAddr2,
        },
        token
      );

      alert("회원정보가 수정되었습니다.");
      navigate("/mypage");
    } catch (error) {
      console.error("❌ 회원정보 수정 실패:", error);
    }
  };

  return (
    <div className="bg-[#fff6e2] p-8 rounded-xl shadow-lg w-full max-w-md mx-auto flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-center">회원정보 수정</h2>

      <div className="w-full flex flex-col mb-4">
        <label className="text-sm font-bold mb-1">이름:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="이름"
          className="w-full p-2 border border-gray-300 rounded-md text-base bg-[#f3e5ab]"
        />
      </div>

      <div className="w-full flex flex-col mb-4">
        <label className="text-sm font-bold mb-1">이메일:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="w-full p-2 border border-gray-300 rounded-md text-base bg-[#f3e5ab]"
        />
      </div>

      <div className="w-full flex flex-col mb-4">
        <label className="text-sm font-bold mb-1">휴대폰 번호:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="휴대폰 번호"
          className="w-full p-2 border border-gray-300 rounded-md text-base bg-[#f3e5ab]"
        />
      </div>

      <div className="w-full flex flex-col mb-4">
        <label className="text-sm font-bold mb-1">우편번호:</label>
        <div className="flex gap-2 items-center w-full">
          <input
            type="text"
            value={post}
            placeholder="우편번호"
            readOnly
            className="flex-grow p-2 border border-gray-300 rounded-md text-base bg-[#f3e5ab]"
          />
          <button
            type="button"
            onClick={handleAddressSearch}
            className="flex-shrink-0 py-2 px-3 text-sm font-bold bg-[#fdd835] border-none rounded-md whitespace-nowrap hover:bg-[#fbc02d]"
          >
            주소 검색
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col mb-4">
        <label className="text-sm font-bold mb-1">주소:</label>
        <input
          type="text"
          value={addr1}
          placeholder="주소"
          readOnly
          className="w-full p-2 border border-gray-300 rounded-md text-base bg-[#f3e5ab]"
        />
      </div>

      <div className="w-full flex flex-col mb-4">
        <label className="text-sm font-bold mb-1">상세 주소:</label>
        <input
          type="text"
          value={addr2}
          onChange={(e) => setAddr2(e.target.value)}
          placeholder="상세 주소"
          className="w-full p-2 border border-gray-300 rounded-md text-base bg-[#f3e5ab]"
        />
      </div>

      <div className="flex justify-between gap-2 w-full mt-2">
        <button
          onClick={handleUpdate}
          className="py-2 px-4 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
        >
          수정 완료
        </button>
        <button
          onClick={() => navigate("/mypage")}
          className="py-2 px-4 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export async function loader() {
  const { token } = getAuthToken();
  const response = await fetchMypageHome(token);
  return response.data;
}

export default EditProfile;
