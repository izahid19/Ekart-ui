import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import { ArrowLeft, MapPin } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BASE_URL } from '@/utils/config'

const ShowUserOrders = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [userOrder, setUserOrder] = useState([])
  const [loading, setLoading] = useState(true)

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem('accessToken')
    try {
      const res = await axios.get(`${BASE_URL}/orders/user-order/${params.userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
        const sortedOrders = res.data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setUserOrder(sortedOrders)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserOrders()
  }, [])

  // ✨ Shimmer Loader Component
  const ShimmerLoader = () => (
    <div className="space-y-4 sm:space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="shadow-lg">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-4 sm:px-6 lg:pl-[350px] lg:pr-20">
      <div className="max-w-7xl mx-auto lg:mx-0">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="icon"
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">User Orders</h1>
        </div>

        {/* Loading Shimmer */}
        {loading ? (
          <ShimmerLoader />
        ) : userOrder.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 text-base sm:text-lg">
                No orders found for this user.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {userOrder.map((order) => (
              <Card key={order._id} className="shadow-lg hover:shadow-xl transition">
                <CardContent className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 pb-4 border-b">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm sm:text-base font-semibold mb-1">
                        Order ID
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 font-mono break-all">
                        {order._id}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        Total Amount
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-pink-600">
                        {order.currency} {order.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* User Info + Status */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <div>
                      <p className="text-sm sm:text-base text-gray-700 mb-1">
                        <span className="font-medium">Customer:</span>{" "}
                        {order.user?.firstName || "Unknown"} {order.user?.lastName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {order.user?.email || "N/A"}
                      </p>
                    </div>
                    <span
                      className={`${
                        order.status === "Paid"
                          ? "bg-green-500"
                          : order.status === "Failed"
                          ? "bg-red-500"
                          : "bg-orange-400"
                      } text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap self-start sm:self-auto`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Address */}
                  {order.address && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 flex items-start gap-3">
                      <MapPin className="text-pink-600 w-5 h-5 mt-1" />
                      <div className="text-sm sm:text-base text-gray-700">
                        <p className="font-medium mb-1">Shipping Address:</p>
                        <p>{order.address.street}</p>
                        <p>
                          {order.address.city}, {order.address.state}{" "}
                          {order.address.zipCode}
                        </p>
                        <p>{order.address.country}</p>
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  <div>
                    <h3 className="font-medium text-sm sm:text-base mb-3">
                      Products:
                    </h3>
                    <div className="space-y-3">
                      {order.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50 p-3 sm:p-4 rounded-lg"
                        >
                          <img
                            onClick={() =>
                              navigate(`/products/${product?.productId?._id}`)
                            }
                            src={product.productId?.productImg?.[0].url}
                            alt={product.productId?.productName}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded cursor-pointer hover:opacity-80 transition flex-shrink-0"
                          />
                          <div className="flex-1 sm:hidden">
                            <p className="text-sm font-medium line-clamp-2 mb-2">
                              {product.productId?.productName}
                            </p>
                            <p className="text-xs text-gray-500 font-mono mb-2 break-all">
                              ID: {product?.productId?._id}
                            </p>
                            <p className="text-sm font-semibold text-pink-600">
                              ₹{product.productId?.productPrice.toLocaleString(
                                "en-IN"
                              )}{" "}
                              × {product.quantity}
                            </p>
                          </div>
                          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between sm:gap-4">
                            <p className="flex-1 text-sm font-medium line-clamp-2">
                              {product.productId?.productName}
                            </p>
                            <p className="text-xs text-gray-500 font-mono w-48 truncate">
                              {product?.productId?._id}
                            </p>
                            <p className="text-sm font-semibold whitespace-nowrap">
                              ₹{product.productId?.productPrice.toLocaleString(
                                "en-IN"
                              )}{" "}
                              × {product.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShowUserOrders
