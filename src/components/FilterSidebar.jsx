import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const FilterSidebar = ({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  priceRange,
  setPriceRange,
  allProducts,
}) => {
  const Categories = allProducts.map((p) => p.category);
  const UniqueCategory = ["All", ...new Set(Categories)];

  const Brands = allProducts.map((p) => p.brand);
  const UniqueBrand = ["All", ...new Set(Brands)];

  const handleCategoryClick = (cat) => setCategory(cat);
  const handleBrandChange = (value) => setBrand(value);
  const handlePriceChange = (value) => setPriceRange(value);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 999999]);
  };

  return (
    <div className="bg-white mt-10 p-6 rounded-2xl h-max hidden md:block w-full shadow-lg border border-gray-200 transition-all duration-300">
      <ScrollArea className="h-[80vh] pr-4">
        {/* Search */}
        <div>
          <h2 className="font-semibold text-lg mb-2 text-gray-800">Search</h2>
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <Separator className="my-5" />

        {/* Category */}
        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-800">
            Category
          </h2>
          <div className="space-y-2">
            {UniqueCategory.map((item, index) => (
              <label
                key={index}
                className={`flex items-center gap-2 cursor-pointer text-sm font-medium ${
                  category === item ? "text-pink-600" : "text-gray-700"
                } hover:text-pink-600 transition-colors`}
              >
                <input
                  type="radio"
                  name="category"
                  checked={category === item}
                  onChange={() => handleCategoryClick(item)}
                  className="accent-pink-600"
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <Separator className="my-5" />

        {/* Brand */}
        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-800">Brand</h2>
          <Select value={brand} onValueChange={handleBrandChange}>
            <SelectTrigger className="w-full focus:ring-2 focus:ring-pink-500">
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              {UniqueBrand.map((item, index) => (
                <SelectItem key={index} value={item}>
                  {item.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-5" />

        {/* Price Range */}
        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-800">
            Price Range
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            ₹{priceRange[0].toLocaleString()} - ₹
            {priceRange[1].toLocaleString()}
          </p>
          <Slider
            min={0}
            max={999999}
            step={1000}
            value={priceRange}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between mt-3 text-sm text-gray-500">
            <span>₹0</span>
            <span>₹999,999</span>
          </div>
        </div>

        <Separator className="my-5" />

        {/* Reset Button */}
        <Button
          onClick={resetFilters}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold"
        >
          Reset Filters
        </Button>
      </ScrollArea>
    </div>
  );
};

export default FilterSidebar;
