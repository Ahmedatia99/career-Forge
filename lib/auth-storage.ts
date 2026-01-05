export const setToken = (data: any) =>
  localStorage.setItem("token", data.token);

export const getToken = () =>
  localStorage.getItem("token");

export const clearToken = () =>
  localStorage.removeItem("token");
