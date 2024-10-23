import { NextResponse } from 'next/server';
import { createCashfreeOrder } from '@/lib/cashfree';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency, customerDetails } = body;

    const orderId = `ORDER_${Date.now()}`;

    const orderData = {
      orderId,
      orderAmount: amount,
      orderCurrency: currency,
      customerDetails: {
        customerId: customerDetails.id,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        customerName: customerDetails.name,
      },
    };

    const cashfreeResponse = await createCashfreeOrder(orderData);

    // Store order information in the database


    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Payment initiation failed:', error);
    return NextResponse.json(
      { success: false, message: 'Payment initiation failed' },
      { status: 500 }
    );
  }
}