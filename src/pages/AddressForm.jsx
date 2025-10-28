import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addAddress,
  deleteAddress,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/config";

const AddressForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product
  );
  const [showForm, setShowForm] = useState(addresses.length > 0 ? false : true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cart?.totalPrice;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(addAddress(formData));
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });
    setShowForm(false);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const accessToken = localStorage.getItem("accessToken");

  const handlePayment = async () => {
    try {
      const orderPayload = {
        products: cart?.items?.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        tax,
        shipping,
        amount: total,
        currency: "INR",
      };

      const { data } = await axios.post(
        BASE_URL + "/orders/create-order",
        orderPayload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!data.success) return toast.error("Something went wrong creating order");

      const { order } = data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Ekart",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              BASE_URL + "/orders/verify-payment",
              response,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );

            if (verifyRes.data.success) {
              toast.success("✅ Payment Successful!");
              dispatch(setCart({ items: [], totalPrice: 0 }));
              navigate("/order-success");
            } else {
              toast.error("❌ Payment Verification Failed");
            }
          } catch (error) {
            console.error(error);
            toast.error("Error verifying payment");
          }
        },
        modal: {
          ondismiss: async function () {
            await axios.post(
              BASE_URL + "/orders/verify-payment",
              {
                razorpay_order_id: order.id,
                paymentFailed: true,
              },
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
            toast.error("Payment cancelled or failed");
          },
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#F472B6" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function () {
        await axios.post(
          BASE_URL + "/orders/verify-payment",
          {
            razorpay_order_id: order.id,
            paymentFailed: true,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        toast.error("Payment Failed. Please try again.");
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while processing payment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title - Mobile */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 lg:hidden">
          {showForm ? "Delivery Address" : "Select Address"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
          {/* LEFT SIDE - Address Form/List */}
          <div className="order-2 lg:order-1">
            <Card className="shadow-sm">
              <CardHeader className="hidden lg:block">
                <CardTitle className="text-lg sm:text-xl">
                  {showForm ? "Delivery Address" : "Select Address"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                {showForm ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName" className="text-sm">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                          placeholder="+91 9876543210"
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10)
                              setFormData({ ...formData, phone: value });
                          }}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address" className="text-sm">
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          type="text"
                          required
                          placeholder="123 Street, Area"
                          value={formData.address}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-sm">
                            City
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            required
                            placeholder="Kolkata"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-sm">
                            State
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            type="text"
                            required
                            placeholder="West Bengal"
                            value={formData.state}
                            onChange={handleChange}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zip" className="text-sm">
                            Zip Code
                          </Label>
                          <Input
                            id="zip"
                            name="zip"
                            type="number"
                            inputMode="numeric"
                            required
                            placeholder="700001"
                            value={formData.zip}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 6)
                                setFormData({ ...formData, zip: value });
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country" className="text-sm">
                            Country
                          </Label>
                          <Input
                            id="country"
                            name="country"
                            type="text"
                            required
                            placeholder="India"
                            value={formData.country}
                            onChange={handleChange}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSave} className="w-full mt-6">
                      Save & Continue
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-base sm:text-lg font-semibold lg:hidden">
                      Saved Addresses
                    </h2>
                    {addresses.map((addr, index) => (
                      <div
                        key={index}
                        className={`border p-3 sm:p-4 rounded-md cursor-pointer relative transition-all ${
                          selectedAddress === index
                            ? "border-pink-600 bg-pink-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => dispatch(setSelectedAddress(index))}
                      >
                        <p className="font-medium text-sm sm:text-base pr-16">
                          {addr.fullName}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {addr.phone}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {addr.email}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2">
                          {addr.address}, {addr.city}, {addr.state}, {addr.zip},{" "}
                          {addr.country}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(deleteAddress(index));
                          }}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowForm(true)}
                    >
                      + Add New Address
                    </Button>

                    <Button
                      disabled={selectedAddress === null}
                      onClick={handlePayment}
                      className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
                    >
                      Proceed To Checkout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-6 h-fit">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal ({cart?.items?.length || 0} items)</span>
                  <span className="font-medium">
                    ₹{subtotal?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Shipping</span>
                  <span className="font-medium">
                    ₹{shipping.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Tax (5%)</span>
                  <span className="font-medium">
                    ₹{tax.toLocaleString("en-IN")}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground pt-4 space-y-1">
                  <p>• Free shipping on orders over ₹50</p>
                  <p>• 30-day return policy</p>
                  <p>• Secure checkout with SSL encryption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
