"use client";

import { Suspense, useEffect, useState } from "react";
import PaymentStatus from "@/components/college/paymentStatus";
import { useSearchParams } from "next/navigation";

export default function Status() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    setOrderId(searchParams.get("order_id"));
    console.log("searchParams", searchParams.get("order_id"));
  }, [searchParams]);

  return (
    <PaymentStatus
      returnURL={`/dashboard/register/success`}
      orderId={orderId!}
    />
  );
}
