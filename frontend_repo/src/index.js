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
import CategoryPage from "./pages/category/CategoryPage";
import SearchPage from "./pages/Search/SearchPage";
import OrderProduct from "./pages/product/OrderProduct";
import { tokenProviderLoader } from "./auth/tokenProviderService";
import MyOrderInfo from "./pages/mypage/MyOrderInfo";

import Products from "./components/ui/product/Products";

import AllProducts from "./pages/product/AllProducts";

import ProductDetail from "./components/ui/product/ProductDetail";
import MyReviews from "./pages/mypage/MyReview";
import AdminAllProducts from "./pages/admin/AdminAllProducts";
import AdminDeleteProducts from "./pages/admin/AdminDeleteProducts";
import AdminUpdateProducts from "./pages/admin/AdminUpdateProducts";
import AdminAddProducts from "./pages/admin/AdminAddProducts";

import KakaoCallback from "./util/KakaoCallback";

import AdminAllGoods from "./pages/admin/AdminAllGoods";
import AdminDeleteGoods from "./pages/admin/AdminDeleteGoods";
//import AdminUpdateGoods from "./pages/admin/AdminUpdateGoods";
import AdminAddGoods from "./pages/admin/AdminAddGoods";
//import AdminAllBranch from "./pages/admin/AdminAllBranch";

import AppTwo from "./AppTwo";
import Search from "./pages/Search/Search";
import Admin from "./pages/admin/Admin";
//어드민 Branch 임포트
import AdminAllBranch from "./pages/admin/AdminAllBranch";
import AdminDeleteBranch from "./pages/admin/AdminDeleteBranch";
import AdminUpdateBranch from "./pages/admin/AdminUpdateBranch";
import AdminAddBranch from "./pages/admin/AdminAddBranch";
//어드민 Event 임포트
import AdminAllEvent from "./pages/admin/AdminAllEvent";
import AdminDeleteEvent from "./pages/admin/AdminDeleteEvent";
import AdminUpdateEvent from "./pages/admin/AdminUpdateEvent";
import AdminAddEvent from "./pages/admin/AdminAddEvent";

import EditCategory from "./pages/mypage/EditCategory";

import OrderPage from "./pages/order/OrderPage";
import Favorites from "./pages/mypage/Favorites";
import OrderComplete from "./pages/order/OrderComplete";

const router = createBrowserRouter([
  // AppTwo 기반 라우트
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

  // 메인 App 기반 라우트
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    id: "root",
    loader: tokenProviderLoader, // 로그인 시 localStorage에 저장된 token과 userId 값을 제공하는 역할 담당
    children: [
      // 홈
      { index: true, path: "/", element: <Home /> },

      // 인증 관련
      { path: "/login", element: <Login />, action: authAction },
      { path: "/signup", element: <Signup />, action: signUpAction },
      { path: "/findid", element: <FindId /> },
      { path: "/foundid", element: <FoundId /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/selectCategory", element: <SelectCategory /> },

      // 마이페이지 관련
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
      { path: "/mypage/orderinfo", element: <MyOrderInfo /> },
      { path: "/mypage/myreview", element: <MyReviews /> },

      // 장바구니 및 주문
      { path: "/carts", element: <MyCart /> },
      { path: "/order", element: <OrderPage /> },
      { path: "/order/complete/:imp_uid", element: <OrderComplete /> },
      { path: "/order/complete", element: <OrderComplete /> },

      // 카테고리 및 상품
      { path: "/categoryList", element: <CategoryList /> },
      { path: "/products", element: <AllProducts /> }, // 상품 목록 페이지
      { path: "/product/:productCode", element: <ProductDetail /> },
      { path: "/products/:categoryName", element: <CategoryPage /> }, // 카테고리별 상품 페이지
      { path: "/search/:productName", element: <SearchPage /> },

      //관리자 기능
      { path: "/admin", element: <Admin /> },
      //관리자 기능 - Product
      { path: "/admin/product/search", element: <AdminAllProducts /> },
      { path: "/admin/product/delete", element: <AdminDeleteProducts /> },
      { path: "/admin/product/register", element: <AdminAddProducts /> },
      { path: "/admin/product/update", element: <AdminUpdateProducts /> },

      { path: "/admin/item/search", element: <AdminAllGoods /> },
      { path: "/admin/item/delete", element: <AdminDeleteGoods /> },
      { path: "/admin/item/register", element: <AdminAddGoods /> },
      { path: "/admin/item/update", element: <AdminUpdateProducts /> },

      //관리자 기능 - Event
      { path: "/admin/event/search", element: <AdminAllEvent /> },
      { path: "/admin/event/delete", element: <AdminDeleteEvent /> },
      { path: "/admin/event/register", element: <AdminAddEvent /> },
      { path: "/admin/event/update", element: <AdminUpdateEvent /> },

      //관리자 기능 - Branch
      { path: "/admin/branch/search", element: <AdminAllBranch /> },
      {
        path: "/admin/branch/delete",
        element: <AdminDeleteBranch />,
      },
      { path: "/admin/branch/register", element: <AdminAddBranch /> },
      {
        path: "/admin/branch/update",
        element: <AdminUpdateBranch />,
      },
      {
        path: "/favorites",
        element: <Home />,
      },
      {
        path: "/mypage/editcategory",
        element: <EditCategory />,
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
