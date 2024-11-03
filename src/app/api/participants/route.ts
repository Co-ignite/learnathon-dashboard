import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  collectionGroup,
  getDoc,
  doc,
} from "firebase/firestore";
import { Participant } from "@/app/models/participant";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const lastDoc = searchParams.get("lastDoc");
    const collegeId = searchParams.get("collegeId");
    const participantName = searchParams.get("participantName");

    let participantsQuery;

    if (collegeId) {
      // Query specific college's participants
      participantsQuery = query(
        collection(db, "registration", collegeId, "participants"),
        orderBy("name")
      );
    } else {
      // Query all participants across all colleges
      participantsQuery = query(collectionGroup(db, "registrations"));
    }

    // Apply name filter if provided
    if (participantName) {
      participantsQuery = query(
        participantsQuery,
        where("name", ">=", participantName),
        where("name", "<=", participantName + "\uf8ff")
      );
    }

    // Apply pagination
    if (lastDoc) {
      const lastDocSnapshot = await getDocumentSnapshot(lastDoc, collegeId);
      if (lastDocSnapshot) {
        participantsQuery = query(
          participantsQuery,
          startAfter(lastDocSnapshot)
        );
      }
    }

    participantsQuery = query(participantsQuery, limit(pageSize));

    const snapshot = await getDocs(participantsQuery);
    const participants: Participant[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      participants.push({
        id: doc.id,
        ...data,
        collegeId: doc.ref.parent.parent?.id || "",
      } as Participant);
    });

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return Response.json({
      participants,
      lastDoc: lastVisible
        ? JSON.stringify({
            id: lastVisible.id,
            collegeId: lastVisible.ref.parent.parent?.id,
          })
        : null,
      hasMore: snapshot.docs.length === pageSize,
    });
  } catch (error) {
    console.error("Error fetching participants:", error);
    return Response.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}

async function getDocumentSnapshot(
  lastDocString: string,
  collegeId: string | null
): Promise<QueryDocumentSnapshot<DocumentData> | null> {
  try {
    const lastDoc = JSON.parse(lastDocString);
    let docRef;
    if (collegeId) {
      docRef = doc(db, "registrations", collegeId, "participants", lastDoc.id);
    } else {
      // For collection group queries, we need to use a different approach
      const q = query(
        collectionGroup(db, "participants"),
        where("__name__", "==", lastDoc.id)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs[0] || null;
    }
    const docSnap = await getDoc(docRef);
    return docSnap as QueryDocumentSnapshot<DocumentData>;
  } catch {
    return null;
  }
}
