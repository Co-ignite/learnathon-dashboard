/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  coupon: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PaymentForm({
  formData,
  participantCount,
  returnURL,
}: {
  formData: any;
  participantCount: number | null;
  returnURL: string;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coupon: "",
    },
  });

  const onSubmit = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/colleges/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          returnURL,
          amount: formData.Amount,
          customerDetails: {
            id: formData.collegeId,
            email: formData.Email,
            phone: formData.Contact,
            name: formData.Name,
          },
        }),
      });

      if (response.status == 200) {
        let data = await response.json();
        data = data.data;

        if (data.payment_session_id) {
          const cashfree = await load({
            mode: "sandbox", //or production
          });

          cashfree.checkout({
            paymentSessionId: data.payment_session_id,
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to create payment session, try again later.",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>{participantCount}</div>
        {
          // show form data
          Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <strong>{key}</strong>: {String(value)}
            </div>
          ))
        }
        <FormField
          control={form.control}
          name="coupon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter coupon code (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Complete Registration
        </Button>
      </form>
    </Form>
  );
}
