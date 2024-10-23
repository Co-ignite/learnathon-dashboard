export interface CollegeRegistration {
  id?: string;
  state: string;
  district: string;
  collegeName: string;
  repContact: string;
  repEmail: string;
  repName: string;
  role: string;
  courses: { course: string; count: string }[];
  paymentMethod: string;
  coupon: string;
  uploadLater: boolean;
}
