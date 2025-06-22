export function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";
  if (token) {
    return {
      Authorization: `${tokenType} ${token}`,
    };
  }
  return {};
}
