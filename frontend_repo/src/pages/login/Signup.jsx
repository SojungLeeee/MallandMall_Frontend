import { Form, redirect, useActionData } from "react-router-dom";
import { fetchSignup } from "../../api/httpMemberService"; // 상대 경로로 가져오기
import { useState } from "react";

function Signup() {
  // 예외처리 ( 400 또는 500 발생됨)
  const responseErrorData = useActionData();
  console.log("useActionData:", responseErrorData);

  const [postcode, setPostcode] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");

  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        // 우편번호, 도로명 주소, 지번 주소 등 필요한 값 가져오기
        setPostcode(data.zonecode); // 우편번호
        setAddr1(data.roadAddress); // 도로명 주소
        setAddr2(data.jibunAddress); // 지번 주소
      },
    }).open();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#fff6e2] w-full max-w-[400px] h-screen p-5 rounded-xl shadow-lg">
      <div className="w-full">
        <Form method="post" autoComplete="off" className="space-y-6">
          {responseErrorData && responseErrorData.message && (
            <p className="text-red-600">{responseErrorData.message}</p>
          )}

          {/* 아이디 입력란 */}
          <div className="flex justify-between items-center space-x-4">
            <label htmlFor="userId" className="font-bold w-1/4">
              아이디
            </label>
            <input
              type="text"
              name="userId"
              id="userId"
              placeholder="아이디"
              className="w-3/4 p-3 text-lg border border-gray-300 rounded-2xl"
            />
          </div>

          {/* 비밀번호 입력란 */}
          <div className="flex justify-between items-center space-x-4">
            <label htmlFor="password" className="font-bold w-1/4">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="비밀번호"
              className="w-3/4 p-3 text-lg border border-gray-300 rounded-2xl"
            />
          </div>

          {/* 사용자 이름 입력란 */}
          <div className="flex justify-between items-center space-x-4">
            <label htmlFor="userName" className="font-bold w-1/4">
              이름
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              placeholder="이름"
              className="w-3/4 p-3 text-lg border border-gray-300 rounded-2xl"
            />
          </div>

          {/* 우편번호 입력란 */}
          <div className="flex justify-between items-center space-x-4">
            <label htmlFor="post" className="font-bold w-1/4">
              우편
            </label>
            <input
              type="text"
              name="post"
              id="post"
              value={postcode}
              placeholder="우편번호"
              readOnly
              className="w-3/4 p-3 text-lg border border-gray-300 rounded-2xl"
            />
            <button
              type="button"
              onClick={handlePostcodeSearch}
              className="w-1/5 p-2 bg-[#eeba7a] rounded-2xl text-white"
            >
              찾기
            </button>
          </div>

          {/* 주소 1 입력란 */}
          <div className="flex justify-between items-center space-x-4">
            <label htmlFor="addr1" className="font-bold w-1/4">
              주소 1
            </label>
            <input
              type="text"
              name="addr1"
              id="addr1"
              value={addr1 ? `${addr1} (${addr2})` : ""}
              placeholder="주소 1"
              readOnly
              className="w-3/4 p-3 text-lg border border-gray-300 rounded-2xl"
            />
          </div>

          {/* 주소 2 입력란 */}
          <div className="flex justify-between items-center space-x-4">
            <label htmlFor="addr2" className="font-bold w-1/4">
              주소 2
            </label>
            <input
              type="text"
              name="addr2"
              id="addr2"
              placeholder="주소 2"
              className="w-3/4 p-3 text-lg border border-gray-300 rounded-2xl"
            />
          </div>

          {/* 전화번호 입력란 */}
          <div className="flex justify-between items-center space-x-4">
            <label htmlFor="phoneNumber" className="font-bold w-1/4">
              전화번호
            </label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              placeholder="전화번호"
              className="w-3/4 p-3 text-lg border border-gray-300 rounded-2xl"
            />
          </div>

          {/* 이메일 입력란 */}
          <div className="flex justify-between items-center space-x-4">
            <label htmlFor="email" className="font-bold w-1/4">
              이메일
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="이메일"
              className="w-3/4 p-3 text-lg border border-gray-300 rounded-2xl"
            />
          </div>

          {/* 회원가입 버튼 */}
          <div>
            <button
              type="submit"
              name="signup"
              className="w-full bg-[#f9e687] text-black font-bold text-xl py-3 rounded-2xl"
            >
              회원가입
            </button>
          </div>
        </Form>
      </div>
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

  var response = null;

  try {
    response = await fetchSignup(authData);
    console.log("action.response>:", response);
    alert("회원가입이 완료되었습니다.");
  } catch (e) {
    console.log(">>>>>>>>>>>>>>>>>ERROR", e);
    if (e.status === 400) {
      return e.response.data;
    }
    if (e.status === 500) {
      return e.response.data;
    }
  }

  return redirect("/login");
}

export default Signup;
