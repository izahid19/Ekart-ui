import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import { Edit, Search, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ImageUpload'
import { BASE_URL } from '@/utils/config'


const AdminProduct = () => {
  const { products } = useSelector(store => store.product)
  const [sortOrder, setSortOrder] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [editProduct, setEditProduct] = useState(null)
  const [open, setOpen] = useState(false)
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

  let filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.productPrice - b.productPrice)
  }
  if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.productPrice - a.productPrice)
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setEditProduct(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("productName", editProduct.productName);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("category", editProduct.category);
    formData.append("brand", editProduct.brand);

    // ✅ Add existing images' public_ids (only remaining ones in state)
    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));


    // ✅ Add new files
    editProduct.productImg
      .filter((img) => img instanceof File) // only new uploaded files
      .forEach((file) => {
        formData.append("files", file);
      });

    try {
      const res = await axios.put(
        `${BASE_URL}/product/update/${editProduct._id}`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        setOpen(false)
        // update redux state
        const updatedProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p
        );
        dispatch(setProducts(updatedProducts));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);

    }
  };

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter((product) => product._id !== productId)
      const res = await axios.delete(`${BASE_URL}/product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setProducts(remainingProducts))

      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 py-6 sm:py-10 px-4 sm:px-6 lg:pl-[350px] lg:pr-20'>
      <div className='max-w-7xl mx-auto lg:mx-0'>
        {/* Page Title - Mobile */}
        <h1 className='text-2xl font-bold text-gray-800 mb-4 lg:hidden'>Products</h1>

        {/* Search and Sort Controls */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6'>
          <div className='relative flex-1'>
            <Input 
              type="text"
              placeholder="Search Product..."
              className="w-full bg-white pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <Search className='absolute right-3 top-2.5 text-gray-500 w-5 h-5' />
          </div>

          <Select onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white">
              <SelectValue placeholder="Sort by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products List */}
        <div className='flex flex-col gap-3 sm:gap-4'>
          {filteredProducts.length === 0 ? (
            <Card className='p-8 text-center'>
              <p className='text-gray-500'>No products found</p>
            </Card>
          ) : (
            filteredProducts.map((product, index) => {
              return <Card key={index} className='p-4 shadow-sm hover:shadow-md transition'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                  {/* Product Info */}
                  <div className='flex gap-3 sm:gap-4 items-start sm:items-center flex-1 min-w-0'>
                    <img 
                      src={product.productImg[0]?.url} 
                      alt={product.productName} 
                      className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded flex-shrink-0' 
                    />
                    <div className='flex-1 min-w-0'>
                      <h1 className='font-bold text-sm sm:text-base text-gray-700 line-clamp-2 mb-1'>
                        {product.productName}
                      </h1>
                      <p className='text-xs sm:text-sm text-gray-500'>
                        {product.brand} • {product.category}
                      </p>
                      {/* Mobile Price */}
                      <p className='font-semibold text-pink-600 mt-2 sm:hidden text-lg'>
                        ₹{product.productPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Price and Actions */}
                  <div className='hidden sm:flex items-center gap-6'>
                    <h1 className='font-semibold text-gray-800 text-lg min-w-[100px] text-right'>
                      ₹{product.productPrice.toLocaleString('en-IN')}
                    </h1>
                    <div className='flex gap-3'>
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => {setOpen(true); setEditProduct(product)}}
                            className='p-2 hover:bg-green-50 rounded-lg transition'
                          >
                            <Edit className='text-green-500 cursor-pointer w-5 h-5' />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-[625px] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className='text-lg sm:text-xl'>Edit Product</DialogTitle>
                            <DialogDescription className='text-sm'>
                              Make changes to your product here. Click save when you&apos;re done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="grid gap-2">
                              <Label className='text-sm'>Product Name</Label>
                              <Input
                                type="text"
                                name="productName"
                                value={editProduct?.productName}
                                onChange={handleChange}
                                placeholder="Ex: iPhone"
                                required
                                className='text-sm'
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label className='text-sm'>Price</Label>
                              <Input
                                type="number"
                                name="productPrice"
                                value={editProduct?.productPrice}
                                onChange={handleChange}
                                placeholder="Enter price"
                                required
                                className='text-sm'
                              />
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                              <div className="grid gap-2">
                                <Label className='text-sm'>Brand</Label>
                                <Input
                                  type="text"
                                  name="brand"
                                  value={editProduct?.brand}
                                  onChange={handleChange}
                                  placeholder="Ex: Apple"
                                  required
                                  className='text-sm'
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label className='text-sm'>Category</Label>
                                <Input
                                  type="text"
                                  name="category"
                                  value={editProduct?.category}
                                  onChange={handleChange}
                                  placeholder="Ex: Mobile"
                                  required
                                  className='text-sm'
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label className='text-sm'>Description</Label>
                              <Textarea
                                name="productDesc"
                                value={editProduct?.productDesc}
                                onChange={handleChange}
                                placeholder="Enter brief description of product"
                                className='min-h-[80px] text-sm'
                              />
                            </div>
                            <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                          </div>
                          <DialogFooter className='flex-col-reverse sm:flex-row gap-2'>
                            <DialogClose asChild>
                              <Button variant="outline" className='w-full sm:w-auto'>Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleSave} type="submit" className='w-full sm:w-auto bg-pink-600'>
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className='p-2 hover:bg-red-50 rounded-lg transition'>
                            <Trash2 className='text-red-500 cursor-pointer w-5 h-5' />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='w-[95vw] max-w-md'>
                          <AlertDialogHeader>
                            <AlertDialogTitle className='text-lg'>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription className='text-sm'>
                              Are you sure you want to delete this product? This action cannot be undone and will permanently remove the product from your store.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className='flex-col-reverse sm:flex-row gap-2'>
                            <AlertDialogAction 
                              onClick={() => deleteProductHandler(product._id)}
                              className='w-full sm:w-auto bg-red-600 hover:bg-red-700'
                            >
                              Yes, Delete
                            </AlertDialogAction>
                            <AlertDialogCancel className='w-full sm:w-auto mt-0'>No, Cancel</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className='flex sm:hidden gap-3 justify-end'>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => {setOpen(true); setEditProduct(product)}}
                          className='p-2.5 hover:bg-green-50 rounded-lg transition flex items-center gap-2'
                        >
                          <Edit className='text-green-500 w-5 h-5' />
                          <span className='text-sm font-medium text-green-600'>Edit</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="w-[95vw] max-w-[625px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className='text-lg sm:text-xl'>Edit Product</DialogTitle>
                          <DialogDescription className='text-sm'>
                            Make changes to your product here. Click save when you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 sm:gap-4">
                          <div className="grid gap-2">
                            <Label className='text-sm'>Product Name</Label>
                            <Input
                              type="text"
                              name="productName"
                              value={editProduct?.productName}
                              onChange={handleChange}
                              placeholder="Ex: iPhone"
                              required
                              className='text-sm'
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label className='text-sm'>Price</Label>
                            <Input
                              type="number"
                              name="productPrice"
                              value={editProduct?.productPrice}
                              onChange={handleChange}
                              placeholder="Enter price"
                              required
                              className='text-sm'
                            />
                          </div>
                          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                            <div className="grid gap-2">
                              <Label className='text-sm'>Brand</Label>
                              <Input
                                type="text"
                                name="brand"
                                value={editProduct?.brand}
                                onChange={handleChange}
                                placeholder="Ex: Apple"
                                required
                                className='text-sm'
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label className='text-sm'>Category</Label>
                              <Input
                                type="text"
                                name="category"
                                value={editProduct?.category}
                                onChange={handleChange}
                                placeholder="Ex: Mobile"
                                required
                                className='text-sm'
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label className='text-sm'>Description</Label>
                            <Textarea
                              name="productDesc"
                              value={editProduct?.productDesc}
                              onChange={handleChange}
                              placeholder="Enter brief description of product"
                              className='min-h-[80px] text-sm'
                            />
                          </div>
                          <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                        </div>
                        <DialogFooter className='flex-col-reverse sm:flex-row gap-2'>
                          <DialogClose asChild>
                            <Button variant="outline" className='w-full sm:w-auto'>Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleSave} type="submit" className='w-full sm:w-auto bg-pink-600'>
                            Save changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className='p-2.5 hover:bg-red-50 rounded-lg transition flex items-center gap-2'>
                          <Trash2 className='text-red-500 w-5 h-5' />
                          <span className='text-sm font-medium text-red-600'>Delete</span>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='w-[95vw] max-w-md'>
                        <AlertDialogHeader>
                          <AlertDialogTitle className='text-lg'>Delete Product?</AlertDialogTitle>
                          <AlertDialogDescription className='text-sm'>
                            Are you sure you want to delete this product? This action cannot be undone and will permanently remove the product from your store.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className='flex-col-reverse sm:flex-row gap-2'>
                          <AlertDialogAction 
                            onClick={() => deleteProductHandler(product._id)}
                            className='w-full sm:w-auto bg-red-600 hover:bg-red-700'
                          >
                            Yes, Delete
                          </AlertDialogAction>
                          <AlertDialogCancel className='w-full sm:w-auto mt-0'>No, Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminProduct