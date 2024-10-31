export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const district = params.get("district");

    if (!district) {
      return NextResponse.json({
        success: false,
        message: "District parameter is missing",
      });
    }

    // get all colleges from the district
    const collectionRef = collection(db, "colleges");
    const q = query(collectionRef, where("district", "==", district));
    const collegesSnapshot = await getDocs(q);

    const districtColleges: string[] = collegesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return data.collegeName;
    });

    return NextResponse.json({
      success: true,
      colleges: districtColleges,
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching colleges",
    });
  }
}
