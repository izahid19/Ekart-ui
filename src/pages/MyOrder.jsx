import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/config";

const MyOrder = () => {
  const navigate = useNavigate();
  const [userOrder, setUserOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const getUserOrders = async (pageNumber = 1, append = false) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(`${BASE_URL}/orders/myorder?page=${pageNumber}&limit=10`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        const newOrders = res.data.orders || [];
        setUserOrder((prev) => (append ? [...prev, ...newOrders] : newOrders));
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 🔹 Initial Fetch
  useEffect(() => {
    getUserOrders(1);
  }, []);

  // 🔹 Load More Orders
  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      getUserOrders(nextPage, true);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-20 py-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="space-y-6 w-full animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="shadow-lg rounded-2xl p-5 border border-gray-200 bg-white"
            >
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="flex justify-between mb-3">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                {[1, 2].map((j) => (
                  <div
                    key={j}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                        <div className="h-2 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : userOrder.length === 0 ? (
        <p className="text-gray-800 text-lg sm:text-2xl">
          No orders found for this user.
        </p>
      ) : (
        <>
          <div className="space-y-6 w-full">
            {userOrder.map((order) => (
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

          {/* 🔽 Load More Button */}
          {page < totalPages && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyOrder;
