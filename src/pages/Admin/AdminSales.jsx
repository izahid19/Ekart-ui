import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BASE_URL } from "@/utils/config";
import { Users, Package, ShoppingBag, DollarSign, Loader2 } from "lucide-react";

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(
        BASE_URL + "/orders/sales",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 lg:pl-[350px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-pink-600" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-4 sm:px-6 lg:pl-[350px] lg:pr-20">
      <div className="max-w-7xl mx-auto lg:mx-0">
        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {/* Total Users Card */}
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg hover:shadow-xl transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-medium">Total Users</CardTitle>
                <Users className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>

          {/* Total Products Card */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-medium">Total Products</CardTitle>
                <Package className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold">{stats.totalProducts}</p>
            </CardContent>
          </Card>

          {/* Total Orders Card */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-medium">Total Orders</CardTitle>
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold">{stats.totalOrders}</p>
            </CardContent>
          </Card>

          {/* Total Sales Card */}
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-medium">Total Sales</CardTitle>
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold">
                ₹{stats.totalSales.toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Sales Overview (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={stats.sales}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F472B6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F472B6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, 'Sales']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#F472B6" 
                    strokeWidth={2}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSales;