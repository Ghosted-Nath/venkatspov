"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function RazorpayCheckout() {

  const searchParams = useSearchParams();
  const router = useRouter();

  const draftId = searchParams.get("draft_id");

  useEffect(() => {

    if (!draftId) return;

    const loadPayment = async () => {

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          draft_id: draftId
        })
      });

      const order = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Venkat's POV",
        description: "Artwork Purchase",
        order_id: order.id,

        handler: async function (response) {

          await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...response,
              draft_id: draftId
            })
          });

          alert("Payment Successful 🎉");

          router.push("/store");
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = loadPayment;
    document.body.appendChild(script);

  }, [draftId]);

  return (
    <div className="flex items-center justify-center h-screen text-white">
      Processing Payment...
    </div>
  );
}