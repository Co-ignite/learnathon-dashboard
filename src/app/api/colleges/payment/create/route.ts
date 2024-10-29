import { NextResponse } from "next/server";
import { cashfree } from "@/lib/cashfree";
import { db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await cashfree.createOrder(body);

    if (data) {
      await setDoc(doc(db, "payments", data.order_id), {
        orderId: data.order_id,
        collegeId: body.customerDetails.id,
        amount: body.amount,
        paymentStatus: "pending",
      });
      console.log("Order created with ID: ", data.order_id);
    } else {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
