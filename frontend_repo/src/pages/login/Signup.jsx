import { Form, redirect, useActionData } from "react-router-dom";
import { useState } from "react";
import { fetchSignup } from "../../api/httpMemberService"; // 상대 경로로 가져오기

function Signup() {
  // 예외처리 (400 또는 500 발생됨)
  const responseErrorData = useActionData();
  console.log("useActionData:", responseErrorData);

  const [postcode, setPostcode] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");

  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setPostcode(data.zonecode); // 우편번호
        setAddr1(data.roadAddress); // 도로명 주소
        setAddr2(data.jibunAddress); // 지번 주소
      },
    }).open();
  };

  // 인라인 스타일로 스크롤바 숨기기 설정
  const containerStyle = {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    width: "100%",
    maxWidth: "32rem", // 컨테이너 너비 증가
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll", // 스크롤 가능
    scrollbarWidth: "none", // Firefox에서 스크롤바 숨기기
  };

  return (
    <div style={containerStyle}>
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        회원가입
      </h2>

      {/* 자동완성 배경색 제거를 위한 스타일 */}
      <style>
        {`
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            -webkit-text-fill-color: black !important;
            transition: background-color 5000s ease-in-out 0s;
          }
          
          /* 스크롤바 숨기기 */
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {responseErrorData && responseErrorData.message && (
        <p className="text-red-600 text-center mb-4">
          {responseErrorData.message}
        </p>
      )}

      <Form
        method="post"
        autoComplete="off"
        className="space-y-5 flex flex-col"
      >
        {/* 아이디 입력란 */}
        <div className="flex items-center">
          <label
            htmlFor="userId"
            className="font-semibold text-gray-700 w-24 text-left mr-6 text-sm"
          >
            아이디
          </label>
          <input
            type="text"
            name="userId"
            id="userId"
            placeholder="아이디"
            className="flex-grow p-3.5 text-base border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
            style={{ WebkitAppearance: "none", backgroundColor: "white" }}
          />
        </div>

        {/* 비밀번호 입력란 */}
        <div className="flex items-center">
          <label
            htmlFor="password"
            className="font-semibold text-gray-700 w-24 text-left mr-6 text-sm"
          >
            비밀번호
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="비밀번호"
            className="flex-grow p-3.5 text-base border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
            style={{ WebkitAppearance: "none", backgroundColor: "white" }}
          />
        </div>

        {/* 사용자 이름 입력란 */}
        <div className="flex items-center">
          <label
            htmlFor="userName"
            className="font-semibold text-gray-700 w-24 text-left mr-6 text-sm"
          >
            이름
          </label>
          <input
            type="text"
            name="userName"
            id="userName"
            placeholder="이름"
            className="flex-grow p-3.5 text-base border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
            style={{ WebkitAppearance: "none", backgroundColor: "white" }}
          />
        </div>

        {/* 우편번호 입력란 */}
        <div className="flex items-center">
          <label
            htmlFor="post"
            className="font-semibold text-gray-700 w-24 text-left mr-6 text-sm"
          >
            우편
          </label>
          <div className="flex items-center flex-grow space-x-2">
            <input
              type="text"
              name="post"
              id="post"
              value={postcode}
              placeholder="우편번호"
              readOnly
              className="flex-grow w-1/5 p-3.5 text-base border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
              style={{ WebkitAppearance: "none", backgroundColor: "white" }}
            />
            <button
              type="button"
              onClick={handlePostcodeSearch}
              className="w-20px p-3 bg-black text-white rounded-sm text-sm hover:bg-gray-800 transition-all"
            >
              찾기
            </button>
          </div>
        </div>

        {/* 주소 1 입력란 */}
        <div className="flex items-center">
          <label
            htmlFor="addr1"
            className="font-semibold text-gray-700 w-24 text-left mr-6 text-sm"
          >
            주소 1
          </label>
          <input
            type="text"
            name="addr1"
            id="addr1"
            value={addr1 ? `${addr1} (${addr2})` : ""}
            placeholder="주소 1"
            readOnly
            className="flex-grow p-3.5 text-base border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
            style={{ WebkitAppearance: "none", backgroundColor: "white" }}
          />
        </div>

        {/* 주소 2 입력란 */}
        <div className="flex items-center">
          <label
            htmlFor="addr2"
            className="font-semibold text-gray-700 w-24 text-left mr-6 text-sm"
          >
            주소 2
          </label>
          <input
            type="text"
            name="addr2"
            id="addr2"
            placeholder="주소 2"
            className="flex-grow p-3.5 text-base border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
            style={{ WebkitAppearance: "none", backgroundColor: "white" }}
          />
        </div>

        {/* 전화번호 입력란 */}
        <div className="flex items-center">
          <label
            htmlFor="phoneNumber"
            className="font-semibold text-gray-700 w-24 text-left mr-6 text-sm"
          >
            전화번호
          </label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="전화번호"
            className="flex-grow p-3.5 text-base border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
            style={{ WebkitAppearance: "none", backgroundColor: "white" }}
          />
        </div>

        {/* 이메일 입력란 */}
        <div className="flex items-center">
          <label
            htmlFor="email"
            className="font-semibold text-gray-700 w-24 text-left mr-6 text-sm"
          >
            이메일
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="이메일"
            className="flex-grow p-3.5 text-base border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
            style={{ WebkitAppearance: "none", backgroundColor: "white" }}
          />
        </div>

        {/* 회원가입 버튼 */}
        <div className="mt-6">
          <button
            type="submit"
            name="signup"
            className="w-full py-3.5 text-base bg-black text-white font-medium rounded-md shadow-md 
                       hover:bg-gray-800 hover:translate-y-[-2px] transition-all duration-300 ease-in-out 
                       focus:outline-none focus:ring-0"
          >
            회원가입
          </button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    userId: data.get("userId"),
    password: data.get("password"),
    userName: data.get("userName"),
    post: data.get("post"),
    addr1: data.get("addr1"),
    addr2: data.get("addr2"),
    phoneNumber: data.get("phoneNumber"),
    email: data.get("email"),
  };
  console.log("authData>>", authData);

  let response = null;

  try {
    response = await fetchSignup(authData);
    console.log("action.response>:", response);
    alert("회원가입이 완료되었습니다.");
  } catch (e) {
    console.log(">>>>>>>>>>>>>>>>>ERROR", e);
    if (e.status === 400 || e.status === 500) {
      return e.response.data;
    }
  }

  // Redirect to /selectCategory with userId as a query parameter
  return redirect(`/selectCategory?userId=${authData.userId}`);
}

export default Signup;
