import { Suspense } from "react";
import PaymentStatus from "@/components/college/paymentStatus";

export default function Status() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentStatus returnURL="/admin/colleges" />
    </Suspense>
  );
}
