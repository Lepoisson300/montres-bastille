export default function RegionCarousel() {
    return (
        <div
  id="indicators"
  data-carousel='{ "loadingClasses": "opacity-0", "dotsItemClasses": "carousel-dot carousel-active:bg-primary" }'
  className="relative w-full"
>
  <div className="carousel h-80">
    <div className="carousel-body h-full opacity-0">
      <div className="carousel-slide">
        <div className="bg-base-200/60 flex h-full justify-center p-6">
          <span className="self-center text-2xl sm:text-4xl">First slide</span>
        </div>
      </div>
      <div className="carousel-slide">
        <div className="bg-base-200/80 flex h-full justify-center p-6">
          <span className="self-center text-2xl sm:text-4xl">Second slide</span>
        </div>
      </div>
      <div className ="carousel-slide">
        <div className="bg-base-200 flex h-full justify-center p-6">
          <span className="self-center text-2xl sm:text-4xl">Third slide</span>
        </div>
      </div>
    </div>
  </div>
  <div className="carousel-pagination absolute bottom-3 end-0 start-0 flex justify-center gap-3"></div>
</div>
    )
}