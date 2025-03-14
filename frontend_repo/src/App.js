import "./App.css";
import FooterNav from "./components/ui/layout/FooterNav";
import Navbar from "./components/ui/layout/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-col App">
      <Navbar />
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
