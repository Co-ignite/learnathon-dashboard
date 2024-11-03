export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  Query
} from 'firebase/firestore'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    console.log(searchParams)
    const collegeId = searchParams.get('collegeId')
    const participantName = searchParams.get('participantName')
    const sortField = searchParams.get('sortField') || 'Name'
    const sortDirection = searchParams.get('sortDirection') || 'asc'
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
    const lastDoc = searchParams.get('lastDoc')

    if (isNaN(pageSize) || pageSize <= 0) {
      return NextResponse.json({ error: 'Invalid page size' }, { status: 400 })
    }

    const constraints: any[] = [orderBy(sortField, sortDirection as 'asc' | 'desc')]

    if (collegeId) {
      constraints.unshift(where('collegeId', '==', collegeId))
    }

    if (participantName) {
      constraints.push(
        where('Name', '>=', participantName),
        where('Name', '<=', participantName + '\uf8ff')
      )
    }

    if (lastDoc) {
      const lastDocSnapshot = await getDocumentSnapshot(lastDoc)
      if (lastDocSnapshot) {
        constraints.push(startAfter(lastDocSnapshot))
      }
    }

    constraints.push(limit(pageSize))

    const participantsRef = collection(db, 'participants')
    const q = query(participantsRef, ...constraints) as Query<DocumentData>
    const snapshot = await getDocs(q)

    const participants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const lastVisible = snapshot.docs[snapshot.docs.length - 1]

    return NextResponse.json({
      participants,
      lastDoc: lastVisible ? lastVisible.id : null,
      hasMore: snapshot.docs.length === pageSize
    })
  } catch (error) {
    console.error('Error fetching participants:', error)
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 })
  }
}

async function getDocumentSnapshot(docId: string): Promise<QueryDocumentSnapshot<DocumentData> | null> {
  try {
    const participantsRef = collection(db, 'participants')
    const q = query(participantsRef, where('__name__', '==', docId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs[0] || null
  } catch (error) {
    console.error('Error getting document snapshot:', error)
    return null
  }
}