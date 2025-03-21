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
import DeleteAccount, { loader as deleteAccountLoader } from "./pages/mypage/DeleteAccount";
import EditProfile, { loader as editProfileLoader } from "./pages/mypage/EditProfile";
import Signup from "./pages/login/Signup";
import { action as signUpAction } from "./pages/login/Signup";
import SelectCategory from "./pages/login/SelectCategory";
import CategoryList from "./pages/category/CategoryList";
import CategoryPage from "./pages/category/CategoryPage";
import SearchPage from "./pages/Search/SearchPage";
import OrderProduct from "./pages/product/OrderProduct";
import { tokenProviderLoader } from "./auth/tokenProviderService";
import MyOrderInfo from "./pages/mypage/MyOrderInfo";
import Products from "./components/ui/product/Products";
import ProductDetail from "./components/ui/product/ProductDetail";
import MyReviews from "./pages/mypage/MyReview";
import AdminAllProducts from "./pages/admin/AdminAllProducts";
import AdminDeleteProducts from "./pages/admin/AdminDeleteProducts";
import AdminUpdateProducts from "./pages/admin/AdminUpdateProducts";
import AdminAddProducts from "./pages/admin/AdminAddProducts";
import KakaoCallback from "./components/ui/KakaoCallback";
import AppTwo from "./AppTwo";
import Search from "./pages/Search/Search";
import Admin from "./pages/admin/Admin";

const router = createBrowserRouter([
  {
    path: "/search",
    element: <AppTwo />,
    children: [{ path: "/search", element: <Search /> }],
  },
  {
    path: "/categoryList",
    element: <AppTwo />,
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
      { path: "/admin", element: <Admin /> },
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

      { path: "/products", element: <Products /> }, //  상품 목록 페이지
      { path: "/product/:productCode", element: <ProductDetail /> },

      {
        path: "/products/:categoryName", // :categoryName은 동적 경로
        element: <CategoryPage />, // 카테고리별 상품 페이지
      },
      {
        path: "/search/:productName",
        element: <SearchPage />,
      },
      {
        path: "/order",
        element: <OrderProduct />,
      },
      { path: "/mypage/orderinfo", element: <MyOrderInfo /> },
      {
        path: "/mypage/myreview",
        element: <MyReviews />,
      },
      {
        path: "/admin/product/search",
        element: <AdminAllProducts />,
      },
      {
        path: "/admin/product/delete",
        element: <AdminDeleteProducts />,
      },
      {
        path: "/admin/product/register",
        element: <AdminAddProducts />,
      },
      {
        path: "/admin/product/update",
        element: <AdminUpdateProducts />,
      },
      {
        path: "/auth/kakao/callback",
        element: <KakaoCallback />,
      },
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
