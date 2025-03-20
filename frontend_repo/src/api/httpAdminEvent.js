import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart", // 실제 URL이 맞는지 확인
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/**
 * 특정 지점의 모든 이벤트 조회
 * @param {string} branch - 지점 코드
 * @returns {Promise} - 이벤트 목록
 */
export async function fetchEventsByBranch(branch) {
  try {
    console.log(`지점 ${branch}의 이벤트 목록 요청`);
    const response = await instance.get(`/admin/event/branch/${branch}`);

    console.log("이벤트 목록 응답:", response);
    return response.data;
  } catch (error) {
    console.error("이벤트 목록 조회 실패:", error);
    throw new Error(`지점 ${branch}의 이벤트 목록 조회 실패: ${error.message}`);
  }
}

/**
 * 새 이벤트 생성
 * @param {Object} eventData - 이벤트 데이터
 * @returns {Promise} - 생성 결과
 */
export async function createEvent(eventData) {
  try {
    console.log("이벤트 생성 요청:", eventData);
    const response = await instance.post("/admin/event", eventData);

    console.log("이벤트 생성 응답:", response);
    return response.data;
  } catch (error) {
    console.error("이벤트 생성 실패:", error);
    throw new Error(`이벤트 생성 실패: ${error.message}`);
  }
}

/**
 * 이벤트 정보 수정
 * @param {string} eventId - 이벤트 ID
 * @param {Object} eventData - 수정할 이벤트 데이터
 * @returns {Promise} - 수정 결과
 */
export async function updateEvent(eventId, eventData) {
  try {
    console.log(`이벤트 ${eventId} 수정 요청:`, eventData);
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

export async function deleteEvent(eventId) {
  try {
    console.log(`이벤트 ${eventId} 삭제 요청`);
    const response = await instance.delete(`/admin/event/${eventId}`);

    console.log("이벤트 삭제 응답:", response);
    return response.data;
  } catch (error) {
    console.error("이벤트 삭제 실패:", error);
    throw new Error(`이벤트 삭제 실패: ${error.message}`);
  }
}
