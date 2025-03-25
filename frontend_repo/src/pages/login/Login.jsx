import { Form, redirect, json, useActionData, useNavigate } from "react-router-dom";
import { fetchAuthenticate } from "../../api/httpMemberService"; // 상대 경로로 가져오기
import { setAuthToken } from "../../auth/tokenProviderService";
import Logo from "../../assets/images/logo/Logo.png";
import KakaoLoginButton from "../../components/ui/button/KakaoLoginButton";
import GoogleLoginButton from "../../components/ui/button/GoogleLoginButton";

function Login() {
  // 예외처리
  const data = useActionData();
  const navigate = useNavigate();
  console.log("useActionData:", data);

  const handleResetPassword = () => {
    navigate("/reset-password"); // 비밀번호 재설정 페이지로 이동
  };

  return (
    <div className="flex flex-col items-center justify-center w-full   text-xl  h-full">
      <img src={Logo} width="250" height="250" className="mb-5" alt="logo" />

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

      {/* 소셜 로그인 버튼들 */}
      <div className="w-full flex flex-col items-center mb-4">
        <p className="text-[#6c6c6c] mb-2">소셜 계정으로 로그인</p>
        <GoogleLoginButton /> {/* Google 로그인 버튼 */}
        <KakaoLoginButton />
      </div>

      <div className="text-center">
        <a href="/findid" className="mb-4 text-[#6c6c6c] font-bold no-underline cursor-pointer text-xl">
          아이디 찾기
        </a>
        <br />
        <a href="/reset-password" className="mb-4 text-[#6c6c6c] font-bold no-underline cursor-pointer text-xl">
          비밀번호 재설정
        </a>
        <br />
        <a href="/signup" className="text-[#6c6c6c] font-bold no-underline cursor-pointer text-xl">
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

  try {
    const response = await fetchAuthenticate(authData);

    if (!response || !response.data) {
      throw new Error("서버에서 유효한 응답을 받지 못했습니다.");
    }

    const { token, userId, role } = response.data;
    setAuthToken({ token, userId, role });

    return redirect("/");
  } catch (e) {
    console.error("로그인 실패:", e);

    let errorMessage = "로그인에 실패했습니다. 다시 시도해 주세요.";

    if (e.response) {
      if (e.response.status === 401) {
        errorMessage = "아이디 또는 비밀번호가 잘못되었습니다.";
      } else if (e.response.status === 404) {
        errorMessage = "사용자를 찾을 수 없습니다.";
      } else {
        errorMessage = e.response.data || errorMessage;
      }
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: e.response?.status || 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default Login;
