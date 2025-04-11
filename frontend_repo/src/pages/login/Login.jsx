import {
  Form,
  redirect,
  json,
  useActionData,
  useNavigate,
} from "react-router-dom";
import { fetchAuthenticate } from "../../api/httpMemberService"; // 상대 경로로 가져오기
import { setAuthToken } from "../../auth/tokenProviderService";
import Logo from "../../assets/images/logo/Logo.png";
import KakaoLoginButton from "../../components/ui/button/KakaoLoginButton";
import GoogleLoginButton from "../../components/ui/button/GoogleLoginButton";
import NaverLoginButton from "../../components/ui/button/NaverLoginButton";

// 소셜 로그인 버튼 컨테이너 컴포넌트
const SocialLoginButtons = () => {
  return (
    <div className="w-full flex flex-col items-center mt-4">
      <p className="text-[#6c6c6c] text-sm mb-3">소셜 계정 로그인</p>
      <div className="flex justify-center items-center gap-4">
        <KakaoLoginButton />
        <GoogleLoginButton />
        <NaverLoginButton />
      </div>
    </div>
  );
};

function Login() {
  // 예외처리
  const data = useActionData();
  const navigate = useNavigate();
  console.log("useActionData:", data);

  const handleResetPassword = () => {
    navigate("/reset-password"); // 비밀번호 재설정 페이지로 이동
  };

  return (
    <div className="flex flex-col items-center justify-center w-full text-xl h-full">
      {/* 자동완성 시 배경색 변경 방지를 위한 스타일 */}
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
          
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover,
          textarea:-webkit-autofill:focus,
          textarea:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            -webkit-text-fill-color: black !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}
      </style>

      {/* 로고 이미지 */}
      <img src={Logo} width="250" height="250" className="mb-5" alt="logo" />

      {data && <p>{data.message}</p>}
      <Form method="post" className="w-full mb-2" autoComplete="off">
        <div className="flex flex-col items-center justify-center">
          {/* 아이디 입력 */}
          <input
            type="text"
            name="userId"
            placeholder="아이디"
            className="w-[85%] h-12 text-base border border-gray-300 rounded-sm px-4 mb-3 
                     focus:outline-none focus:ring-0 focus:border-gray-300"
            style={{
              WebkitAppearance: "none",
              backgroundColor: "white",
            }}
          />

          {/* 비밀번호 입력 */}
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            className="w-[85%] h-12 text-base border border-gray-300 rounded-sm px-4 
                     focus:outline-none focus:ring-0 focus:border-gray-300"
            style={{
              WebkitAppearance: "none",
              backgroundColor: "white",
            }}
          />

          {/* 계정 찾기, 비밀번호 찾기, 회원가입 링크 */}
          <div className="flex justify-end w-[85%] text-xs text-gray-500 gap-1 mt-2 mb-4 pr-1">
            <a href="/findid" className="no-underline cursor-pointer">
              계정 찾기
            </a>
            <span>|</span>
            <a href="/reset-password" className="no-underline cursor-pointer">
              비밀번호 찾기
            </a>
            <span>|</span>
            <a href="/signup" className="no-underline cursor-pointer">
              회원가입
            </a>
          </div>

          {/* 로그인 버튼 */}
          <button
            name="login"
            className="w-[84%] h-12 text-xl bg-[#1a1a1a] text-white border-none rounded font-bold mb-2
             shadow-md hover:bg-[#2c2c2c] hover:translate-y-[-2px] transition-all
             focus:outline-none focus:ring-0 
             duration-300 ease-in-out"
          >
            로그인
          </button>
        </div>
      </Form>

      {/* 소셜 로그인 버튼들 */}
      <SocialLoginButtons />
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
