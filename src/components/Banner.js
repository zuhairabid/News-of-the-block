import React from "react"
import BannerCarousel from "./Carousel"

const Banner = () => {
   return (
      <div className="banner ">
         <div className="font-mons h-[400px] flex flex-col pt-3 items-center justify-center">
            <h2 className="font-bold  text-3xl uppercase ">
               News Of The Block
            </h2>
            <p className="uppercase text-[8px]">
               Get All The Info Regarding Your Favorite Crypto Currency
            </p>

            <BannerCarousel />
         </div>
      </div>
   )
}

export default Banner
