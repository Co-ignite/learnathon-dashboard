export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ModuleConfirmation } from '@/app/models/moduleConfirmation';

export interface ModulesResponse {
  success: boolean;
  modules?: ModuleConfirmation[];
  error?: string;
  lastDoc?: any;
  hasMore?: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const collegeId = url.searchParams.get('collegeId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const lastDocId = url.searchParams.get('lastDocId');

    const modulesQuery = collection(db, 'modules');
    const constraints: any[] = [];

    // Add filters if provided
    if (status) {
      constraints.push(where('status', '==', status));
    }
    if (collegeId) {
      constraints.push(where('college.id', '==', collegeId));
    }

    // Add sorting
    constraints.push(orderBy('createdAt', 'desc'));
    
    // Add pagination
    constraints.push(limit(pageSize));
    
    if (lastDocId) {
      const lastDocRef = await getDocs(query(collection(db, 'modules'), where('id', '==', lastDocId)));
      if (!lastDocRef.empty) {
        constraints.push(startAfter(lastDocRef.docs[0]));
      }
    }

    const q = query(modulesQuery, ...constraints);
    const snapshot = await getDocs(q);

    const modules: ModuleConfirmation[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      modules.push({
        id: doc.id,
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      } as ModuleConfirmation);
    });

    // Check if there are more documents
    const hasMore = modules.length === pageSize;
    const lastDoc = modules[modules.length - 1]?.id;

    return NextResponse.json({
      success: true,
      modules,
      hasMore,
      lastDoc,
    });

  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}