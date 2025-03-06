import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/ui/layout/Navbar";

function App() {
  return (
    //Provider 전역 설정 <B basename={process.env.PUBLIC_URL}>
    // <QueryClientProvider client={queryClient}>
    //   <AuthContextProvider>
    //     <Navbar />
    //     <Outlet />
    //   </AuthContextProvider>
    // </QueryClientProvider>
    <div>
      <header>
        <Navbar />
        {/* 네비게이션 또는 다른 헤더 컴포넌트 추가 가능 */}
      </header>

      <main>
        {/* 이곳에 자식 컴포넌트가 렌더링됩니다 */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;
