"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentStatus({
  returnURL = "",
  orderId = "",
}: {
  returnURL: string;
  orderId: string;
}) {
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    console.log("orderId", orderId);
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `/api/colleges/payment/verify?order_id=${orderId}`
        );
        const data = await response.json();
        setStatus(data.order_status);
        if (data.order_status === "PAID") {
          setTimeout(() => {
            window.location.href = returnURL;
          }, 5000);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("error");
      }
    };

    if (orderId) {
      verifyPayment();
    }
  }, [returnURL, orderId]);

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
      {status === "PAID" && (
        <div className="text-green-600">
          Payment successful! Your order has been confirmed.
        </div>
      )}
      {status === "FAILED" && (
        <div className="text-red-600">Payment failed. Please try again.</div>
      )}
      {!status && <div>Verifying payment status...</div>}
    </div>
  );
}
