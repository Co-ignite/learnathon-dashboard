export interface CollegeRegistration {
  id?: string;
  collegeName: string;
  repContact: string;
  repEmail: string;
  repName: string;
  role: string;
  participants: { course: string; count: string }[];
  paymentStatus: string;
  coupon: string;
  uploadLater: boolean;
}
