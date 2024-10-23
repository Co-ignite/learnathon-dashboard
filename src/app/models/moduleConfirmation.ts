import { CollegeRegistration } from "./registration";

export interface ModuleConfirmation {
  representative: string;
  status: string;
  no_of_batches_students: { course: string; count: string }[];
  financials: bigint;
  dates: string;
  is_mou_signed: boolean;
  notes: string;
  trainers: string[];
  registration: CollegeRegistration;
}