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
import Mypage from "./pages/Mypage";
import FindId from "./pages/login/FindId";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: "/", element: <Home /> },
      //{ path: "/products", element: <AllProudcts /> },
      { path: "/login", element: <Login /> },
      { path: "/mypage", element: <Mypage /> },
      { path: "/findid", element: <FindId /> },
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
