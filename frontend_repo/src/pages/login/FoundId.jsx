import { useLocation } from "react-router-dom"; // useLocation을 사용하여 state를 받음

export default function FoundId() {
  const location = useLocation(); // useLocation을 사용하여 state를 받음
  const { userId, createDate } = location.state || {}; // state가 없으면 빈 객체로 기본값 설정

  console.log("FoundId에서 받은 userId:", userId); // userId 확인
  console.log("FoundId에서 받은 createDate:", createDate); // createDate 확인

  return (
    <div className="found-id-container">
      <div className="found-id-card">
        <h2>아이디 찾기 결과</h2>
        {userId === "notfound" ? (
          <p>아이디를 찾을 수 없습니다.</p> // "아이디를 찾을 수 없으면" 표시
        ) : (
          <div>
            <p>
              찾은 아이디: <strong>{userId}</strong>
            </p>
            <p>
              계정 생성일: <strong>{createDate}</strong>
            </p>
          </div>
        )}
        <button onClick={() => (window.location.href = "/login")}>확인</button>
      </div>
    </div>
  );
}
