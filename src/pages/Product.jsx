import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@/utils/config";
import { setProducts } from "@/redux/productSlice";
import FilterSidebar from "@/components/FilterSidebar";
import MobileFilter from "@/components/MobileFilter";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SlidersHorizontal } from "lucide-react";

const Product = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);

  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limitPerPage: 10,
  });

  // ✅ Fetch paginated products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/product/all-products?page=${pagination.currentPage}&limit=${pagination.limitPerPage}`
      );

      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
        setPagination((prev) => ({
          ...prev,
          totalPages: res.data.totalPages,
        }));
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  // ✅ Filter & Sort
  useEffect(() => {
    let filtered = [...allProducts];

    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    filtered = filtered.filter(
      (p) =>
        p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
    );

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

  return (
    <div className="pt-20 pb-20 px-3 sm:px-6 md:px-8 flex flex-col min-h-screen">
      {/* ✅ Mobile Filter Button */}
      <div className="flex justify-between items-center mb-4 md:hidden">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilter(true)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>

        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lowToHigh">Low → High</SelectItem>
            <SelectItem value="highToLow">High → Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Main Layout */}
      <div className="flex flex-col md:flex-row gap-6 flex-grow">
        {/* Desktop Sidebar */}
        <div className="w-full md:w-1/4">
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            brand={brand}
            setBrand={setBrand}
            category={category}
            setCategory={setCategory}
            allProducts={allProducts}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>

        {/* Product Section */}
        <div className="flex flex-col flex-1">
          {/* Sort Section (Desktop Only) */}
          <div className="hidden md:flex justify-end mb-4">
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                <SelectItem value="highToLow">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {loading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse shadow rounded-lg overflow-hidden bg-white"
                  >
                    <div className="w-full aspect-square bg-gray-200" />
                    <div className="px-3 py-2 space-y-2">
                      <div className="w-3/4 h-4 bg-gray-200 rounded" />
                      <div className="w-1/2 h-4 bg-gray-200 rounded" />
                      <div className="w-2/3 h-8 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))
              : products.length > 0
              ? products.map((product, index) => (
                  <ProductCard key={index} product={product} loading={loading} />
                ))
              : !loading && (
                  <p className="text-center col-span-full text-gray-500">
                    No products found
                  </p>
                )}
          </div>
        </div>
      </div>

      {/* ✅ Pagination */}
      {products.length >= 10 && (
        <div className="mt-10 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: Math.max(prev.currentPage - 1, 1),
                    }))
                  }
                  className={
                    pagination.currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={pagination.currentPage === page}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: page,
                        }))
                      }
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: Math.min(
                        prev.currentPage + 1,
                        prev.totalPages
                      ),
                    }))
                  }
                  className={
                    pagination.currentPage === pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ✅ Mobile Filter Drawer */}
      <MobileFilter
        open={showMobileFilter}
        onClose={() => setShowMobileFilter(false)}
        search={search}
        setSearch={setSearch}
        brand={brand}
        setBrand={setBrand}
        category={category}
        setCategory={setCategory}
        allProducts={allProducts}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />
    </div>
  );
};

export default Product;
