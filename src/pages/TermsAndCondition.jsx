import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TermsAndCondition = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-4">
      <Card className="w-full max-w-4xl shadow-sm border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Terms & Conditions
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Last updated on Oct 27th 2025
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="text-gray-700 leading-relaxed mt-6 space-y-5">
          <p>
            For the purpose of these Terms and Conditions, the term <strong>"we"</strong>,{" "}
            <strong>"us"</strong>, <strong>"our"</strong> shall mean{" "}
            <strong>ZAHID MUSHTAQ</strong>, whose registered/operational office is in
            Kunjiwan Tabla, Bye Pass, Jammu, opposite Nitto store. Jammu, JAMMU & KASHMIR
            180010. <strong>"You"</strong>, <strong>"your"</strong>,{" "}
            <strong>"user"</strong> or <strong>"visitor"</strong> shall mean any natural or
            legal person who is visiting our website and/or agreed to purchase from us.
          </p>

          <p className="font-semibold text-gray-800">
            Your use of the website and/or purchase from us are governed by the following
            Terms and Conditions:
          </p>

          <ul className="list-disc pl-6 space-y-3">
            <li>The content of the pages of this website is subject to change without notice.</li>
            <li>
              Neither we nor any third parties provide any warranty or guarantee as to the
              accuracy, timeliness, performance, completeness or suitability of the
              information and materials found on this website for any particular purpose.
            </li>
            <li>
              Your use of any information or materials on our website and/or product pages
              is entirely at your own risk, for which we shall not be liable.
            </li>
            <li>
              Our website contains material which is owned by or licensed to us, including
              design, layout, look, appearance, and graphics. Reproduction is prohibited
              other than in accordance with copyright notice.
            </li>
            <li>
              All trademarks reproduced in this website which are not the property of, or
              licensed to, the operator are acknowledged on the website.
            </li>
            <li>
              Unauthorized use of this website may give rise to a claim for damages and/or
              be a criminal offense.
            </li>
            <li>
              You may not create a link to this website without prior written consent from
              ZAHID MUSHTAQ.
            </li>
            <li>
              Any dispute arising out of use of this website or purchase with us is subject
              to the laws of India.
            </li>
            <li>
              We shall be under no liability for any loss or damages arising out of the
              decline of authorization for any transaction.
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
};

export default TermsAndCondition;
