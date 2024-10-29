import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
    console.log("handler called");
    const params = req.nextUrl.searchParams;
    console.log(params);
    const uid = params.get("uid");

    // get user data from firestore db
    const userRef = doc(db, "users", uid as string);
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
