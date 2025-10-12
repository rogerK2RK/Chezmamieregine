export default function authHeaderClient() {
  const token =
    localStorage.getItem('clientToken') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('clientToken') ||
    sessionStorage.getItem('token') ||
    '';

  return token ? { Authorization: `Bearer ${token}` } : {};
}
