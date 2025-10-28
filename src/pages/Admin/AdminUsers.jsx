import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Edit, Eye, Search, Loader2 } from 'lucide-react';
import UserLogo from '../../assets/user_image.png';
import { BASE_URL } from '@/utils/config';
import { Card, CardContent } from '@/components/ui/card';

const AdminUsers = () => {
  const [users, setUsers] = useState([]); // ✅ default = []
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/all-users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data.success && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        setUsers([]); // fallback if API returns something unexpected
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // prevent undefined
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // ✅ Memoized + safe filtering
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter((user) => {
      const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.toLowerCase();
      const email = user?.email?.toLowerCase() ?? '';
      const term = searchTerm.toLowerCase();
      return fullName.includes(term) || email.includes(term);
    });
  }, [users, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 lg:pl-[350px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-pink-600" />
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-4 sm:px-6 lg:pl-[350px] lg:pr-20">
      <div className="max-w-7xl mx-auto lg:mx-0">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="font-bold text-2xl sm:text-3xl text-gray-800">User Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage registered users</p>
        </div>

        {/* Search Bar */}
        <div className="flex relative w-full sm:w-[350px] mb-6">
          <Search className="absolute left-3 top-2.5 text-gray-600 w-5 h-5" />
          <Input
            className="pl-10 bg-white"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No users found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredUsers.map((user) => (
              <Card
                key={user._id}
                className="bg-pink-50 border-pink-200 hover:shadow-lg transition"
              >
                <CardContent className="p-4 sm:p-5">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={user?.profilePic || UserLogo}
                      alt={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
                      className="rounded-full w-14 h-14 sm:w-16 sm:h-16 object-cover border-2 border-pink-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h1 className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                        {user?.firstName} {user?.lastName}
                      </h1>
                      <h3 className="text-xs sm:text-sm text-gray-600 truncate">
                        {user?.email}
                      </h3>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                      variant="outline"
                      className="w-full sm:flex-1 text-sm"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)}
                      className="w-full sm:flex-1 bg-pink-600 hover:bg-pink-700 text-sm"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      Orders
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
