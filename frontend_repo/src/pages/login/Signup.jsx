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
    backgroundColor: "#fff6e2",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "28rem", // max-w-md에 해당
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll", // 스크롤 가능
    scrollbarWidth: "none", // Firefox에서 스크롤바 숨기기
  };

  // Webkit을 사용하는 브라우저에서 스크롤바 숨기기
  const webkitScrollbarStyle = {
    "&::-webkit-scrollbar": {
      display: "none",
    },
  };

  return (
    <div style={containerStyle}>
      <h2 className="text-2xl font-bold mb-5 text-center">회원가입</h2>

      {responseErrorData && responseErrorData.message && (
        <p className="text-red-600 text-center mb-4">
          {responseErrorData.message}
        </p>
      )}

      <Form
        method="post"
        autoComplete="off"
        className="space-y-6 flex flex-col"
      >
        {/* 아이디 입력란 */}
        <div className="flex items-center space-x-4">
          <label htmlFor="userId" className="font-semibold w-1/3">
            아이디
          </label>
          <input
            type="text"
            name="userId"
            id="userId"
            placeholder="아이디"
            className="p-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 w-2/3"
          />
        </div>

        {/* 비밀번호 입력란 */}
        <div className="flex items-center space-x-4">
          <label htmlFor="password" className="font-semibold w-1/3">
            비밀번호
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="비밀번호"
            className="p-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 w-2/3"
          />
        </div>

        {/* 사용자 이름 입력란 */}
        <div className="flex items-center space-x-4">
          <label htmlFor="userName" className="font-semibold w-1/3">
            이름
          </label>
          <input
            type="text"
            name="userName"
            id="userName"
            placeholder="이름"
            className="p-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 w-2/3"
          />
        </div>

        {/* 우편번호 입력란 */}
        <div className="flex items-center space-x-4">
          <label htmlFor="post" className="font-semibold w-1/3">
            우편번호
          </label>
          <div className="flex items-center space-x-4 w-2/3">
            <input
              type="text"
              name="post"
              id="post"
              value={postcode}
              placeholder="우편번호"
              readOnly
              className="p-3 text-lg border border-gray-300 rounded-2xl w-4/5"
            />
            <button
              type="button"
              onClick={handlePostcodeSearch}
              className="w-[20%] p-3 bg-[#eeba7a] text-white rounded-2xl"
            >
              찾기
            </button>
          </div>
        </div>

        {/* 주소 1 입력란 */}
        <div className="flex items-center space-x-4">
          <label htmlFor="addr1" className="font-semibold w-1/3">
            주소 1
          </label>
          <input
            type="text"
            name="addr1"
            id="addr1"
            value={addr1 ? `${addr1} (${addr2})` : ""}
            placeholder="주소 1"
            readOnly
            className="p-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 w-2/3"
          />
        </div>

        {/* 주소 2 입력란 */}
        <div className="flex items-center space-x-4">
          <label htmlFor="addr2" className="font-semibold w-1/3">
            주소 2
          </label>
          <input
            type="text"
            name="addr2"
            id="addr2"
            placeholder="주소 2"
            className="p-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 w-2/3"
          />
        </div>

        {/* 전화번호 입력란 */}
        <div className="flex items-center space-x-4">
          <label htmlFor="phoneNumber" className="font-semibold w-1/3">
            전화번호
          </label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="전화번호"
            className="p-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 w-2/3"
          />
        </div>

        {/* 이메일 입력란 */}
        <div className="flex items-center space-x-4">
          <label htmlFor="email" className="font-semibold w-1/3">
            이메일
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="이메일"
            className="p-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 w-2/3"
          />
        </div>

        {/* 회원가입 버튼 */}
        <div className="mt-auto">
          <button
            type="submit"
            name="signup"
            className="w-full py-3 text-xl bg-[#f9e687] text-black font-bold rounded-2xl focus:outline-none hover:bg-[#e2d267]"
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

  return redirect("/selectCategory");
}

export default Signup;
