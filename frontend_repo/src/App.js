import "./App.css";
import FooterNav from "./components/ui/layout/FooterNav";
import Navbar from "./components/ui/layout/Navbar";
import { Outlet } from "react-router-dom";
import SearchBar from "./components/ui/layout/SearchBar";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterNav /> {/* 하단에 FooterNav 컴포넌트를 추가 */}
    </div>
  );
}

export default App;
