  // Carousel navigation (Updated to use availableRegions length)
  export const goToNext = () => {
    setCarouselIndex((prev) => (prev + 1) % availableRegions.length);
  };

  export const goToPrev = () => {
    setCarouselIndex((prev) => (prev - 1 + availableRegions.length) % availableRegions.length);
  };