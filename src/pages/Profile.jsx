import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setUser } from "@/redux/userSlice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import userLogo from "../assets/user_image.png";
import MyOrder from "./MyOrder";
import { BASE_URL } from "@/utils/config";

const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.userId;

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();
      Object.keys(updateUser).forEach((key) => {
        if (key !== "profilePic") formData.append(key, updateUser[key]);
      });
      if (file) formData.append("file", file);

      const res = await axios.put(
        `${BASE_URL}/user/update-user/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.data));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-100">
      <Tabs
        defaultValue="profile"
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8"
      >
        {/* Tabs Header */}
        <TabsList className="flex flex-wrap justify-center gap-2 bg-white rounded-lg shadow-sm p-1">
          <TabsTrigger
            value="profile"
            className="px-4 py-2 data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-md transition"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="px-4 py-2 data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-md transition"
          >
            Orders
          </TabsTrigger>
        </TabsList>

        {/* ✅ Profile Section */}
        <TabsContent value="profile">
          <div className="flex flex-col items-center mt-8">
            <h1 className="font-bold mb-7 text-2xl text-gray-800 text-center">
              Update Profile
            </h1>

            <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-10 items-center lg:items-start justify-center bg-white shadow-md p-6 rounded-lg">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center w-full sm:w-auto">
                <img
                  src={updateUser?.profilePic || userLogo}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-pink-800"
                />
                <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-sm sm:text-base">
                  Change Picture
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>

              {/* Profile Form */}
              <form
                className="space-y-4 w-full max-w-md"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium">First Name</Label>
                    <Input
                      type="text"
                      name="firstName"
                      value={updateUser.firstName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Last Name</Label>
                    <Input
                      type="text"
                      name="lastName"
                      value={updateUser.lastName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={updateUser.email}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium">Phone Number</Label>
                  <Input
                    type="text"
                    name="phoneNo"
                    placeholder="Enter Your Contact Number"
                    value={updateUser.phoneNo}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium">Address</Label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Enter Your Address"
                    value={updateUser.address}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium">City</Label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="Enter Your City"
                      value={updateUser.city}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Zip Code</Label>
                    <Input
                      type="text"
                      name="zipCode"
                      placeholder="Enter Your Zip Code"
                      value={updateUser.zipCode}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg"
                >
                  Update Profile
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>

        {/* ✅ Orders Section */}
        <TabsContent value="orders" className="mt-8">
          <MyOrder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
