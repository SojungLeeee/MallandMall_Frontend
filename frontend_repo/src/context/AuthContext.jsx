import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  //JWT 토큰 상태 관리를 위한 useState
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 로그인 시 localStorage에서 토큰을 가져와서 유저 정보를 세팅
    const token = localStorage.getItem("jwtAuthToken");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      setUser({ userId, token, role: "USER" }); // 역할을 필요에 맞게 설정
    }
  }, []);

  const login = (userData) => {
    // 로그인 성공 시 user 상태를 업데이트
    setUser(userData);
    // localStorage에 로그인 정보 저장
    localStorage.setItem("jwtAuthToken", userData.token);
    localStorage.setItem("userId", userData.userId);
  };

  const logout = () => {
    setUser(null); // 로그아웃 시 user 상태를 null로 설정
    localStorage.removeItem("jwtAuthToken");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
