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

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        dispatch(setUser(null));
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setShowLogoutModal(false);
      setMenuOpen(false);
    }
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [dispatch]);

  return (
    <>
      <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
          {/* Logo → now clickable */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/Ekart.png"
              alt="Ekart"
              className="w-[90px] sm:w-[110px] cursor-pointer"
            />
          </Link>

          {/* Cart + Menu button (Mobile) */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Cart always visible */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="bg-pink-500 rounded-full absolute text-white -top-2 -right-3 px-1.5 text-xs font-semibold">
                {cart?.items?.length || 0}
              </span>
            </Link>

            {/* Hamburger toggle */}
            <button
              className="p-2 rounded-md hover:bg-pink-100 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
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
                  onClick={openLogoutModal}
                  className="bg-pink-600 text-white hover:bg-pink-700"
                >
                  Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button className="bg-gradient-to-tl from-blue-500 to-purple-600 text-white hover:opacity-90">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-pink-50 border-t border-pink-200 animate-fade-in">
            <ul className="flex flex-col items-start gap-4 px-6 py-4 text-lg font-semibold">
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
                <Link to="/dashboard/sales" onClick={() => setMenuOpen(false)}>
                  <li className="hover:text-pink-600 transition">Dashboard</li>
                </Link>
              )}
              {user ? (
                <Button
                  onClick={openLogoutModal}
                  className="bg-pink-600 text-white w-full"
                >
                  Logout
                </Button>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button className="bg-gradient-to-tl from-blue-500 to-purple-600 text-white w-full">
                    Login
                  </Button>
                </Link>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <AlertDialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-pink-600 hover:bg-pink-700"
            >
              Yes, Logout
            </AlertDialogAction>
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Navbar;