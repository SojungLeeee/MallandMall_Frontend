import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ BrowserRouter 추가
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/error/NotFound";
import Home from "./pages/Home";
import AllProudcts from "./pages/product/AllProducts";
import Login from "./pages/login/Login";
import FindId from "./pages/login/FindId";
import { action as authAction } from "./pages/login/Login";

import Mypage, { loader as mypageLoader } from "./pages/mypage/Mypage";
import DeleteAccount, { loader as deleteAccountLoader } from "./pages/mypage/DeleteAccount";
import EditProfile, { loader as editProfileLoader } from "./pages/mypage/EditProfile";
import Signup from "./pages/login/Signup";
import { action as signUpAction } from "./pages/login/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: "/", element: <Home /> },
      //{ path: "/products", element: <AllProudcts /> },

      { path: "/login", element: <Login />, action: authAction },
      { path: "/mypage", element: <Mypage />, loader: mypageLoader },
      { path: "/mypage/edit", element: <EditProfile />, loader: editProfileLoader },
      { path: "/mypage/delete", element: <DeleteAccount />, loader: deleteAccountLoader },
      { path: "/signup", element: <Signup />, action: signUpAction },
      { path: "/findid", element: <FindId /> },
      {},
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
