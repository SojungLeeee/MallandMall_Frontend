import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart",

  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 찾기
export async function fetchFindAllProductCode(token) {
  console.log("fetchFindAllProductCode 요청");
  const response = await instance.get(`/admin/findAllProductCode`);

  //예외처리 (실패했을 경우)
  if (!response.ok) {
    //또는 (if !(response.status === 200))
    console.log("에러 발생");
    throw new Error("fetchFindAllProductCode 예외발생");
  }

  //(성공했을 경우)
  //fetch 함수의 응답인 response에 있는 다양한 메서드 사용
  //response.blob(), response.bytes(), response.text(), response.json(), ...
  const response_json = await response.json();
  console.log("response_json : ", response_json);

  //console.log("response : ",response);
  return response_json.data;
}
