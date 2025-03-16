export function getAuthToken() {
  const token = localStorage.getItem("jwtAuthToken");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role"); // 🔥 키 통일
  return { token: token, userId: userId, role: role };
}

export function setAuthToken({ token, userId, role }) {
  localStorage.setItem("jwtAuthToken", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("role", role); // 🔥 수정된 부분
}

export function tokenProviderLoader() {
  return getAuthToken();
}
