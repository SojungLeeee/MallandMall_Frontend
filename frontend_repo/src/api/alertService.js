import axios from "axios";

const alertInstance = axios.create({
  baseURL: "https://morek9.click/api/alertlog",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

//  전체 알림 조회
export async function fetchAllAlerts() {
  const jwt = localStorage.getItem("jwtAuthToken");
  if (!jwt) throw new Error("JWT 토큰이 없습니다.");

  const res = await alertInstance.get("", {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  return res.data;
}

//  특정 상품의 알림만 조회
export async function fetchAlertsByProduct(productCode) {
  const jwt = localStorage.getItem("jwtAuthToken");
  if (!jwt) throw new Error("JWT 토큰이 없습니다.");

  const res = await alertInstance.get(`/${productCode}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  return res.data;
}

//  읽음 처리 API
export async function markAlertAsRead(alertId) {
  const jwt = localStorage.getItem("jwtAuthToken");
  if (!jwt) throw new Error("JWT 토큰이 없습니다.");

  return await alertInstance.put(`/read/${alertId}`, null, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
}
