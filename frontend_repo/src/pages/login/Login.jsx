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

    // 🔥 응답 구조 검증 추가
    if (!response || !response.data) {
      throw new Error("서버에서 유효한 응답을 받지 못했습니다.");
    }

    const { token, userId, role } = response.data;

    // 🔥 role 저장 추가
    setAuthToken({ token, userId, role });

    return redirect("/");
  } catch (e) {
    console.error("로그인 실패:", e);

    // 🔥 e.response.data가 없는 경우 처리
    const errorMessage =
      e.response?.data || "로그인에 실패했습니다. 다시 시도해 주세요.";
    return { message: errorMessage };
  }
}

export default Login;
