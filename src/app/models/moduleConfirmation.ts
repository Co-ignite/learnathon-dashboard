import { CollegeRegistration } from "./registration";
import type { User } from '@/app/models/user';

export interface ModuleConfirmation {
  id?: string;
  college: CollegeRegistration;  // Made required
  spoc: string;
  status: 'pending' | 'active' | 'completed';  // Added proper type
  batchesCount: string;
  financials: number;  // Changed from bigint
  startDate: Date;  // Changed from string
  endDate: Date;    // Changed from string
  isMouSigned: boolean;
  notes: string;
  trainers: User[];  // Made required
  createdAt?: Date;
  updatedAt?: Date;
}

