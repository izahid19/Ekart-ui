import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userLogo from '..//../assets/user_image.png'
import { toast } from 'sonner'
import { setUser } from '@/redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Loader2 } from 'lucide-react'
import { BASE_URL } from '@/utils/config'

const UserInfo = () => {
    const [userDetails, setUserDetails] = useState(null)
    const [updateUser, setUpdateUser] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.user);
    const params = useParams()
    const userId = params.id
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) }); // preview only
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const accessToken = localStorage.getItem("accessToken");

        try {
            // Use FormData for text + file
            const formData = new FormData();
            formData.append("firstName", updateUser.firstName);
            formData.append("lastName", updateUser.lastName);
            formData.append("email", updateUser.email);
            formData.append("phoneNo", updateUser.phoneNo);
            formData.append("address", updateUser.address);
            formData.append("city", updateUser.city);
            formData.append("zipCode", updateUser.zipCode);
            formData.append("role", updateUser.role);

            if (file) {
                formData.append("file", file); // image file for backend multer
            }

            const res = await axios.put(
                `${BASE_URL}/user/update/${userId}`,
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
                // Only update store if user is editing their own profile
                const loggedInUserId = user?._id; // get from Redux
                if (userId === loggedInUserId) {
                    dispatch(setUser(res.data.user));

                    // Step 2: Redirect if role changed
                    if (res.data.user.role !== "admin") {
                        navigate("/"); // Go to home if role changed from admin
                    }
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const getUserDetails = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/user/get-user/${userId}`)
            if (res.data.success) {
                setUserDetails(res.data.user)
                setUpdateUser(res.data.user)  // ✅ set form values after fetch
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUserDetails()
    }, [])

    // Wait until data is loaded
    if (!updateUser) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-pink-600" />
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-4xl mx-auto'>
                {/* Header with Back Button */}
                <div className='flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8'>
                    <Button 
                        onClick={() => navigate(-1)} 
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className='font-bold text-xl sm:text-2xl lg:text-3xl text-gray-800'>
                        Update Profile
                    </h1>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center mb-6 sm:mb-8">
                            <img
                                src={updateUser?.profilePic || userLogo}
                                alt="Profile"
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-pink-600"
                            />
                            <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg hover:bg-pink-700 transition text-sm sm:text-base">
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
                        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                            {/* First Name & Last Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="block text-sm font-medium mb-1.5">First Name</Label>
                                    <Input
                                        type="text"
                                        name="firstName"
                                        value={updateUser?.firstName}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium mb-1.5">Last Name</Label>
                                    <Input
                                        type="text"
                                        name="lastName"
                                        value={updateUser?.lastName}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <Label className="block text-sm font-medium mb-1.5">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={updateUser?.email}
                                    disabled
                                    className="w-full bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <Label className="block text-sm font-medium mb-1.5">Phone Number</Label>
                                <Input
                                    type="text"
                                    name="phoneNo"
                                    value={updateUser?.phoneNo}
                                    onChange={handleChange}
                                    className="w-full"
                                    placeholder="+91 1234567890"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <Label className="block text-sm font-medium mb-1.5">Address</Label>
                                <Input
                                    type="text"
                                    name="address"
                                    value={updateUser?.address}
                                    onChange={handleChange}
                                    className="w-full"
                                    placeholder="Street address"
                                />
                            </div>

                            {/* City & Zip Code */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="block text-sm font-medium mb-1.5">City</Label>
                                    <Input
                                        type="text"
                                        name="city"
                                        value={updateUser?.city}
                                        onChange={handleChange}
                                        className="w-full"
                                        placeholder="City name"
                                    />
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium mb-1.5">Zip Code</Label>
                                    <Input
                                        type="text"
                                        name="zipCode"
                                        value={updateUser?.zipCode}
                                        onChange={handleChange}
                                        className="w-full"
                                        placeholder="123456"
                                    />
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className='space-y-2'>
                                <Label className="block text-sm font-medium">Role</Label>
                                <RadioGroup
                                    value={updateUser?.role}
                                    onValueChange={(value) => setUpdateUser({ ...updateUser, role: value })}
                                    className='flex flex-col sm:flex-row gap-3 sm:gap-6'
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="user" id="user" />
                                        <Label htmlFor="user" className="cursor-pointer">User</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="admin" id="admin" />
                                        <Label htmlFor="admin" className="cursor-pointer">Admin</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base"
                            >
                                {loading ? (
                                    <span className='flex items-center justify-center gap-2'>
                                        <Loader2 className='animate-spin w-4 h-4 sm:w-5 sm:h-5' />
                                        Updating...
                                    </span>
                                ) : (
                                    'Update Profile'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default UserInfo