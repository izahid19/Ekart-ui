import React from "react";
import { X } from "lucide-react";

const MobileFilter = ({
  open,
  onClose,
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
  if (!open) return null;

  const Categories = allProducts.map((p) => p.category);
  const UniqueCategory = ["All", ...new Set(Categories)];

  const Brands = allProducts.map((p) => p.brand);
  const UniqueBrand = ["All", ...new Set(Brands)];

  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 999999]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex transition-all duration-300">
      {/* Sidebar Drawer */}
      <div className="bg-white w-[85%] max-w-[360px] h-full p-5 rounded-r-2xl shadow-2xl overflow-y-auto animate-slideIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-800">
            Category
          </h3>
          <div className="flex flex-col gap-2">
            {UniqueCategory.map((cat, i) => (
              <label
                key={i}
                className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${
                  category === cat ? "text-pink-600" : "text-gray-700"
                } hover:text-pink-600`}
              >
                <input
                  type="radio"
                  name="category"
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                  className="accent-pink-600"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-800">Brand</h3>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-500"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            {UniqueBrand.map((b, i) => (
              <option key={i} value={b}>
                {b.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-3 text-gray-800">
            Price Range
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            ₹{priceRange[0].toLocaleString()} - ₹
            {priceRange[1].toLocaleString()}
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="w-24 border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-pink-500"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-24 border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>₹0</span>
            <span>₹999,999</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onClose}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-medium transition"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="w-full border border-pink-600 text-pink-600 py-2 rounded-lg font-medium hover:bg-pink-50 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Background overlay click */}
      <div className="flex-1" onClick={onClose}></div>
    </div>
  );
};

export default MobileFilter;
