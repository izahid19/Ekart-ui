import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import { ArrowLeft, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BASE_URL } from '@/utils/config'

const ShowUserOrders = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [userOrder, setUserOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem('accessToken')
    try {
      const res = await axios.get(`${BASE_URL}/orders/user-order/${params.userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        setUserOrder(res.data.orders)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserOrders()
  }, [])

  console.log(userOrder);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 lg:pl-[350px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-pink-600" />
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 py-6 sm:py-10 px-4 sm:px-6 lg:pl-[350px] lg:pr-20'>
      <div className="max-w-7xl mx-auto lg:mx-0">
        {/* Header with Back Button */}
        <div className='flex items-center gap-3 sm:gap-4 mb-6'>
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

        {/* Orders Content */}
        {userOrder?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 text-base sm:text-lg">No orders found for this user.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {userOrder?.map((order) => (
              <Card
                key={order._id}
                className="shadow-lg hover:shadow-xl transition"
              >
                <CardContent className="p-4 sm:p-6">
                  {/* Order Header */}
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

                  {/* User Info and Status */}
                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4'>
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
                        order.status === 'Paid' 
                          ? 'bg-green-500' 
                          : order.status === 'Failed' 
                          ? 'bg-red-500' 
                          : 'bg-orange-400'
                      } text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap self-start sm:self-auto`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Products */}
                  <div>
                    <h3 className="font-medium text-sm sm:text-base mb-3">Products:</h3>
                    <div className="space-y-3">
                      {order.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50 p-3 sm:p-4 rounded-lg"
                        >
                          {/* Product Image */}
                          <img 
                            onClick={() => navigate(`/products/${product?.productId?._id}`)} 
                            src={product.productId?.productImg?.[0].url} 
                            alt={product.productId?.productName}
                            className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded cursor-pointer hover:opacity-80 transition flex-shrink-0' 
                          />
                          
                          {/* Product Details - Mobile */}
                          <div className="flex-1 sm:hidden">
                            <p className='text-sm font-medium line-clamp-2 mb-2'>
                              {product.productId?.productName}
                            </p>
                            <p className="text-xs text-gray-500 font-mono mb-2 break-all">
                              ID: {product?.productId?._id}
                            </p>
                            <p className="text-sm font-semibold text-pink-600">
                              ₹{product.productId?.productPrice.toLocaleString('en-IN')} × {product.quantity}
                            </p>
                          </div>

                          {/* Product Details - Desktop */}
                          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between sm:gap-4">
                            <p className='flex-1 text-sm font-medium line-clamp-2'>
                              {product.productId?.productName}
                            </p>
                            <p className="text-xs text-gray-500 font-mono w-48 truncate">
                              {product?.productId?._id}
                            </p>
                            <p className="text-sm font-semibold whitespace-nowrap">
                              ₹{product.productId?.productPrice.toLocaleString('en-IN')} × {product.quantity}
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