import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart", // 실제 URL이 맞는지 확인
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

//특정 지점의 모든 이벤트 조회

export async function fetchEventsByBranch(branchName) {
  try {
    console.log(`지점 ${branchName}의 이벤트 목록 요청`);
    // URL 경로 매개변수 형식으로 변경 (컨트롤러의 @GetMapping("/branch/{branchName}")과 일치하도록)
    const response = await instance.get(`/admin/event/branch/${branchName}`);

    console.log("이벤트 목록 응답:", response);
    return response.data;
  } catch (error) {
    console.error("이벤트 목록 조회 실패:", error);
    throw new Error(
      `지점 ${branchName}의 이벤트 목록 조회 실패: ${error.message}`
    );
  }
}

//이벤트 생성

export async function createEvent(eventData) {
  try {
    console.log("이벤트 생성 요청:", eventData);
    // 이미 @PostMapping과 일치함
    const response = await instance.post("/admin/event", eventData);

    console.log("이벤트 생성 응답:", response);
    return response.data;
  } catch (error) {
    console.error("이벤트 생성 실패:", error);
    throw new Error(`이벤트 생성 실패: ${error.message}`);
  }
}

//이벤트정보 수정

export async function updateEvent(eventId, eventData) {
  try {
    console.log(`이벤트 ${eventId} 수정 요청:`, eventData);
    // 이미 @PutMapping("/{eventId}")과 일치함
    const response = await instance.put(`/admin/event/${eventId}`, eventData);

    console.log("이벤트 수정 응답:", response);
    return response.data;
  } catch (error) {
    console.error("이벤트 수정 실패:", error);
    throw new Error(`이벤트 수정 실패: ${error.message}`);
  }
}

/**
 * 이벤트 삭제
 * @param {string} eventId - 삭제할 이벤트 ID
 * @returns {Promise} - 삭제 결과
 */
export async function fetchDeleteEvent(eventId) {
  try {
    console.log(`이벤트 ${eventId} 삭제 요청`);
    // 이미 @DeleteMapping("/{eventId}")과 일치함
    const response = await instance.delete(`/admin/event/${eventId}`);

    console.log("이벤트 삭제 응답:", response);
    return response.data;
  } catch (error) {
    console.error("이벤트 삭제 실패:", error);
    throw new Error(`이벤트 삭제 실패: ${error.message}`);
  }
}
