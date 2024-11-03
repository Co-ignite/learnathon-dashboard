// app/admin/modules/page.tsx
import ModulesList from '@/components/college/modulesList';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ModuleConfirmation } from "@/app/models/moduleConfirmation";

async function getInitialModules() {
  try {
    const q = query(
      collection(db, 'modules'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
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

    return modules;
  } catch (error) {
    console.error('Error fetching initial modules:', error);
    return [];
  }
}

export default async function ModulesPage() {
  const initialModules = await getInitialModules();

  return (
    <div className="container mx-auto py-6">
      <ModulesList initialModules={initialModules} />
    </div>
  );
}