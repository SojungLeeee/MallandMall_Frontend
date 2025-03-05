export function getAuthToken() {
  const token = localStorage.getItem("jwtAuthToken");
  const userid = localStorage.getItem("userid");
  return { token: token, userid: userid };
}

export function tokenProviderLoader() {
  return getAuthToken();
}
