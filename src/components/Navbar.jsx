import React, { useEffect, useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BASE_URL } from "@/utils/config";
import axios from "axios";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { setCart } from "@/redux/productSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.product);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const admin = user && user.role === "admin";
  const API = `${BASE_URL}/cart`;

  const loadCart = async () => {
    try {
      if (accessToken) {
        const res = await axios.get(API, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.data.success) {
          const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

          if (guestCart.length > 0) {
            for (const item of guestCart) {
              await axios.post(
                `${BASE_URL}/cart/add`,
                { productId: item.productId, quantity: item.quantity },
                { headers: { Authorization: `Bearer ${accessToken}` } }
              );
            }
            localStorage.removeItem("guestCart");
          }

          const updated = await axios.get(API, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          dispatch(setCart(updated.data.cart));
        }
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        dispatch(setCart({ items: guestCart }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [dispatch, accessToken]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/logout`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setShowLogoutModal(false);
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/Ekart.png"
              alt="Ekart"
              className="w-[90px] sm:w-[110px]"
            />
          </Link>

          {/* Mobile Icons */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="bg-pink-500 rounded-full absolute text-white -top-2 -right-3 px-1.5 text-xs font-semibold">
                {cart?.items?.length || 0}
              </span>
            </Link>

            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10 justify-between items-center">
            <ul className="flex gap-7 items-center text-[17px] font-semibold">
              <Link to="/products">
                <li className="hover:text-pink-600 transition">Products</li>
              </Link>
              {user && (
                <Link to={`/profile/${user._id}`}>
                  <li className="hover:text-pink-600 transition">
                    Hello, {user.firstName}
                  </li>
                </Link>
              )}
              {admin && (
                <Link to={"/dashboard/sales"}>
                  <li className="hover:text-pink-600 transition">Dashboard</li>
                </Link>
              )}
            </ul>

            <div className="flex items-center gap-5">
              <Link to={"/cart"} className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="bg-pink-500 rounded-full absolute text-white -top-2 -right-3 px-1.5 text-xs font-semibold">
                  {cart?.items?.length || 0}
                </span>
              </Link>
              {user ? (
                <Button
                  onClick={() => setShowLogoutModal(true)}
                  className="bg-pink-600"
                >
                  Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button className="bg-gradient-to-tl from-blue-500 to-purple-600 text-white">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* ✅ Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-pink-200 shadow-md">
            <ul className="flex flex-col p-4 space-y-4 font-semibold text-gray-800">
              <Link to="/products" onClick={() => setMenuOpen(false)}>
                <li className="hover:text-pink-600 transition">Products</li>
              </Link>
              {user && (
                <Link
                  to={`/profile/${user._id}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <li className="hover:text-pink-600 transition">
                    Hello, {user.firstName}
                  </li>
                </Link>
              )}
              {admin && (
                <Link
                  to="/dashboard/sales"
                  onClick={() => setMenuOpen(false)}
                >
                  <li className="hover:text-pink-600 transition">
                    Dashboard
                  </li>
                </Link>
              )}

              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                {user ? (
                  <Button
                    onClick={() => setShowLogoutModal(true)}
                    className="bg-pink-600 w-full"
                  >
                    Logout
                  </Button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full"
                  >
                    <Button className="bg-gradient-to-tl from-blue-500 to-purple-600 text-white w-full">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </ul>
          </div>
        )}
      </header>

      {/* Logout Modal */}
      <AlertDialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleLogout}>
              Yes, Logout
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Navbar;
