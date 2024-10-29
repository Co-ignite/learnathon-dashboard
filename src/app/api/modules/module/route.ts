import { db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { ModuleConfirmation } from "@/app/models/moduleConfirmation";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    console.log(params);
    const uid = params.get("uid");
    const module = await getDoc(doc(db, "modules", uid as string));

    const collegeModules: ModuleConfirmation =
      module.data() as ModuleConfirmation;

    if (!module.exists()) {
      return NextResponse.json({
        success: false,
        message: "Module not found",
      });
    }

    return NextResponse.json({
      success: true,
      modules: collegeModules,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching modules",
    });
  }
}
