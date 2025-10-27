import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Shipping = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-4">
      <Card className="w-full max-w-4xl shadow-sm border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Shipping & Delivery Policy
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Last updated on Oct 27th 2025
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="text-gray-700 leading-relaxed mt-6 space-y-5">
          <p>
            For international buyers, orders are shipped and delivered through
            registered international courier companies and/or international
            speed post only. For domestic buyers, orders are shipped through
            registered domestic courier companies and/or speed post only.
          </p>

          <p>
            Orders are shipped within <strong>0–7 days</strong> or as per the
            delivery date agreed at the time of order confirmation and delivery
            of the shipment is subject to courier company or post office norms.
            <strong> ZAHID MUSHTAQ </strong> is not liable for any delay in
            delivery by the courier company or postal authorities and only
            guarantees to hand over the consignment to them within 0–7 days from
            the date of order and payment, or as per the delivery date agreed at
            the time of order confirmation.
          </p>

          <p>
            Delivery of all orders will be made to the address provided by the
            buyer. Delivery of services will be confirmed on your registered
            email ID as specified during registration.
          </p>

          <p>
            For any issues in utilizing our services, you may contact our
            helpdesk at{" "}
            <a
              href="tel:7006066507"
              className="text-blue-600 hover:underline font-medium"
            >
              7006066507
            </a>{" "}
            or via email at{" "}
            <a
              href="mailto:jobresponse.zahidmushtaq@gmail.com"
              className="text-blue-600 hover:underline font-medium"
            >
              jobresponse.zahidmushtaq@gmail.com
            </a>
            .
          </p>

          <p className="italic text-sm text-gray-500 pt-4 border-t border-gray-100">
            Disclaimer: The above content is created at ZAHID MUSHTAQ’s sole
            discretion. Razorpay shall not be liable for any content provided
            here or for any damages or losses arising due to merchant’s
            non-adherence to it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shipping;
