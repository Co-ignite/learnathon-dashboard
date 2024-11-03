export const dynamic = "force-dynamic";

import { db } from "@/lib/firebase";
import { getDoc, doc, addDoc, collection } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { ModuleConfirmation } from "@/app/models/moduleConfirmation";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const module: ModuleConfirmation = {
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const moduleRef = await addDoc(collection(db, "modules"), {
      ...module,
      // Convert dates to timestamps for Firestore
      startDate: module.startDate!.toISOString(),
      endDate: module.endDate!.toISOString(),
      createdAt: module.createdAt!.toISOString(),
      updatedAt: module.updatedAt!.toISOString(),
    });

    return NextResponse.json({
      success: true,
      moduleId: moduleRef.id,
    });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json({
      success: false,
      message: "Error creating module",
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
