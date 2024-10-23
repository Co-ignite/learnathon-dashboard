import axios from 'axios';

const CASHFREE_API_URL = process.env.CASHFREE_API_URL || 'https://sandbox.cashfree.com/pg';
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

export async function createCashfreeOrder(orderData: {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerDetails: {
    customerId: string;
    customerEmail: string;
    customerPhone: string;
    customerName: string;
  };
}) {
  try {
    const response = await axios.post(
      `${CASHFREE_API_URL}/orders`,
      orderData,
      {
        headers: {
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating Cashfree order:', error);
    throw error;
  }
}