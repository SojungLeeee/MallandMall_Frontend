import {
  Form,
  redirect,
  json,
  useActionData,
  useNavigate,
} from "react-router-dom";
import { fetchAuthenticate } from "../../api/httpMemberService"; // 상대 경로로 가져오기

function Login() {
  // 예외처리
  const data = useActionData();
  const navigate = useNavigate();
  console.log("useActionData:", data);

  const handleResetPassword = () => {
    navigate("/reset-password"); // 비밀번호 재설정 페이지로 이동
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[390px]  text-xl  h-full">
      <img
        src={"/images/Loginimage.png"}
        width="250"
        height="250"
        className="mb-5"
        alt="logo"
      />

      {data && <p>{data.message}</p>}
      <Form method="post" className="w-full mb-5">
        <div className="flex flex-col items-center justify-center">
          <input
            type="text"
            name="userId"
            placeholder="아이디"
            className="w-[70%] h-12 text-xl bg-[#eae1e1] border-[#eae1e1] rounded-2xl text-center font-bold"
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            className="w-[70%] h-12 text-xl bg-[#eae1e1] border-[#eae1e1] rounded-2xl text-center font-bold"
          />
          <button
            name="login"
            className="mt-5 w-[60%] h-12 text-xl bg-[#f9e687] border-[#f9e687] rounded-2xl font-bold"
          >
            로그인
          </button>
        </div>
      </Form>
      <div className="text-center">
        <a
          href="/findid"
          className="mb-4 text-[#6c6c6c] font-bold no-underline cursor-pointer text-xl"
        >
          아이디 찾기
        </a>
        <br />
        <a
          href="/reset-password"
          className="mb-4 text-[#6c6c6c] font-bold no-underline cursor-pointer text-xl"
        >
          비밀번호 재설정
        </a>
        <br />
        <a
          href="/signup"
          className="text-[#6c6c6c] font-bold no-underline cursor-pointer text-xl"
        >
          회원가입
        </a>
        <br />
      </div>
    </div>
  );
}

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    userId: data.get("userId"),
    password: data.get("password"),
  };
  console.log("authData>>", authData);

  let response = null;

  try {
    response = await fetchAuthenticate(authData);
    console.log("로그인 요청결과:", response);
    const token = response.data.token;
    localStorage.setItem("jwtAuthToken", token);
    localStorage.setItem("userId", authData.userId);
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
