import "./App.css";
import FooterNav from "./components/ui/layout/FooterNav";
import { Outlet } from "react-router-dom";

function AppOne() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow overflow-auto">
        <Outlet />
      </main>
      <FooterNav className="mt-auto" /> {/* mt-auto로 풋 네비를 맨 밑에 고정 */}
    </div>
  );
}

export default AppOne;
