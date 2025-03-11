import { useParams } from "react-router-dom";

export default function FoundId() {
  const { id } = useParams(); // URL에서 아이디를 가져옴
  console.log("FoundId에서 받은 아이디:", id); // 아이디 확인

  return (
    <div className="found-id-container">
      <div className="found-id-card">
        <h2>아이디 찾기 결과</h2>
        {id === "notfound" ? (
          <p>아이디를 찾을 수 없습니다.</p> // "아이디를 찾을 수 없으면" 표시
        ) : (
          <p>
            찾은 아이디: <strong>{id}</strong>
          </p> // 아이디를 찾으면 표시
        )}
        <button onClick={() => (window.location.href = "/login")}>확인</button>
      </div>
    </div>
  );
}
