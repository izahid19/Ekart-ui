import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { setCart } from '@/redux/productSlice'
import { ShoppingCart, Trash2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { BASE_URL } from '@/utils/config'
import userLogo from '../assets/user_image.png'
import { toast } from 'sonner'

const Cart = () => {
  const { cart } = useSelector(store => store.product)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const subtotal = cart?.totalPrice
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.05  // example 5%
  const total = subtotal + shipping + tax;

  const API =  BASE_URL + "/cart";
  const accessToken = localStorage.getItem("accessToken");

  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);

    }
  };

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`, { productId, type },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);

    }
  };

const handleRemove = async (productId) => {
  try {
    const res = await axios.delete(`${API}/remove`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { productId }
    });
    if (res.data.success) {
      dispatch(setCart(res.data.cart));
      toast.success('Product removed from cart');
    }
  } catch (error) {
    console.log(error);
  }
};


  useEffect(() => {
    loadCart();
  }, [dispatch]);


  console.log(cart);

  return (
    <div className='pt-20 pb-8 bg-gray-50 min-h-screen px-4 sm:px-6 lg:px-8'>
      {
        cart?.items?.length > 0 ? <div className='max-w-7xl mx-auto'>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-5 sm:mb-7'>Shopping Cart</h1>
          <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-5 lg:gap-7'>
            {/* Cart Items Section */}
            <div className='flex flex-col gap-4 sm:gap-5 flex-1'>
              {cart?.items?.map((product, index) => {
                return <Card key={index} className='overflow-hidden'>
                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 gap-4'>
                    {/* Product Image and Details */}
                    <div className='flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0'>
                      <img 
                        src={product?.productId?.productImg?.[0]?.url || userLogo} 
                        alt="" 
                        className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded flex-shrink-0' 
                      />
                      <div className='min-w-0 flex-1'>
                        <h1 className='font-semibold text-sm sm:text-base line-clamp-2'>{product?.productId?.productName}</h1>
                        <p className='text-sm sm:text-base mt-1'>₹{product?.productId?.productPrice}</p>
                        {/* Mobile: Show total price here */}
                        <p className='font-semibold text-sm sm:hidden mt-1'>
                          Total: ₹{(product?.productId?.productPrice) * (product?.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls and Actions */}
                    <div className='flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-4 sm:gap-5'>
                      {/* Quantity Controls */}
                      <div className='flex gap-2 sm:gap-3 items-center'>
                        <Button 
                          onClick={() => handleUpdateQuantity(product.productId._id, 'decrease')} 
                          variant='outline'
                          size='sm'
                          className='h-8 w-8 p-0'
                        >
                          -
                        </Button>
                        <span className='min-w-[20px] text-center font-medium'>{product.quantity}</span>
                        <Button 
                          onClick={() => handleUpdateQuantity(product.productId._id, 'increase')} 
                          variant='outline'
                          size='sm'
                          className='h-8 w-8 p-0'
                        >
                          +
                        </Button>
                      </div>

                      {/* Desktop: Total Price */}
                      <p className='font-semibold hidden sm:block min-w-[80px] text-right'>
                        ₹{(product?.productId?.productPrice) * (product?.quantity)}
                      </p>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(product?.productId?._id)} 
                        className='flex text-red-500 items-center gap-1 cursor-pointer hover:text-red-600 transition-colors text-sm sm:text-base whitespace-nowrap'
                      >
                        <Trash2 className='w-4 h-4' />
                        <span className='hidden sm:inline'>Remove</span>
                      </button>
                    </div>
                  </div>
                </Card>
              })}
            </div>

            {/* Order Summary Section */}
            <div className='lg:sticky lg:top-24 h-fit'>
              <Card className="w-full lg:w-[380px] xl:w-[400px]">
                <CardHeader>
                  <CardTitle className='text-lg sm:text-xl'>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>₹{cart?.totalPrice?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Shipping</span>
                    <span>₹{shipping.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        placeholder="Promo code"
                        className='text-sm sm:text-base'
                      />
                      <Button variant="outline" className='sm:whitespace-nowrap'>Apply</Button>
                    </div>

                    <Button 
                      onClick={() => navigate('/address')} 
                      size="lg" 
                      className="w-full bg-pink-600 hover:bg-pink-700 text-sm sm:text-base"
                    >
                      PLACE ORDER
                    </Button>

                    <Button variant="outline" size="lg" className="w-full bg-transparent text-sm sm:text-base" asChild>
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>

                  <div className="text-xs sm:text-sm text-muted-foreground pt-4 space-y-1">
                    <p>• Free shipping on orders over $50</p>
                    <p>• 30-day return policy</p>
                    <p>• Secure checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div> : <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          {/* Icon */}
          <div className="bg-pink-100 p-6 rounded-full">
            <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-pink-600" />
          </div>

          {/* Title */}
          <h2 className="mt-6 text-xl sm:text-2xl font-bold text-gray-800">Your Cart is Empty</h2>

          {/* Message */}
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Looks like you haven't added anything to your cart yet.
          </p>

          {/* Button */}
          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition text-sm sm:text-base"
          >
            Start Shopping
          </button>
        </div>
      }

    </div>
  )
}

export default Cart