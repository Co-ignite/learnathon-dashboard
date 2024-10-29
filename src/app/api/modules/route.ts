// use firebase and create post and get requests for module with the modules model

import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { ModuleConfirmation } from "@/app/models/moduleConfirmation";

export async function GET() {
  try {
    const modules = await getDocs(collection(db, "modules"));
    const collegeModules: ModuleConfirmation[] = modules.docs.map((doc) => {
      const module = doc.data() as ModuleConfirmation;
      module.id = doc.id;
      return module;
    });
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
    const module = body as ModuleConfirmation;
    const moduleRef = await addDoc(collection(db, "modules"), module);
    return NextResponse.json({
      success: true,
      module: moduleRef.id,
    });
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json({
      success: false,
      message: "Error creating module",
    });
  }
}
