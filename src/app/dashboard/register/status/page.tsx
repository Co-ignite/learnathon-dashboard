"use client";
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2500774303.
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import PaymentStatus from "src/components/college/paymentStatus";

export default function Status() {
  return (
    <Suspense fallback={<div>Loading...</div>} >
      <PaymentStatus
        returnURL={`/dashboard/register/success`}
        />
    </Suspense>
  );
}
