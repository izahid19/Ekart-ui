import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/utils/config";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SkeletonRow = () => (
  <div className="animate-pulse flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
    <div className="w-1/5 h-4 bg-gray-200 rounded"></div>
    <div className="w-1/5 h-4 bg-gray-200 rounded"></div>
    <div className="w-1/5 h-4 bg-gray-200 rounded"></div>
    <div className="w-1/5 h-4 bg-gray-200 rounded"></div>
    <div className="w-1/5 h-4 bg-gray-200 rounded"></div>
  </div>
);

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/orders/all`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (data.success) setOrders(data.orders);
      } catch (error) {
        console.error("❌ Failed to fetch admin orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 lg:pl-[350px] lg:pr-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Admin - All Orders
        </h1>

        {/* 🔹 Loading State (Shimmer Effect) */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonRow key={idx} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 text-sm">No orders found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-4 py-3 font-mono text-xs truncate">
                      {order._id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.user?.name}</div>
                      <div className="text-xs text-gray-500">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🔹 Dialog for Order Details */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle>Order Details</DialogTitle>
                  <DialogDescription>
                    ID: {selectedOrder._id}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Customer Information
                    </h3>
                    <p>{selectedOrder.user?.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.user?.email}
                    </p>
                  </div>

                  {selectedOrder.shippingAddress && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Shipping Address
                      </h3>
                      <p>{selectedOrder.shippingAddress.fullName}</p>
                      <p>{selectedOrder.shippingAddress.phone}</p>
                      <p>
                        {selectedOrder.shippingAddress.street},{" "}
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state} -{" "}
                        {selectedOrder.shippingAddress.postalCode}
                      </p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Products
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      {selectedOrder.products.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm border-b last:border-none pb-1"
                        >
                          <span>{p.productName}</span>
                          <span>× {p.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between border-t pt-3 text-sm">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-pink-600">
                      ₹{selectedOrder.amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold">Status: </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedOrder.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : selectedOrder.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminOrders;
