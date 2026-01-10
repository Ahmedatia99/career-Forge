export const setToken = (data: { token: string }) => {
  localStorage.setItem("token", data.token);
  

  if (typeof document !== 'undefined') {
    document.cookie = `token=${data.token}; path=/; max-age=3600; SameSite=Lax`;
  }
};

export const getToken = () => {

  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  }
  return localStorage.getItem("token");
};

export const setUser = (user: any) => {
  if (typeof document !== 'undefined') {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getUser = () => {
  if (typeof document !== 'undefined') {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const setUserProfile = (profile: any) => {
  if (typeof document !== 'undefined') {
    localStorage.setItem("user_profile", JSON.stringify(profile));
  }
};

export const getUserProfile = () => {
  if (typeof document !== 'undefined') {
    const profileStr = localStorage.getItem("user_profile");
    if (profileStr) {
      try {
        return JSON.parse(profileStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("user_profile");

  if (typeof document !== 'undefined') {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};