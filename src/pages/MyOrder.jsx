import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/config";

const MyOrder = () => {
  const navigate = useNavigate();
  const [userOrder, setUserOrder] = useState(null);

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const res = await axios.get(`${BASE_URL}/orders/myorder`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.data.success) {
      // Sort so latest order appears first
      const sortedOrders = [...res.data.orders].reverse();
      setUserOrder(sortedOrders);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  console.log(userOrder);

  return (
    <div className="px-4 sm:px-6 lg:px-20 py-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      {userOrder?.length === 0 ? (
        <p className="text-gray-800 text-lg sm:text-2xl">
          No orders found for this user.
        </p>
      ) : (
        <div className="space-y-6 w-full">
          {userOrder?.map((order) => (
            <div
              key={order._id}
              className="shadow-lg rounded-2xl p-5 border border-gray-200 bg-white hover:shadow-xl transition-all duration-200"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                <h2 className="text-lg font-semibold">
                  Order ID:{" "}
                  <span className="text-gray-600 break-all">{order._id}</span>
                </h2>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Amount:</span>{" "}
                  <span className="font-bold text-pink-600">
                    ₹{order.amount.toFixed(2)}
                  </span>
                </p>
              </div>

              {/* User Info + Status */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">User:</span>{" "}
                    {order.user?.firstName || "Unknown"}{" "}
                    {order.user?.lastName || ""}
                  </p>
                  <p className="text-sm text-gray-500">
                    Email: {order.user?.email || "N/A"}
                  </p>
                </div>
                <span
                  className={`text-white px-3 py-1 rounded-md text-sm font-medium self-start sm:self-center ${
                    order.status === "Paid"
                      ? "bg-green-500"
                      : order.status === "Failed"
                      ? "bg-red-500"
                      : "bg-orange-400"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Product List */}
              <div>
                <h3 className="font-medium mb-2">Products:</h3>
                <ul className="space-y-2">
                  {order.products.map((product, index) => (
                    <li
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-3 rounded-lg gap-3"
                    >
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() =>
                          navigate(`/products/${product?.productId?._id}`)
                        }
                      >
                        <img
                          src={product.productId?.productImg?.[0]?.url}
                          alt={product.productId?.productName}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium line-clamp-2 text-sm sm:text-base">
                            {product.productId?.productName}
                          </span>
                          <span className="text-xs text-gray-500">
                            ID: {product.productId?._id}
                          </span>
                        </div>
                      </div>
                      <span className="font-semibold text-sm sm:text-base">
                        ₹{product.productId?.productPrice} × {product.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Date */}
              <div className="mt-3 text-xs text-gray-500">
                Placed on:{" "}
                {new Date(order.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
