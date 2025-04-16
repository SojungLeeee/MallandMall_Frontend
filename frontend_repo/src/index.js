// 필수 라이브러리 및 기본 컴포넌트
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AppTwo from "./AppTwo";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { tokenProviderLoader } from "./auth/tokenProviderService";
import NotFound from "./pages/error/NotFound";
import Home from "./pages/Home";
import CouponUpgradePage from "./pages/mypage/EnhancePage";
// 인증 및 로그인 관련
import Login from "./pages/login/Login";
import { action as authAction } from "./pages/login/Login";
import Signup from "./pages/login/Signup";
import { action as signUpAction } from "./pages/login/Signup";
import FindId from "./pages/login/FindId";
import FoundId from "../src/pages/login/FoundId";
import ResetPassword from "./pages/login/ResetPassword";
import SelectCategory from "./pages/login/SelectCategory";
import KakaoCallback from "./util/KakaoCallback";

// 마이페이지 관련
import Mypage, { loader as mypageLoader } from "./pages/mypage/Mypage";
import EditProfile, {
  loader as editProfileLoader,
} from "./pages/mypage/EditProfile";
import DeleteAccount, {
  loader as deleteAccountLoader,
} from "./pages/mypage/DeleteAccount";
import MyOrderInfo from "./pages/mypage/MyOrderInfo";
import MyReviews from "./pages/mypage/MyReview";
import EditCategory from "./pages/mypage/EditCategory";
import CouponPage from "./pages/mypage/CouponPage";
import EnhancePage from "./pages/mypage/EnhancePage";
// 상품 및 카테고리 관련
import AllProducts from "./pages/product/AllProducts";
import ProductDetail from "./components/ui/product/ProductDetail";
import CategoryList from "./pages/category/CategoryList";
import CategoryPage from "./pages/category/CategoryPage";
import Search from "./pages/search/Search";
import SearchPage from "./pages/search/SearchPage";

// 리뷰 분석 페이지 import
import ReviewAnalysis from "../src/components/ui/product/ReviewAnalysis";

// 오프라인 및 차트 관련
import SpecialDealsPage from "./pages/offline/SpecialDealsPage";
import PriceHistoryChart from "./pages/offline/PriceHistoryChart";
import NaverMap from "./components/ui/map/NaverMap";
import BranchInfo from "./components/ui/map/BranchInfo";

// 장바구니 및 주문 관련
import MyCart from "./pages/cart/MyCart";
import OrderPage from "./pages/order/OrderPage";
import OrderComplete from "./pages/order/OrderComplete";
import CouponUsePage from "./pages/order/CouponUsePage";

// 고객센터/문의 관련
import CustomerServiceScreen from "./pages/board/CustomerServiceScreen";

// 관리자 - 기본
import Admin from "./pages/admin/Admin";

// 관리자 - 상품 관리
import AdminAllProducts from "./pages/admin/AdminAllProducts";
import AdminDeleteProducts from "./pages/admin/AdminDeleteProducts";
import AdminUpdateProducts from "./pages/admin/AdminUpdateProducts";
import AdminAddProducts from "./pages/admin/AdminAddProducts";

// 관리자 - 아이템 관리
import AdminAllGoods from "./pages/admin/AdminAllGoods";
import AdminDeleteGoods from "./pages/admin/AdminDeleteGoods";
// import AdminUpdateGoods from "./pages/admin/AdminUpdateGoods";
import AdminAddGoods from "./pages/admin/AdminAddGoods";

// 관리자 - 지점 관리
import AdminAllBranch from "./pages/admin/AdminAllBranch";
import AdminDeleteBranch from "./pages/admin/AdminDeleteBranch";
import AdminUpdateBranch from "./pages/admin/AdminUpdateBranch";
import AdminAddBranch from "./pages/admin/AdminAddBranch";

// 관리자 - 이벤트 관리
import AdminAllEvent from "./pages/admin/AdminAllEvent";
import AdminDeleteEvent from "./pages/admin/AdminDeleteEvent";
import AdminUpdateEvent from "./pages/admin/AdminUpdateEvent";
import AdminAddEvent from "./pages/admin/AdminAddEvent";

// 관리자 - 게시판/질문 관리
import AdminQuestionManagement from "./pages/admin/AdminQuestionManagement";
import AdminQuestionDetail from "./pages/admin/AdminQuestionDetail";

// 관리자 - 차트/재고 관리
import StockPage from "./pages/adminchart/StockPage";
import StockChartDetailPage from "./pages/adminchart/StockChartDetailPage";
import StockAlarmPage from "./pages/adminchart/StockAlarmPage";

// 챗봇 관련 컴포넌트 import 추가
import ChatbotComponent from "./components/ui/chatbot/ChatbotComponent";

import NaverLoginCallback from "./components/ui/button/NaverCallback";

const router = createBrowserRouter([
  {
    path: "/search",
    element: <AppTwo />,
    children: [
      { path: "/search", element: <Search /> }, // Search 대신 EnhancedSearch 사용
    ],
  },

  {
    path: "/categoryList",
    element: <AppTwo />,
    children: [{ path: "/categoryList", element: <CategoryList /> }],
  },
  {
    path: "/mypage/usecoupon",
    element: <AppTwo />,
    children: [{ path: "/mypage/usecoupon", element: <CouponUsePage /> }],
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

      // 챗봇 관련 경로 추가
      { path: "/chatbot", element: <ChatbotComponent /> },

      // 마이페이지 관련
      { path: "/mypage", element: <Mypage />, loader: mypageLoader },
      {
        path: "/mypage/edit",
        element: <EditProfile />,
        loader: editProfileLoader,
      },
      {
        path: "/coupon/upgrade",
        element: <EnhancePage />,
      },
      {
        path: "/mypage/delete",
        element: <DeleteAccount />,
        loader: deleteAccountLoader,
      },
      { path: "/mypage/orderinfo", element: <MyOrderInfo /> },
      { path: "/mypage/myreview", element: <MyReviews /> },
      //질문과답
      { path: "/questions", element: <CustomerServiceScreen /> },
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

      // 리뷰 분석 페이지 경로 추가
      { path: "/review-analysis/:productCode", element: <ReviewAnalysis /> },

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
        path: "/admin/questions",
        element: <AdminQuestionManagement />,
      },
      { path: "/admin/question/detail", element: <AdminQuestionDetail /> },
      {
        path: "/favorites",
        element: <Home />,
      },
      {
        path: "/mypage/editcategory",
        element: <EditCategory />,
      },
      {
        path: "/mypage/coupons",
        element: <CouponPage />,
      },

      {
        path: "/auth/kakao/callback",
        element: <KakaoCallback />,
      },
      {
        path: "/login/naver/callback",
        element: <NaverLoginCallback />,
      },
      //NaverMap
      {
        path: "/map",
        element: <NaverMap />,
      },
      //branchInfo
      {
        path: "/BranchInfo",
        element: <BranchInfo />,
      },

      { path: "/special-deals", element: <SpecialDealsPage /> },
      { path: "/product-chart/:productCode", element: <PriceHistoryChart /> },
      { path: "/admin/stock", element: <StockPage /> },
      { path: "/stock-chart/:productCode", element: <StockChartDetailPage /> },
      { path: "/admin/inventory-alarm", element: <StockAlarmPage /> },
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
