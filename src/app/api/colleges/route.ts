import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";
import { CollegeRegistration } from "@/app/models/registration";

export async function GET() {
  try {
    const registrations = await getDocs(collection(db, "registrations"));
    const collegeRegistrations: CollegeRegistration[] = registrations.docs.map(
      (doc) => {
        const registration = doc.data() as CollegeRegistration;
        registration.id = doc.id;
        return registration;
      }
    );
    return NextResponse.json({
      success: true,
      registrations: collegeRegistrations,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching registrations",
    });
  }
}
