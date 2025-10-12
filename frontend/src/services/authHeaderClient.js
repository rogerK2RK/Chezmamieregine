// N’envoie QUE le token client. Surtout pas le token admin.
export default function authHeaderClient() {
  const t =
    localStorage.getItem('clientToken') ||
    sessionStorage.getItem('clientToken');

  return t ? { Authorization: `Bearer ${t}` } : {};
}
