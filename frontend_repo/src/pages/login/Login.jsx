import "./Login.css";

import { Form, redirect, json, useActionData } from "react-router-dom";
import { fetchAuthenticate } from "../../api/httpMemberService"; // 상대 경로로 가져오기
import mart from "../../assets/images/mart.png";

function Login() {
  // 예외처리
  const data = useActionData();
  console.log("useActionData:", data);

  return (
    <div className="container">
      <p>아래 사진은 그냥 로고 들어갈 자리..</p>
      <img src={mart} width="350" height="200"></img>

      {data && <p>{data.message}</p>}
      <Form method="post">
        <div className="inputs">
          <input type="text" name="userid" placeholder="아이디" /> <br></br>
          <input type="password" name="passwd" placeholder="비밀번호" />
          <button name="login" className="btn">
            로그인
          </button>
        </div>
      </Form>
      <div className="plus">
        <a href="/findid">아이디 찾기</a> <br></br>
        <a href="#">비밀번호 찾기</a> <br></br>
        <a href="/signup">회원가입</a> <br></br>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    userid: data.get("userid"),
    passwd: data.get("passwd"),
  };
  console.log("authData>>", authData);

  let response = null;

  try {
    response = await fetchAuthenticate(authData);

    console.log("로그인 요청결과:", response);
    const token = response.data.token;
    localStorage.setItem("jwtAuthToken", token);
    localStorage.setItem("userid", authData.userid);
  } catch (e) {
    if (e.status === 400) {
      console.log("id 또는 비번  에러 발생1:", e);
      console.log("id 또는 비번  에러 발생2:", e.response.data);
      return { message: e.response.data };
    }
  }

  return redirect("/");
}

export default Login;
