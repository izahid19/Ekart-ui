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
import ContactUs from './pages/ContactUs';
import Stepper from './components/Stepper';
import AddressForm from './pages/AddressForm';
import OrderSuccess from './pages/OrderSuccess';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/Admin/AddProduct';
import AdminProduct from './pages/Admin/AdminProduct';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminSales from './pages/Admin/AdminSales';
import AdminUsers from './pages/Admin/AdminUsers';
import UserInfo from './pages/Admin/UserInfo';
import ShowUserOrders from './pages/Admin/ShowUserOrders';
import MyOrder from './pages/MyOrder';



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
    path: "/contact-us",
    element: <>
    <Navbar />
    <ContactUs />
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
    <ProtectedRoute>
    <Navbar />
    <Profile />
    <Footer />
    </ProtectedRoute>
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
  {
    path: "/checkout",
    element: <ProtectedRoute><Navbar /><Stepper /></ProtectedRoute>
  },
  {
    path: '/address',
    element: <ProtectedRoute><AddressForm /></ProtectedRoute>
  },
  {
    path: '/order-success',
    element: <ProtectedRoute><OrderSuccess /></ProtectedRoute>
  },
  {
    path: '/orders',
    element: <ProtectedRoute><MyOrder /></ProtectedRoute>
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute adminOnly={true}><Navbar /><Dashboard /></ProtectedRoute>,
    children: [
      {
        path: "sales",
        element: <><AdminSales/></>
      },
      {
        path: "add-product",
        element: <><AddProduct /></>
      },
      {
        path: "products",
        element: <><AdminProduct /></>
      },
      {
        path: "orders",
        element: <><AdminOrders /></>
      },
      {
        path: "users/orders/:userId",
        element: <><ShowUserOrders /></>
      },
      {
        path: "users",
        element: <><AdminUsers /></>
      },
      {
        path: "users/:id",
        element: <><UserInfo /></>
      },   
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;