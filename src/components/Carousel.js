import axios from "axios"
import React, { useEffect, useState } from "react"
import AliceCarousel from "react-alice-carousel"
import { Link } from "react-router-dom"
import { TrendingCoins } from "../config/api"
import { numberWithCommas } from "../config/numberWithCommas"
import { CryptoState } from "../CryptoContext"

const Carousel = () => {
   const handleDragStart = (e) => e.preventDefault()
   const [trending, setTrending] = useState([])
   const { currency, symbol } = CryptoState()
   const fetchTrendingCoins = async () => {
      const { data } = await axios.get(TrendingCoins(currency))
      // console.log(data)
      setTrending(data)
   }
   useEffect(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      fetchTrendingCoins()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currency])

   const items = trending.map((coin) => {
      const growth_percentage = coin.price_change_percentage_24h.toFixed(2)
      return (
         <Link
            className="text-white block align-center text-center w-[100px] mx-auto mt-20"
            to={`/coins/${coin.id}`}
         >
            <img
               className="w-[100px] h-[100px]"
               src={coin.image}
               alt={coin.name}
               onDragStart={handleDragStart}
               role="presentation"
            />
            <span className="text-sm uppercase ">
               {coin.symbol} &nbsp;
               <span
                  className={
                     growth_percentage > 0
                        ? "text-green-500 font-bold"
                        : "text-red-500 font-bold"
                  }
               >
                  {growth_percentage > 0
                     ? `+${growth_percentage}`
                     : `${growth_percentage}`}
                  %
               </span>
            </span>
            <p className="font-bold text-[11px]">{`${symbol} ${numberWithCommas(
               coin.low_24h.toFixed(2)
            )}`}</p>
         </Link>
      )
   })

   const responsive = {
      0: {
         items: 2,
      },
      512: {
         items: 4,
      },
   }
   return (
      <div className="h-[50%] flex items-center w-full">
         <AliceCarousel
            mouseTracking
            infinite
            autoPlayInterval={1000}
            animationDuration={1500}
            disableDotsControls
            disableButtonsControls
            responsive={responsive}
            items={items}
            autoPlay
         />
      </div>
   )
}

export default Carousel
