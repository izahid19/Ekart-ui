import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/Cancelation"
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyAccount from './pages/VerifyAccount';
import VerifyEmail from './pages/VerifyEmail';
import ForgetPassword from './pages/ForgetPassword';
import VerifyOTP from './pages/VerifyOTP';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import Product from './pages/Product';
import SingleProduct from './pages/SingleProduct';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import TermsAndCondition from './pages/TermsAndCondition';
import Shipping from './pages/Shipping';
import Cancelation from './pages/Cancelation';

const router = createBrowserRouter([
  {
    path: "/",
    element: <>
    <Navbar />
    <Home />
    <Footer />
    </>,
  },
  {
    path: "/terms",
    element: <>
    <Navbar />
    <TermsAndCondition />
    <Footer />
    </>,
  },
  {
    path: "/refund",
    element: <>
    <Navbar />
    <Cancelation />
    <Footer />
    </>,
  },
  {
    path: "/shipping",
    element: <>
    <Navbar />
    <Shipping />
    <Footer />
    </>,
  },
  {
    path: "/products",
    element: <>
    <Navbar />
    <Product />
    </>,
  },
  {
    path: '/products/:id',
    element: <><Navbar /><SingleProduct /></>
  },
  {
    path: '/cart',
    element: <ProtectedRoute><Navbar /><Cart /></ProtectedRoute>
  },
  {
    path: "/profile/:userId",
    element: <>
    <Navbar />
    <Profile />
    <Footer />
    </>,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify-account",
    element: <VerifyAccount />,
  },
  {
    path: "/verify/:token",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgetPassword />,
  },
  {
    path: "/verify-otp/:email",
    element: <VerifyOTP />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;