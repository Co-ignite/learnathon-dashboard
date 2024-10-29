import { NextResponse } from "next/server";
import { cashfree } from "@/lib/cashfree";
import { db } from "@/lib/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const data = await cashfree.verifyPayment(orderId);

    if (!data) {
      return NextResponse.json(
        { error: "Failed to verify payment" },
        { status: 500 }
      );
    }

    if (data.order_status === "PAID") {
      await updateDoc(doc(db, "payments", orderId), {
        paymentStatus: "paid",
      });

      const registrationDocIdRef = await getDoc(doc(db, "payments", orderId));

      if (!registrationDocIdRef.exists()) {
        return NextResponse.json(
          { error: "Payment record not found" },
          { status: 404 }
        );
      }

      const registrationDocId = registrationDocIdRef.data().collegeId;

      await updateDoc(doc(db, "registrations", registrationDocId), {
        paymentStatus: "paid",
      });

      return NextResponse.json({ order_status: "PAID" });
    }

    if (data.order_status === "FAILED") {
      return NextResponse.json({ order_status: "FAILED" });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
