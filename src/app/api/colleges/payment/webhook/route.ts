import { NextResponse } from "next/server";
import { cashfree } from "@/lib/cashfree";
import { db } from "@/lib/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    // return NextResponse.json({ message: "testing webhook" }, { status: 200 });
    const body = await req.json();
    const signature = req.headers.get("x-webhook-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // const isValid = cashfree.verifyWebhookSignature(body, signature!);
    const isValid = true;

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { event_type, order_id } = body;

    if (event_type === "ORDER_PAID") {
      await updateDoc(doc(db, "payments", order_id), {
        paymentStatus: "paid",
      });

      const registrationDocIdRef = await getDoc(doc(db, "payments", order_id));

      if (!registrationDocIdRef.exists()) {
        return NextResponse.json(
          { error: "Payment record not found" },
          { status: 404 }
        );
      }

      const registrationDocId = registrationDocIdRef.id;

      await updateDoc(doc(db, "registrations", registrationDocId), {
        paymentStatus: "paid",
      });

      console.log(`Payment successful for order ${order_id}`);
    } else {
      // send email to the user that the payment failed
      console.log(`Payment failed for order ${order_id}`);

      await updateDoc(doc(db, "payments", order_id), {
        paymentStatus: "failed",
      });

      const registrationDocIdRef = await getDoc(doc(db, "payments", order_id));

      if (!registrationDocIdRef.exists()) {
        return NextResponse.json(
          { error: "Payment record not found" },
          { status: 404 }
        );
      }

      const registrationDocId = registrationDocIdRef.id;

      await updateDoc(doc(db, "registrations", registrationDocId), {
        paymentStatus: "failed",
      });

      sendEmailToUser(
        registrationDocIdRef.data().repEmail,
        "Payment failed",
        "Your payment has failed. Please try again."
      );
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

function sendEmailToUser(email: string, subject: string, message: string) {
  // send email
  console.log(`Email sent to ${email} with subject: ${subject}`);
  console.log(`Message: ${message}`);
}
