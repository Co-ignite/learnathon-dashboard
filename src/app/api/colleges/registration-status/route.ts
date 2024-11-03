import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({
        success: true,
        message: "ID is required",
        step: 1,
      });
    }

    // Directly get the college document by ID
    const collegeDocRef = doc(db, "registrations", id);
    const collegeDoc = await getDoc(collegeDocRef);

    if (collegeDoc.exists()) {
      const collegeData = collegeDoc.data();
      const collegeId = collegeDoc.id;

      if (collegeData.uploadLater) {
        return NextResponse.json({
          success: true,
          message: "College is registered",
          step: 2,
          collegeId,
        });
      } else {
        if (collegeData.paymentStatus === "paid") {
          return NextResponse.json({
            success: true,
            message: "College is registered",
            registered: true,
            collegeName: collegeData.collegeName,
            collegeId,
          });
        } else {
          // check for payment record and redirect with previous created order

          const participantsCollectionRef = collection(
            db,
            "registrations",
            collegeDoc.id,
            "participants"
          );

          const participantsSnapshot = await getDocs(participantsCollectionRef);

          const participantCount = participantsSnapshot.docs.length;
          console.log("Participant count:", collegeData.repContact);
          return NextResponse.json({
            success: true,
            message: "College is registered",
            step: 3,
            collegeId,
            participantCount,
            email: collegeData.repEmail,
            contact: collegeData.repContact,
            name: collegeData.repName,
            price: collegeData.price,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Invalid registration",
      step: 0,
    });
  } catch (error) {
    console.error("Error getting college details:", error);
    return NextResponse.json({
      success: false,
      message: "Error getting college details",
    });
  }
}
