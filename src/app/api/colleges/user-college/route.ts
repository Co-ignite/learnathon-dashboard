import { CollegeRegistration } from "@/app/models/registration";
import { db } from "@/lib/firebase";
import { collection, getDocs, where, query, doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const { userMail, collegeId } = body;

    if(userMail){
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
    }

    if(collegeId){
      const collegeRef = doc(db, "colleges", collegeId);
      const collegeSnapshot = await getDoc(collegeRef);
      if (!collegeSnapshot.exists){
        return NextResponse.json({
          success: false,
          message: "College not found",
        });
      }

      const college = collegeSnapshot.data() as CollegeRegistration;

      return NextResponse.json({
        success: true,
        college: college,
      });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
