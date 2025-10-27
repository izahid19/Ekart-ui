import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '@/utils/config';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem("accessToken");
    console.log('orders', orders);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(BASE_URL + "/orders/all", {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 lg:pl-[350px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-pink-600" />
                    <p className="text-gray-500">Loading all orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-4 sm:px-6 lg:pl-[350px] lg:pr-20">
            <div className="max-w-7xl mx-auto lg:mx-0">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
                    Admin - All Orders
                </h1>

                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-gray-500 text-sm sm:text-base">No orders found.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow-sm">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Order ID</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">User</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Products</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Amount</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 font-mono text-xs">{order._id}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{order.user?.name}</div>
                                                <div className="text-xs text-gray-500">{order.user?.email}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {order.products.map((p, idx) => (
                                                    <div key={idx} className="text-sm mb-1">
                                                        {p.productName} × {p.quantity}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-4 py-3 font-semibold">
                                                ₹{order.amount.toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium inline-block ${
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

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {orders.map((order) => (
                                <Card key={order._id} className="shadow-sm">
                                    <CardContent className="p-4 space-y-3">
                                        {/* Order ID and Status */}
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                                                <p className="font-mono text-xs break-all">{order._id}</p>
                                            </div>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                                                    order.status === "Paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* User Info */}
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Customer</p>
                                            <p className="font-medium text-sm">{order.user?.name}</p>
                                            <p className="text-xs text-gray-600">{order.user?.email}</p>
                                        </div>

                                        {/* Products */}
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Products</p>
                                            <div className="space-y-1">
                                                {order.products.map((p, idx) => (
                                                    <div key={idx} className="text-sm">
                                                        {p.productName} × {p.quantity}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Amount and Date */}
                                        <div className="flex justify-between items-center pt-2 border-t">
                                            <div>
                                                <p className="text-xs text-gray-500">Date</p>
                                                <p className="text-sm">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Total Amount</p>
                                                <p className="text-lg font-bold text-pink-600">
                                                    ₹{order.amount.toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;