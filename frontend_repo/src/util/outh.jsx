export function getAuthToken() {
  const token = localStorage.getItem("jwtAuthToken");
  const userId = localStorage.getItem("userId");
  return { token: token, userId: userId };
}

export function tokenProviderLoader() {
  return getAuthToken();
}
