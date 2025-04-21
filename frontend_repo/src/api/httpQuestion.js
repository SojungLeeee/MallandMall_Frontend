import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "https://morek9.click", // 베이스 URL 설정
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export async function getUserQuestions(userId, token) {
  try {
    const response = await instance.get(`/questions/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Response from getUserQuestions: ", response.data); // 서버 응답 확인
    return response.data;
  } catch (error) {
    console.error("❌ 문의 목록 불러오기 실패:", error.response ? error.response.data : error);
    throw error;
  }
}

// 질문 삭제하기 함수
export async function deleteQuestion(questionId, token) {
  try {
    const response = await instance.delete(`/questions/delete/${questionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // 성공적으로 삭제된 경우 서버의 응답 반환
  } catch (error) {
    console.log("토큰 값:", token);
    console.error("❌ 질문 삭제 실패:", error.response ? error.response.data : error);
    throw error;
  }
}

export async function updateAdminAnswer(answerId, content, token) {
  try {
    const response = await instance.put(
      `/answers/update/${answerId}`, // 답변 수정 API
      { content }, // 요청 본문: 수정된 답변 내용
      {
        headers: { Authorization: `Bearer ${token}` }, // 관리자 인증 토큰 포함
      }
    );
    return response.data; // 성공 메시지 반환
  } catch (error) {
    console.error("❌ 답변 수정 실패:", error.response ? error.response.data : error);
    throw error;
  }
}

// 질문 상세 정보 가져오기 (답변 포함)
export const getQuestionDetail = async (questionId, token) => {
  try {
    const response = await instance.get(`/answers/question/${questionId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // 인증 토큰 추가
      },
    });
    return response.data; // 답변 목록 반환
  } catch (error) {
    console.error("❌ 질문 상세 가져오기 실패:", error);
    throw error; // 에러 던지기
  }
};

// 관리자 답변 추가 함수
export async function addAdminAnswer(questionId, content, token) {
  try {
    const response = await instance.post(
      `/answers/add/${questionId}`, // 답변 추가 API
      { content }, // 요청 본문: 답변 내용
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }, // 관리자 인증 토큰 포함
      }
    );
    return response.data; // 성공 메시지 반환
  } catch (error) {
    console.error("❌ 답변 등록 실패:", error.response ? error.response.data : error);
    throw error;
  }
}

// 관리자 답변 삭제 함수 추가
export async function deleteAdminAnswer(answerId, token) {
  try {
    const response = await instance.delete(`/answers/delete/${answerId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // 관리자 인증 토큰 포함
      },
    });
    return response.data; // 성공 메시지 반환
  } catch (error) {
    console.error("❌ 답변 삭제 실패:", error.response ? error.response.data : error);
    throw error;
  }
}
