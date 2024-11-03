import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export async function POST(req: NextRequest) {
  try {
    console.log("handler called");
    const body = await req.json();
    const { collegeName, repName, repEmail, repContact, role } = body;

    if (!collegeName) {
      console.error("College name is required");
      console.error(req.body);
      return NextResponse.json({
        success: false,
        message: "College name is required",
      });
    }

    // Check if the college is already registered
    const collectionRef = collection(db, "registrations");
    const q = query(collectionRef, where("collegeName", "==", collegeName));
    const collegesSnapshot = await getDocs(q);

    if (collegesSnapshot.docs.length) {
      return NextResponse.json({
        success: false,
        message: `College is already registered: ${repEmail}`,
      });
    }

    // Check if the user is already registered
    const userCollectionRef = collection(db, "users");
    const userQuery = query(userCollectionRef, where("email", "==", repEmail));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.docs.length) {
      return NextResponse.json({
        success: false,
        message: `User is already registered: ${repEmail}`,
      });
    }

    // Create a new document in the 'registrations' collection
    const docRef = await addDoc(collection(db, "registrations"), {
      collegeName,
      repName,
      repEmail,
      repContact,
      role,
      uploadLater: true,
      paymentStatus: "pending",
      createdAt: Date.now(),
    });

    console.log(docRef.id);

    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        repEmail,
        Math.random().toString(36).slice(-8)
      );

      const userDocRef = doc(db, "users", user.user.uid);

      await setDoc(userDocRef, {
        email: repEmail,
        role: "college",
        contact: repContact,
        name: repName,
      });

      // Send email to the user with the password
      await sendPasswordResetEmail(auth, repEmail);
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json({
        success: false,
        message: `Your college got registered, please contact hr@learnathon.live to get your password`,
      });
    }

    // Create user with email and password in Firebase Auth and add the user ID to the college document in Firestore, also send email to the user with the password

    return NextResponse.json({
      success: true,
      message: "College details updated successfully",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error updating college details:", error);
    const requestBody = await req.json();
    return NextResponse.json({
      success: false,
      message: `Internal Server Error. Failed to update details for ${requestBody["collegeName"]}`,
    });
  }
}
