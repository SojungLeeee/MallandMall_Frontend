import "./App.css";
import FooterNav from "./components/ui/layout/FooterNav";
import Navbar from "./components/ui/layout/Navbar";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import SearchBar from "./components/ui/layout/SearchBar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";

function App() {
  //여기 무슨 코드??? 설명 필요
  const location = useLocation();

  // Define the routes where SearchBar should be visible
  const isHomeRoute = location.pathname === "/";
  const isProductCategoryRoute = matchPath(
    "/products/:categoryName",
    location.pathname
  );
  const isProductCodeRoute = matchPath(
    "/product/:productCode",
    location.pathname
  );
  const isSearchRoute = matchPath("/search/:productName", location.pathname);
  const isProductHomeRoute = location.pathname === "/product/home";

  // Combine the checks to determine if the SearchBar should be shown
  const showSearchBar =
    isHomeRoute ||
    isProductCategoryRoute ||
    isProductCodeRoute ||
    isProductHomeRoute ||
    isSearchRoute;

  //구글 OAuth 프로바이더 설정
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // 구글 API에서 받은 ID

  // 페이지가 완전히 로드된 후에만 GoogleOAuthProvider 초기화
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex flex-col App">
        <Navbar />
        {showSearchBar && <SearchBar />}{" "}
        {/* Render SearchBar only on specific routes */}
        <main className="flex-grow overflow-auto">
          {" "}
          {/* 스크롤을 추가하기 위해 overflow-auto 설정 */}
          <Outlet /> {/* Outlet (Home 페이지의 Banner와 Products를 포함) */}
        </main>
        <FooterNav />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
