import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images }) => {
  const [mainImg, setMainImg] = useState(images[0].url)

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
      <div className="flex sm:flex-col gap-3">
        {images.map((img, i) => (
          <img
            key={i}
            onClick={() => setMainImg(img.url)}
            src={img.url}
            alt=""
            className="cursor-pointer w-16 h-16 sm:w-20 sm:h-20 border shadow-md object-cover rounded-md hover:scale-105 transition"
          />
        ))}
      </div>

      <Zoom>
        <img
          src={mainImg}
          alt=""
          className="w-[280px] sm:w-[400px] md:w-[500px] border shadow-lg rounded-md object-contain"
        />
      </Zoom>
    </div>
  )
}

export default ProductImg
