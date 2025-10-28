import React, { useState, useRef } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductImg = ({ images }) => {
  const [mainImg, setMainImg] = useState(images[0]?.url);
  const sliderRef = useRef(null); // 👈 reference to slider

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false, // ✅ no auto-slide
    pauseOnHover: true,
    beforeChange: (current, next) => setMainImg(images[next]?.url),
  };

  const handleThumbnailClick = (index, imgUrl) => {
    setMainImg(imgUrl);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index); // 👈 move to the correct slide
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* ✅ Desktop view (with thumbnails on side) */}
      <div className="hidden md:flex gap-6 justify-center items-center w-full">
        {/* Thumbnails */}
        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pr-2">
          {images.map((img, i) => (
            <img
              key={i}
              onClick={() => handleThumbnailClick(i, img.url)}
              src={img.url}
              alt={`thumb-${i}`}
              className={`cursor-pointer w-16 h-16 border rounded-md object-cover shadow-sm transition-all duration-200 ${
                mainImg === img.url
                  ? "ring-2 ring-pink-600 scale-105"
                  : "hover:scale-105"
              }`}
            />
          ))}
        </div>

        {/* Main Image */}
        <div className="flex justify-center items-center">
          <Zoom>
            <img
              src={mainImg}
              alt="main product"
              className="w-[400px] lg:w-[480px] border shadow-lg rounded-md object-contain max-h-[500px]"
            />
          </Zoom>
        </div>
      </div>

      {/* ✅ Mobile & Tablet view (swipe + thumbnails below) */}
      <div className="block md:hidden w-full flex flex-col items-center">
        {/* Thumbnails below */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={`thumb-${i}`}
              onClick={() => handleThumbnailClick(i, img.url)} // 👈 synced with slider
              className={`w-14 h-14 border rounded-md object-cover shadow-sm cursor-pointer transition-all duration-200 ${
                mainImg === img.url
                  ? "ring-2 ring-pink-600 scale-110"
                  : "hover:scale-105"
              }`}
            />
          ))}
        </div>
        {/* Swipeable main images */}
        <div className="w-full max-w-[360px] flex justify-center mt-4 mb-4">
          <Slider ref={sliderRef} {...sliderSettings} className="w-full">
            {images.map((img, i) => (
              <div key={i} className="flex justify-center">
                <Zoom>
                  <img
                    src={img.url}
                    alt={`product-${i}`}
                    className="w-[300px] h-[300px] object-contain border shadow-md rounded-md mx-auto"
                  />
                </Zoom>
              </div>
            ))}
          </Slider>
        </div>

      </div>
    </div>
  );
};

export default ProductImg;
