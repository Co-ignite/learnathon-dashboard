import crypto from "crypto";
/* eslint-disable @typescript-eslint/no-explicit-any */
export class Cashfree {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_CASHFREE_API_KEY!;
    this.secretKey = process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY!;
    this.baseUrl = "https://sandbox.cashfree.com/pg";
  }

  async createOrder(params: {
    returnURL: string;
    amount: number;
    customerDetails: {
      id: string;
      email: string;
      phone: string;
    };
  }) {
    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const orderData = {
      order_amount: params.amount,
      order_id: orderId,
      order_currency: "INR",
      customer_details: {
        customer_id: params.customerDetails.id,
        customer_email: params.customerDetails.email,
        customer_phone: params.customerDetails.phone,
      },
      order_meta: {
        return_url: params.returnURL + `?order_id=${orderId}`,
        notify_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colleges/payment/webhook`,
      },
    };

    console.log("Creating order:", orderData);
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": this.apiKey,
          "x-client-secret": this.secretKey,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        console.error("Failed to create order:", response.statusText);
        const body = await response.text();
        console.error(body);
        console.error(response.status);
        console.error(response.type);
        return null;
      }

      return response.json();
    } catch (error) {
      console.error("Failed to create order:", error);
      return null;
    }
  }

  async verifyPayment(orderId: string) {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      headers: {
        "x-api-version": "2022-09-01",
        "x-client-id": this.apiKey,
        "x-client-secret": this.secretKey,
      },
    });

    return response.json();
  }

  verifyWebhookSignature(payload: any, signature: string): boolean {
    const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("CASHFREE_WEBHOOK_SECRET is not defined");
    }

    const computedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(payload))
      .digest("base64");

    return signature === computedSignature;
  }
}

export const cashfree = new Cashfree();
