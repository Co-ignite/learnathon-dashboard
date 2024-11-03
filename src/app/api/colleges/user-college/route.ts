import { db } from "@/lib/firebase";
import { collection, getDocs, where, query } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const { userMail } = body;

    const userCollectionRef = collection(db, "registrations");
    if (!userMail) {
      return NextResponse.json({
        success: false,
        message: "User email is required",
      });
    }

    const userQuery = query(
      userCollectionRef,
      where("repEmail", "==", userMail)
    );

    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.docs.length) {
      return NextResponse.json({
        success: true,
        id: userSnapshot.docs[0].id,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
