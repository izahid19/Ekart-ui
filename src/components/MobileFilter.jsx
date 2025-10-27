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

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex">
      <div className="bg-white w-[80%] max-w-[320px] p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        {/* Category */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Category</h3>
          <div className="flex flex-col gap-2">
            {UniqueCategory.map((cat, i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="mt-5">
          <h3 className="font-semibold text-lg mb-2">Brand</h3>
          <select
            className="w-full p-2 border rounded-md"
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
        <div className="mt-5">
          <h3 className="font-semibold text-lg mb-2">Price Range</h3>
          <label>
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="w-20 border rounded p-1"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-20 border rounded p-1"
            />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-pink-600 text-white py-2 rounded-md"
        >
          Apply Filters
        </button>
      </div>

      {/* Background overlay click */}
      <div
        className="flex-1"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default MobileFilter;
