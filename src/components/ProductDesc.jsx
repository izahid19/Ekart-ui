import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/utils/config";

const ProductDesc = ({ product }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.product);
  const accessToken = localStorage.getItem("accessToken");
  const [quantity, setQuantity] = useState(1);

  const addToCart = async (productId) => {
    try {
      if (accessToken) {
        const res = await axios.post(
          `${BASE_URL}/cart/add`,
          { productId, quantity },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (res.data.success) {
          toast.success("Product added to cart");
          dispatch(setCart(res.data.cart));
          localStorage.removeItem("guestCart");
        }
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const existing = guestCart.find((item) => item.productId === productId);

        if (existing) {
          existing.quantity += Number(quantity);
        } else {
          guestCart.push({
            productId,
            quantity: Number(quantity),
            product,
          });
        }

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        dispatch(setCart({ items: guestCart }));
        toast.success("Product added to cart (Guest)");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while adding to cart");
    }
  };

  return (
    <div className="flex flex-col gap-4 px-2 sm:px-4">
      <h1 className="font-bold text-2xl sm:text-4xl text-gray-800">
        {product.productName}
      </h1>
      <p className="text-gray-700 text-sm sm:text-base">
        {product.category} | {product.brand}
      </p>
      <h2 className="text-pink-600 font-bold text-xl sm:text-2xl">
        ₹{product.productPrice}
      </h2>
      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
        {product.productDesc}
      </p>

      <div className="flex gap-2 items-center w-full sm:w-[300px]">
        <p className="text-gray-800 font-semibold">Quantity:</p>
        <Input
          type="number"
          className="w-20 sm:w-16"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <Button
        onClick={() => addToCart(product._id)}
        className="bg-pink-600 hover:bg-pink-700 text-white w-full sm:w-max mt-2"
      >
        <ShoppingCart className="mr-1" /> Add to Cart
      </Button>
    </div>
  );
};

export default ProductDesc;
