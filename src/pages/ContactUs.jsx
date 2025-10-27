import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-4">
      <Card className="w-full max-w-4xl shadow-sm border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Contact Us
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            We'd love to hear from you. Reach out anytime!
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="mt-6 space-y-10">
          {/* Contact Info Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Get in Touch
            </h2>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <a
                  href="mailto:jobresponse.zahidmushtaq@gmail.com"
                  className="hover:underline"
                >
                  jobresponse.zahidmushtaq@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:7006066507" className="hover:underline">
                  +91 7006066507
                </a>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                Kunjiwan Tabla, Bye Pass, Jammu, opposite Nitto store,
                Jammu & Kashmir 180010
              </p>
            </div>
          </div>

          <Separator />

          {/* Contact Form Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Send Us a Message
            </h2>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  placeholder="Your full name"
                  required
                  className="focus-visible:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="focus-visible:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  placeholder="Write your message here..."
                  rows={5}
                  required
                  className="focus-visible:ring-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90"
              >
                Send Message
              </Button>
            </form>
          </div>

          <p className="italic text-sm text-gray-500 pt-6 border-t border-gray-100">
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

export default ContactUs;
