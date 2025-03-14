import "./App.css";
import FooterNav from "./components/ui/layout/FooterNav";
import Navbar from "./components/ui/layout/Navbar";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import SearchBar from "./components/ui/layout/SearchBar";

function App() {
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
  const isProductHomeRoute = location.pathname === "/product/home";

  // Combine the checks to determine if the SearchBar should be shown
  const showSearchBar =
    isHomeRoute ||
    isProductCategoryRoute ||
    isProductCodeRoute ||
    isProductHomeRoute;

  return (
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
  );
}

export default App;
