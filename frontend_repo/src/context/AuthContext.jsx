import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"; //API 요청을 위한 라이브러리
import { getAuthToken } from "./tokenProviderService";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null); // JWT 토큰 상태 추가

  // 로그인 처리
  const login = async (userId, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8090/emart/authenticate",
        {
          userId,
          password,
        }
      );
      setToken(response.data.token); // 로그인 성공시 토큰 저장
      setUser(response.data.user); // 사용자 정보 저장
      localStorage.setItem("jwtAuthToken", response.data.token);
      localStorage.setItem("userid", response.data.userId);
    } catch (error) {
      console.log("로그인 실패:", error);
    }
  };

  // 로그아웃 처리
  const logout = () => {
    setToken(null); // JWT 토큰 삭제
    setUser(null); // 사용자 정보 삭제
    localStorage.removeItem("jwtAuthToken");
    localStorage.removeItem("userid");
  };

  // 로그인 상태 확인
  useEffect(() => {
    const { token } = getAuthToken(); // 로컬 스토리지 토큰 가져옥기

    if (token) {
      axios
        .get("http://localhost:8090/emart/user/profile", {
          headers: { Authorization: `Bearer ${token}` }, // 인증된 요청
        })
        .then((response) => {
          setUser(response.data); // 사용자 정보 설정
          setIsLoading(false); // 로딩 완료
        })
        .catch(() => {
          setIsLoading(false); // 사용자 정보 불러오기 실패 시
        });
    } else {
      setIsLoading(false); //토큰이 없으면 로딩 종료
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};

/*
// 팀원들 Context  합치기 전 코드 
// 프론트엔드에서 Mock 용 확인 코드 (아래에 실제 API 코드 존재재)
const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null); // JWT 토큰 상태 추가

  // 로그인 처리
  const login = async (userId, password) => {
    try {
      // 실제 API 호출 전에 목 데이터로 대체
      const response = {
        data: {
          token: "mock-jwt-token",
          user: {
            id: "user123",
            name: "John Doe",
            email: "john.doe@example.com",
            role: "USER",
          },
        },
      };
      setToken(response.data.token); // 로그인 성공시 토큰 저장
      setUser(response.data.user); // 사용자 정보 저장
    } catch (error) {
      console.log("로그인 실패:", error);
    }
  };

  // 로그아웃 처리
  const logout = () => {
    setToken(null); // JWT 토큰 삭제
    setUser(null); // 사용자 정보 삭제
  };

  // 로그인 상태 확인
  useEffect(() => {
    if (token) {
      // 실제 API 호출 전에 목 데이터를 사용
      const response = {
        data: {
          id: "user123",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "USER",
        },
      };
      setUser(response.data); // 목 데이터로 사용자 정보 설정
      setIsLoading(false);
    } else {
      setIsLoading(false); // 토큰이 없으면 로딩 종료
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};

*/

/* 백엔드를 API 연결을 가정하고 만든 코드 

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null); //JWT 토큰 상태 추가

  //로그인 처리
  const login = async (userId, password) => {
    try {
      const response = await axios.post("/authentication/login", {
        userId,
        password,
      });
      setToken(response.data.token); //로그인 성공시 토큰 저장
      setUser(response.data.user); // 사용자 정보 저장
    } catch (error) {
      console.log("로그인 실패:", error);
    }
  };

  //로그아웃 처리
  const logout = () => {
    setToken(null); // JWT 토큰 삭제
    setUser(null); // 사용자 정보 삭제
  };

  //useState는 새로고침하면 항상 새로운 정보를 가져오기 때문에 useEffect 사용
  //로그인 상태 확인

  useEffect(() => {
    if (token) {
      //토큰이 있으면 해당 토큰으로 사용자 정보를 불러오는 API 호출
      axios
        .get("/authentication/login", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false); // 사용자 정보 불러오기 실패 시
        });
    } else {
      setIsLoading(false); // 토큰이 없으면 로딩 종료
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};

*/
