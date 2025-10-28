import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import ImageUpload from '@/components/ImageUpload'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { BASE_URL } from '@/utils/config'

const AddProduct = () => {
    const accessToken = localStorage.getItem('accessToken')
    const { products } = useSelector(store => store.product)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [productData, setProductData] = useState({
        productName: "",
        productPrice: 0,
        productDesc: "",
        productImg: [],
        brand: "",
        category: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("productName", productData.productName);
        formData.append("productPrice", productData.productPrice);
        formData.append("productDesc", productData.productDesc);
        formData.append("category", productData.category);
        formData.append("brand", productData.brand);

        if (productData.productImg.length === 0) {
            toast.error("Please select at least one image.");
            return;
        }

        productData.productImg.forEach((img) => {
            formData.append("file", img); 
        });

        
        try {
            setLoading(true)
            const res = await axios.post(`${BASE_URL}/product/add`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            if (res.data.success) {
                dispatch(setProducts([...products, res.data.product]))
                toast.success(res.data.message)
                navigate('/dashboard/products')
            }
        } catch (error) {
            console.log(error);
        } finally{
            setLoading(false)
        }

    }

    return (
        <div className='min-h-screen bg-gray-100 py-6 sm:py-10 px-4 sm:px-6 lg:pl-[350px] lg:pr-20'>
            <div className='max-w-4xl mx-auto lg:mx-0'>
                {/* Page Title - Mobile */}
                <h1 className='text-2xl font-bold text-gray-800 mb-4 lg:hidden'>Add Product</h1>
                
                <Card className="w-full shadow-sm">
                    <CardHeader className='px-4 sm:px-6'>
                        <CardTitle className='text-xl sm:text-2xl'>Add Product</CardTitle>
                        <CardDescription className='text-sm sm:text-base'>
                            Enter product details below
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='px-4 sm:px-6'>
                        <div className="flex flex-col gap-4 sm:gap-5">
                            <div className="grid gap-2">
                                <Label className='text-sm sm:text-base'>Product Name</Label>
                                <Input
                                    type="text"
                                    name="productName"
                                    value={productData.productName}
                                    onChange={handleChange}
                                    placeholder="Ex: iPhone 15 Pro"
                                    required
                                    className='text-sm sm:text-base'
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className='text-sm sm:text-base'>Price</Label>
                                <Input
                                    type="number"
                                    name="productPrice"
                                    value={productData.productPrice}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    required
                                    className='text-sm sm:text-base'
                                />
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className="grid gap-2">
                                    <Label className='text-sm sm:text-base'>Brand</Label>
                                    <Input
                                        type="text"
                                        name="brand"
                                        value={productData.brand}
                                        onChange={handleChange}
                                        placeholder="Ex: Apple"
                                        required
                                        className='text-sm sm:text-base'
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className='text-sm sm:text-base'>Category</Label>
                                    <Input
                                        type="text"
                                        name="category"
                                        value={productData.category}
                                        onChange={handleChange}
                                        placeholder="Ex: Mobile"
                                        required
                                        className='text-sm sm:text-base'
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label className='text-sm sm:text-base'>Description</Label>
                                </div>
                                <Textarea
                                    name="productDesc"
                                    value={productData.productDesc}
                                    onChange={handleChange}
                                    placeholder="Enter brief description of product"
                                    className='min-h-[100px] sm:min-h-[120px] text-sm sm:text-base'
                                />
                            </div>
                            <ImageUpload productData={productData} setProductData={setProductData}/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 px-4 sm:px-6">
                        <Button 
                            disabled={loading} 
                            onClick={submitHandler} 
                            type="submit" 
                            className="w-full bg-pink-600 hover:bg-pink-700 text-sm sm:text-base h-10 sm:h-11"
                        >
                            {
                                loading ? (
                                    <span className='flex gap-2 items-center'>
                                        <Loader2 className='animate-spin w-4 h-4 sm:w-5 sm:h-5'/>
                                        Please Wait
                                    </span>
                                ) : 'Add Product'
                            }
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default AddProduct