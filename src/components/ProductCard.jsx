import React from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/productSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/config";

const ProductCard = ({ product, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const { cart } = useSelector((store) => store.product);

  const { _id, productImg, productName, productPrice } = product || {};

  // ⭐ Add to Cart handler
  const addToCart = async (productId) => {
    try {
      if (accessToken) {
        const res = await axios.post(
          `${BASE_URL}/cart/add`,
          { productId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (res.data.success) {
          toast.success("Added to cart");
          dispatch(setCart(res.data.cart));
          localStorage.removeItem("guestCart");
        }
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const existing = guestCart.find((item) => item.productId === productId);

        if (existing) existing.quantity += 1;
        else guestCart.push({ productId, quantity: 1, product });

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        dispatch(setCart({ items: guestCart }));
        toast.success("Added to cart (Guest)");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }
  };

  // 🌀 Shimmer while loading
  if (loading) {
    return (
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <Skeleton className="w-full aspect-square" />
        <div className="p-5 space-y-3">
          <Skeleton className="w-3/4 h-5" />
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-full h-9 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div
        className="cursor-pointer p-6 pb-2"
        onClick={() => navigate(`/products/${_id}`)}
      >
        <img
          className="rounded-t-lg w-full h-[220px] object-contain transition-transform duration-300 hover:scale-105"
          src={productImg?.[0]?.url}
          alt={productName}
        />
      </div>

      {/* Content */}
      <div className="px-5 pb-5">
        <h5
          onClick={() => navigate(`/products/${_id}`)}
          className="text-lg font-semibold tracking-tight text-gray-900 line-clamp-2 cursor-pointer hover:text-pink-600 transition-colors"
        >
          {productName}
        </h5>

        {/* Rating */}
        <div className="flex items-center mt-3 mb-5">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4].map((i) => (
              <svg
                key={i}
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 00-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 00-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 001.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 002.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 002.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 00.387-1.575z" />
              </svg>
            ))}
            <svg
              className="w-4 h-4 text-gray-300"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 00-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 00-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 001.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 002.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 002.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 00.387-1.575z" />
            </svg>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-sm ml-3">
            4.8
          </span>
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ₹{productPrice?.toLocaleString()}
          </span>
          <Button
            onClick={() => addToCart(_id)}
            className="text-sm px-5 py-2.5 cursor-pointer bg-pink-500 hover:bg-pink-600 transition-all"
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
