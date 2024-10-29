export interface CustomerDetails {
  id: string;
  email: string;
  phone: string;
}

export interface PaymentFormProps {
  amount: number;
  customerDetails: CustomerDetails;
}

export interface PaymentOrder {
  order_id: string;
  order_status: string;
  payment_session_id: string;
}
