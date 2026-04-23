import { jwtDecode } from "jwt-decode";

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);

    return {
      userId: decoded.nameid,
      name: decoded.unique_name,
      // ✅ ADD EMAIL (handles both formats)
      email:
        decoded.email ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      role:
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      profileImage: decoded.profileImage  
    };
  } catch {
    return null;
  }
};

// ✅ Optional helper (very useful)
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// ✅ Optional logout helper (cleaner than repeating code)
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};