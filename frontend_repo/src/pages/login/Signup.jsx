import "./Signup.css";
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
    <div className="container">
      <div className="signups">
        <div className="form">
          <Form method="post" autoComplete="off">
            {responseErrorData && responseErrorData.message && (
              <p>{responseErrorData.message}</p>
            )}

            {/* 아이디 입력란 */}
            <div className="input-group">
              <label htmlFor="userId">아이디</label>
              <input
                type="text"
                name="userId"
                id="userId"
                placeholder="아이디"
              />
            </div>

            {/* 비밀번호 입력란 */}
            <div className="input-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="비밀번호"
              />
            </div>

            {/* 사용자 이름 입력란 */}
            <div className="input-group">
              <label htmlFor="username">이름</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="이름"
              />
            </div>

            {/* 우편번호 입력란 */}
            <div className="input-group flex-container">
              <label htmlFor="post">우편</label>
              <input
                className="postinput"
                type="text"
                name="post"
                id="post"
                value={postcode} // 우편번호 상태로 입력 필드 값 설정
                placeholder="우편번호"
                readOnly
              />
              <button
                type="button"
                className="btnfind"
                onClick={handlePostcodeSearch} // onClick으로 처리
              >
                찾기
              </button>
            </div>

            {/* 주소 1 입력란 */}
            <div className="input-group">
              <label htmlFor="addr1">주소 1</label>
              <input
                className="post"
                type="textarea"
                name="addr1"
                id="addr1"
                value={addr1 ? `${addr1} (${addr2})` : ""} // addr2를 괄호로 감싸서 결합
                placeholder="주소 1"
                readOnly
              />
            </div>

            {/* 주소 2 입력란 */}
            <div className="input-group">
              <label htmlFor="addr2">주소 2</label>
              <input
                type="text"
                name="addr2"
                id="addr2"
                // 지번 주소 상태로 입력 필드 값 설정
                placeholder="주소 2"
              />
            </div>

            {/* 전화번호 입력란 */}
            <div className="input-group">
              <label htmlFor="phoneNumber">전화번호</label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="전화번호"
              />
            </div>

            {/* 이메일 입력란 */}
            <div className="input-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="이메일"
              />
            </div>

            {/* 회원가입 버튼 */}
            <div>
              <button name="signup" className="btn">
                회원가입
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }) {
  // 실제 boot 서버와 연동:  api/httpMemberService.js 의
  // fetchSignup() 함수와 연동

  // 회원가입폼 데이터 얻기
  const data = await request.formData();
  const authData = {
    userId: data.get("userId"),
    password: data.get("password"),
    username: data.get("username"),
    post: data.get("post"),
    addr1: data.get("addr1"),
    addr2: data.get("addr2"),
    phoneNumber: data.get("phoneNumber"),
    email: data.get("email"),
  };
  console.log("authData>>", authData);

  var response = null;

  //boot에서 400(유효성에러) 또는 500(userId중복에러) 넘어옴
  // 이때 try~catch로 처리해서 useActionData() 이용해서 처리(화면이 안바뀜)
  // 만약 try~catch 사용안하면 errorElement:ErrorPage 처리됨(화면이 바뀜)
  try {
    response = await fetchSignup(authData);
    console.log("action.response>:", response);

    // 회원가입 성공 시 알림 띄우기
    alert("회원가입이 완료되었습니다.");
  } catch (e) {
    console.log(">>>>>>>>>>>>>>>>>ERROR", e);

    if (e.status === 400) {
      console.log("유효성 에러 발생1:", e);
      console.log("유효성 에러 발생2:", e.response.data);
      return e.response.data; // JSON리턴
    }

    if (e.status === 500) {
      console.log("id 중복에러 발생:", e);
      console.log("id 중복에러 발생2:", e.response.data);
      return e.response.data;
    }
  }

  return redirect("/login"); // 성공 시 로그인 화면으로 가기 (로그인 하도록)
}

export default Signup;
