import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Cancelation() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-4">
      <Card className="w-full max-w-4xl shadow-sm border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Cancellation & Refund Policy
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Last updated on Oct 27th 2025
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="text-gray-700 leading-relaxed mt-6 space-y-5">
          <p>
            <strong>ZAHID MUSHTAQ</strong> believes in helping its customers as far as
            possible, and has therefore a liberal cancellation policy. Under this policy:
          </p>

          <ul className="list-disc pl-6 space-y-3">
            <li>
              Cancellations will be considered only if the request is made within 7 days of
              placing the order. However, the cancellation request may not be entertained if
              the orders have been communicated to the vendors/merchants and they have
              initiated the process of shipping them.
            </li>
            <li>
              ZAHID MUSHTAQ does not accept cancellation requests for perishable items like
              flowers or eatables. However, refund/replacement can be made if the customer
              establishes that the quality of the product delivered is not good.
            </li>
            <li>
              In case of receipt of damaged or defective items, please report the same to
              our Customer Service team within 7 days of receiving the product. The request
              will be entertained once the merchant has checked and determined the issue.
            </li>
            <li>
              If you feel that the product received is not as shown on the site or as per
              your expectations, you must notify our customer service team within 7 days of
              receiving the product. The team will review your complaint and take an
              appropriate decision.
            </li>
            <li>
              For complaints regarding products that come with a warranty from
              manufacturers, please refer to the issue to them directly.
            </li>
            <li>
              In case of any refunds approved by <strong>ZAHID MUSHTAQ</strong>, it will
              take 6–8 days for the refund to be processed to the end customer.
            </li>
          </ul>

          <p className="italic text-sm text-gray-500 pt-4 border-t border-gray-100">
            Disclaimer: The above content is created at ZAHID MUSHTAQ’s sole discretion.
            Razorpay shall not be liable for any content provided here or for any damages or
            losses arising due to merchant’s non-adherence to it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
