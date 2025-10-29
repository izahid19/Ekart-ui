import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from 'react-router-dom'

const Breadcrums = ({ product }) => {
  return (
    <div className="overflow-x-auto">
      <Breadcrumb>
        <BreadcrumbList className="flex flex-wrap text-sm sm:text-base font-semibold text-gray-700">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/products">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p className="truncate max-w-[150px] sm:max-w-[350px] overflow-hidden text-ellipsis whitespace-nowrap">
              {product?.productName || "Product"}
            </p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default Breadcrums
