// components/Carousel.js
"use client";

import { useState, forwardRef, useImperativeHandle, useEffect } from "react";

const Carousel = forwardRef(({
  images,
  showControls = true,
  activeIndex = 0,
  onSlideChange,
}, ref) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);

  useImperativeHandle(ref, () => ({
    goToSlide: (index) => {
      setCurrentIndex(index);
      if (onSlideChange) onSlideChange(index);
    }
  }));

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    if (onSlideChange) onSlideChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    if (onSlideChange) onSlideChange(newIndex);
  };

  // Sync with external activeIndex changes
  useEffect(() => {
    setCurrentIndex(activeIndex);
  }, [activeIndex]);

  return (
    <div className="relative w-full" data-carousel="static">
      {/* Carousel wrapper */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-200 ease-linear ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            data-carousel-item={index === currentIndex ? "active" : undefined}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            />
          </div>
        ))}
      </div>

      {/* Slider controls */}
      {showControls && images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={goToPrevious}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/30 group-hover:bg-gray-800/50 group-focus:ring-4 group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={goToNext}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/30 group-hover:bg-gray-800/50 group-focus:ring-4 group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </>
      )}

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-gray-800" : "bg-gray-800/50"
              }`}
              aria-current={index === currentIndex}
              aria-label={`Slide ${index + 1}`}
              onClick={() => {
                setCurrentIndex(index);
                if (onSlideChange) onSlideChange(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

Carousel.displayName = 'Carousel';

export default Carousel;