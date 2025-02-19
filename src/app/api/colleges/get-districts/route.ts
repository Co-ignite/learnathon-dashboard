export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const state = params.get("state");

    // get all districts from the state
    const collectionRef = collection(db, "states");
    const q = query(collectionRef, where("state", "==", state));
    const districts = await getDocs(q);

    const stateDistricts: string[] = districts.docs
      .map((doc) => {
        const data = doc.data();
        return data.district;
      })
      .filter((district) => district !== null || district !== "") as string[];

    stateDistricts.sort();

    console.log(stateDistricts);

    return NextResponse.json({
      success: true,
      districts: stateDistricts,
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching districts",
    });
  }
}
