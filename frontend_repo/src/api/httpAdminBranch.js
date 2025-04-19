import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "https://morek9.click", // 실제 URL이 맞는지 확인
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/**
 * 모든 지점 정보 조회
 * @returns {Promise} - 지점 목록
 */
export async function fetchAllBranches() {
  try {
    console.log("모든 지점 정보 조회 요청");
    const response = await instance.get("/admin/branch/all");

    console.log("지점 목록 응답:", response);
    return response.data;
  } catch (error) {
    console.error("지점 목록 조회 실패:", error);
    throw new Error(`지점 목록 조회 실패: ${error.message}`);
  }
}

/**
 * 새 지점 생성
 * @param {Object} branchData - 지점 데이터 (branchName, branchAddress)
 * @returns {Promise} - 생성된 지점 정보
 */
export async function createBranch(branchData) {
  try {
    console.log("지점 생성 요청:", branchData);
    const response = await instance.post("/admin/branch/create", branchData);

    console.log("지점 생성 응답:", response);

    if (response.status !== 201) {
      throw new Error("지점 생성 실패");
    }

    return response.data;
  } catch (error) {
    console.error("지점 생성 실패:", error);
    throw new Error(`지점 생성 실패: ${error.message}`);
  }
}

/**
 * 지점 정보 수정
 * @param {string} branchName - 지점명
 * @param {Object} branchData - 수정할 지점 데이터
 * @returns {Promise} - 수정된 지점 정보
 */

export async function updateBranch(branchName, branchData) {
  try {
    console.log(`지점 '${branchName}' 수정 요청:`, branchData);
    const response = await instance.put(`/admin/branch/update/${branchName}`, branchData);

    console.log("지점 수정 응답:", response);
    return response.data;
  } catch (error) {
    console.error("지점 수정 실패:", error);
    throw new Error(`지점 수정 실패: ${error.message}`);
  }
}

/**
 * 지점 삭제
 * @param {string} branchName - 삭제할 지점명
 * @returns {Promise} - 삭제 결과
 */

export async function deleteBranch(branchName) {
  try {
    console.log(`지점 '${branchName}' 삭제 요청`);
    const response = await instance.delete(`/admin/branch/delete/${branchName}`);

    console.log("지점 삭제 응답:", response);

    // 응답 상태가 200 또는 204인 경우만 정상 처리
    if (response.status !== 200 && response.status !== 204) {
      throw new Error("지점 삭제 실패");
    }

    return response.data;
  } catch (error) {
    console.error("지점 삭제 실패:", error);
    throw new Error(`지점 삭제 실패: ${error.message}`);
  }
}
