import "./App.css";

import Navbar from "./components/ui/layout/Navbar";
import { Outlet } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Navbar />
        <Outlet />
      </AuthContextProvider>
    </>
  );
}

export default App;

//Provider 전역 설정 <B basename={process.env.PUBLIC_URL}>
// <QueryClientProvider client={queryClient}>
//   <AuthContextProvider>
//     <Navbar />
//     <Outlet />
//   </AuthContextProvider>
// </QueryClientProvider>
