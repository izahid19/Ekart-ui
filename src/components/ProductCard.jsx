import React from "react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/productSlice";
import { Skeleton } from "./ui/skeleton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "@/utils/config";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, loading }) => {
  const { cart } = useSelector((store) => store.product);
  const { productImg, productPrice, productName } = product;
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async (productId) => {
    try {
      if (accessToken) {
        // ✅ Logged-in user → Save to backend
        const res = await axios.post(
          BASE_URL + "/cart/add",
          { productId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (res.data.success) {
          toast.success("Product added to cart");
          dispatch(setCart(res.data.cart));
          localStorage.removeItem("guestCart");
        }
      } else {
        // 🛒 Guest user → Save locally
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const existing = guestCart.find((item) => item.productId === productId);

        if (existing) {
          existing.quantity += 1;
        } else {
          guestCart.push({ productId, quantity: 1, product });
        }

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        dispatch(setCart({ items: guestCart }));
        toast.success("Product added to cart (Guest)");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="shadow-lg rounded-lg overflow-hidden h-max">
      <div className="w-full h-full aspect-square overflow-hidden">
        {loading ? (
          <Skeleton className="rounded-lg w-full h-full" />
        ) : (
          <img
            onClick={() => navigate(`/products/${product._id}`)}
            src={productImg[0]?.url}
            alt=""
            className="w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        )}
      </div>
      {loading ? (
        <div className="px-2 space-y-2 my-2">
          <Skeleton className="w-[200px] h-4" />
          <Skeleton className="w-[100px] h-4" />
          <Skeleton className="w-[150px] h-8" />
        </div>
      ) : (
        <div className="px-2 space-y-1">
          <h1 className="font-semibold line-clamp-2 h-12">{productName}</h1>
          <h2 className="font-bold">₹{productPrice}</h2>
          <Button
            onClick={() => addToCart(product._id)}
            className="bg-pink-600 mb-3 w-full"
          >
            <ShoppingCart className="mr-1" />
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
