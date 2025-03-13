import { useLocation, useNavigate } from "react-router-dom"; // useLocation과 useNavigate를 사용

export default function FoundId() {
  const location = useLocation(); // useLocation을 사용하여 state를 받음
  const navigate = useNavigate(); // useNavigate를 사용하여 페이지 이동
  const { userId, createDate } = location.state || {}; // state가 없으면 빈 객체로 기본값 설정

  console.log("FoundId에서 받은 userId:", userId); // userId 확인
  console.log("FoundId에서 받은 createDate:", createDate); // createDate 확인

  return (
    <div className="flex items-center justify-center w-full h-full bg-[#fff6e2] p-5">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5 text-center">
          아이디 찾기 결과
        </h2>
        {userId === "notfound" ? (
          <p className="text-lg text-red-500 text-center">
            아이디를 찾을 수 없습니다.
          </p> // "아이디를 찾을 수 없으면" 표시
        ) : (
          <div>
            <p className="text-lg mb-4">
              찾은 아이디:{" "}
              <strong className="text-xl font-semibold">{userId}</strong>
            </p>
            <p className="text-lg mb-6">
              계정 생성일:{" "}
              <strong className="text-xl font-semibold">{createDate}</strong>
            </p>
          </div>
        )}
        <div className="space-y-4 text-center">
          <button
            onClick={() => navigate("/login")} // 로그인 페이지로 이동
            className="w-full py-3 text-xl bg-[#cbe8ac] rounded-xl font-bold hover:bg-[#e2d267] focus:outline-none"
          >
            로그인하기
          </button>
          <button
            onClick={() => navigate("/reset-password")} // 비밀번호 재설정 페이지로 이동
            className="w-full py-3 text-xl bg-[#f9e687] rounded-xl font-bold hover:bg-[#e2d267] focus:outline-none"
          >
            비밀번호 재설정
          </button>
        </div>
      </div>
    </div>
  );
}
