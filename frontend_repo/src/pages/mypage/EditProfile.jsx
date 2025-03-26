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

  // 상태 변수 초기화 (기본값: 빈 문자열)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [post, setPost] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");

  // 회원 정보 불러와서 초기값 설정
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
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
    <div className="bg-white p-8 rounded-sm shadow-md w-full max-w-md mx-auto flex flex-col border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-center text-black">
        회원정보 수정
      </h2>

      <div className="w-full flex flex-col mb-5">
        <label className="text-sm font-medium mb-1 text-gray-700 text-left">
          이름
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="이름"
          className="w-full p-3 border border-gray-200 rounded-sm text-base bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
        />
      </div>

      <div className="w-full flex flex-col mb-5">
        <label className="text-sm font-medium mb-1 text-gray-700 text-left">
          이메일
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="w-full p-3 border border-gray-200 rounded-sm text-base bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
        />
      </div>

      <div className="w-full flex flex-col mb-5">
        <label className="text-sm font-medium mb-1 text-gray-700 text-left">
          휴대폰 번호
        </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="휴대폰 번호"
          className="w-full p-3 border border-gray-200 rounded-md text-base bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
        />
      </div>

      <div className="w-full flex flex-col mb-5">
        <label className="text-sm font-medium mb-1 text-gray-700 text-left">
          우편번호
        </label>
        <div className="flex gap-2 items-center w-full">
          <input
            type="text"
            value={post}
            placeholder="우편번호"
            readOnly
            className="flex-grow p-3 border border-gray-200 rounded-sm text-base bg-gray-50 text-gray-500"
          />
          <button
            type="button"
            onClick={handleAddressSearch}
            className="flex-shrink-0 py-3 px-4 text-sm font-medium bg-black text-white border-none rounded-sm whitespace-nowrap hover:bg-gray-800 transition-colors"
          >
            주소 검색
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col mb-5">
        <label className="text-sm font-medium mb-1 text-gray-700 text-left">
          주소
        </label>
        <input
          type="text"
          value={addr1}
          placeholder="주소"
          readOnly
          className="w-full p-3 border border-gray-200 rounded-sm text-base bg-gray-50 text-gray-500"
        />
      </div>

      <div className="w-full flex flex-col mb-6">
        <label className="text-sm font-medium mb-1 text-gray-700 text-left">
          상세 주소
        </label>
        <input
          type="text"
          value={addr2}
          onChange={(e) => setAddr2(e.target.value)}
          placeholder="상세 주소"
          className="w-full p-3 border border-gray-200 rounded-md text-base bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
        />
      </div>

      <div className="flex justify-between gap-3 w-full mt-2">
        <button
          onClick={handleUpdate}
          className="py-3 px-6 bg-black text-white font-medium rounded-sm hover:bg-gray-800 transition-colors flex-1"
        >
          수정 완료
        </button>
        <button
          onClick={() => navigate("/mypage")}
          className="py-3 px-6 bg-white text-black font-medium rounded-sm border border-gray-300 hover:bg-gray-100 transition-colors flex-1"
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
