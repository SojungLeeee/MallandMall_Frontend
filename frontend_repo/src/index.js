import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/error/NotFound";
import Home from "./pages/Home";
import MyCart from "./pages/cart/MyCart";
import ResetPassword from "./pages/login/ResetPassword";
import Login from "./pages/login/Login";
import FindId from "./pages/login/FindId";
import { action as authAction } from "./pages/login/Login";
import Mypage, { loader as mypageLoader } from "./pages/mypage/Mypage";
import FoundId from "../src/pages/login/FoundId";
import DeleteAccount, {
  loader as deleteAccountLoader,
} from "./pages/mypage/DeleteAccount";
import EditProfile, {
  loader as editProfileLoader,
} from "./pages/mypage/EditProfile";
import Signup from "./pages/login/Signup";
import { action as signUpAction } from "./pages/login/Signup";
import SelectCategory from "./pages/login/SelectCategory";
import CategoryList from "./pages/category/CategoryList";
import { tokenProviderLoader } from "./auth/tokenProviderService";
import Appp from "./Appp";

const router = createBrowserRouter([
  {
    path: "/categoryList",
    element: <Appp />,
    loader: tokenProviderLoader, // 로그인 시 localStorage에 저장된 token과 userId 값을 제공하는 역할 담당
    children: [{ path: "/categoryList", element: <CategoryList /> }],
  },
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    id: "root",
    loader: tokenProviderLoader, // 로그인 시 localStorage에 저장된 token과 userId 값을 제공하는 역할 담당
    children: [
      { index: true, path: "/", element: <Home /> },
      //{ path: "/products", element: <AllProudcts /> },

      { path: "/login", element: <Login />, action: authAction },
      { path: "/mypage", element: <Mypage />, loader: mypageLoader },
      {
        path: "/mypage/edit",
        element: <EditProfile />,
        loader: editProfileLoader,
      },
      {
        path: "/mypage/delete",
        element: <DeleteAccount />,
        loader: deleteAccountLoader,
      },
      { path: "/signup", element: <Signup />, action: signUpAction },
      { path: "/carts", element: <MyCart /> },
      { path: "/categoryList", element: <CategoryList /> },
      { path: "/findid", element: <FindId /> },

      { path: "/foundid", element: <FoundId /> },
      {
        /* 쉼표 및 괄호 문제 해결 */
      },
      // { path: "/findid", element: <FindId /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/selectCategory", element: <SelectCategory /> },
      // {
      //   path: "/products/new",
      //   element: (
      //     <ProtectedRoute requireAdmin>
      //       <NewProduct />
      //     </ProtectedRoute>
      //   ),
      // },
      // { path: "/products/:id", element: <ProductDetail /> },
      // {
      //   path: "/carts",
      //   element: (
      //     <ProtectedRoute>
      //       <MyCart />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
