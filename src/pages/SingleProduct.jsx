import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {
  const params = useParams()
  const productId = params.id
  const { products } = useSelector(store => store.product)
  const product = products.find((item) => item._id === productId)

  return (
    <div className="pt-20 pb-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <Breadcrums product={product} />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <ProductImg images={product.productImg} />
        <ProductDesc product={product} />
      </div>
    </div>
  )
}

export default SingleProduct
