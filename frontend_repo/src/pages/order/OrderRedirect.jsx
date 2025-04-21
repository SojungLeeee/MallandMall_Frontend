import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { consumeGoods } from "../../api/httpProductService";
import { fetchDeleteCartItems, sendOrderConfirm } from "../../api/httpOrderService";
import { fetchDeleteCoupon } from "../../api/httpCouponService";

export default function OrderRedirect() {
  const [params] = useSearchParams();
  const impUid = params.get("imp_uid");
  const navigate = useNavigate();

  useEffect(() => {
    const processRedirectOrder = async () => {
      const token = localStorage.getItem("jwtAuthToken");
      const formData = JSON.parse(localStorage.getItem("formData"));
      const branchName = localStorage.getItem("branchName");
      const hasStock = localStorage.getItem("hasStock") === "true";
      const isAlternativeBranch = localStorage.getItem("isAlternativeBranch") === "true";
      const userId = localStorage.getItem("userId");
      const selectedCoupon = JSON.parse(localStorage.getItem("selectedCoupon"));
      const selectedCartItems = JSON.parse(localStorage.getItem("selectedCartItems"));
      const productInfo = JSON.parse(localStorage.getItem("productInfo"));
      const discountRate = parseInt(localStorage.getItem("discountedRate"), 10);

      const sharedOrderData = {
        ...formData,
        userId,
        impUid,
        branchName,
        hasStock,
        isAlternativeBranch,
        discountedPrice: discountRate,
      };

      try {
        const orders = selectedCartItems
          ? selectedCartItems.map((item) => ({
              productCode: item.productCode,
              quantity: item.quantity,
            }))
          : [
              {
                productCode: productInfo.productCode,
                quantity: 1,
              },
            ];

        const finalData = {
          ...sharedOrderData,
          orders,
        };

        await axios.post("https://morek9.click/order/confirm", finalData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 소비 처리
        for (const item of orders) {
          await consumeGoods({
            productCode: item.productCode,
            branchName,
            quantity: item.quantity,
          });
        }

        if (selectedCartItems) {
          const cartIds = selectedCartItems.map((item) => item.cartId);
          await fetchDeleteCartItems(cartIds);
        }

        if (selectedCoupon) {
          await fetchDeleteCoupon(selectedCoupon.couponId);
        }

        // localStorage 정리
        localStorage.removeItem("formData");
        localStorage.removeItem("branchName");
        localStorage.removeItem("hasStock");
        localStorage.removeItem("isAlternativeBranch");
        localStorage.removeItem("userId");
        localStorage.removeItem("selectedCoupon");
        localStorage.removeItem("selectedCartItems");
        localStorage.removeItem("productInfo");
        localStorage.removeItem("discountedRate");

        navigate(`/order/complete?imp_uid=${impUid}`);
      } catch (err) {
        console.error("📛 모바일 주문 저장 실패:", err);
        alert("결제는 완료되었지만 주문 저장에 실패했습니다.");
        navigate("/");
      }
    };

    if (impUid) {
      processRedirectOrder();
    } else {
      alert("결제가 취소되었거나 실패했습니다.");
      navigate("/");
    }
  }, [impUid, navigate]);

  return <div>결제 완료 후 주문을 처리 중입니다...</div>;
}
