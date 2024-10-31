export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({
        success: false,
        message: "User ID is required",
      });
    }

    // get user data from firestore db
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    // error fetching user
    console.error("Error fetching user:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching user",
    });
  }
}
