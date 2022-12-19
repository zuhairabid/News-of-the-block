import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { SingleCoin } from "../config/api"
import { CryptoState } from "../CryptoContext"
import ReactHtmlParser from "react-html-parser"
import Coininfo from "./Coininfo"
import { numberWithCommas } from "../config/numberWithCommas"

export const CoinPage = () => {
   const { id } = useParams()
   const [coin, setCoin] = useState()
   const { currency, symbol } = CryptoState()

   const fetchCoin = async () => {
      const { data } = await axios.get(SingleCoin(id))
      setCoin(data)
   }
   useEffect(() => {
      fetchCoin()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   if (!coin) {
      return (
         <div class="linear-activity">
            <div class="indeterminate"></div>
         </div>
      )
   }

   return (
      <div className="px-2 lg:flex lg:items-center ">
         <div className="   ">
            <div className=" text-center flex flex-col items-center lg:px-5 lg:mr-3 lg:border-r border-gray-400">
               <img className="w-[100px]" src={coin.image.large} alt="" />
               <p className="text-3xl font-bold mb-2">{coin.name}</p>
               <p className="mb-3">
                  {ReactHtmlParser(coin?.description.en.split(". ")[0])}
               </p>
               <div className="text-lg font-bold">
                  <p>
                     Rank:{" "}
                     <span className="font-[400]">{coin.market_cap_rank}</span>
                  </p>

                  <p>
                     Current Price:{" "}
                     <span className="font-[400]">
                        {symbol}{" "}
                        {coin.market_data.current_price[currency.toLowerCase()]}
                     </span>
                  </p>

                  <p>
                     Market Cap:{" "}
                     <span className="font-[400]">
                        {symbol}{" "}
                        {numberWithCommas(
                           coin.market_data.market_cap[currency.toLowerCase()]
                              .toString()
                              .slice(0, -6)
                        )}
                        M
                     </span>
                  </p>
               </div>
            </div>
         </div>
         {/* Coininfo */}
         <div className="lg:w-[90%] overflow-hidden">
            <Coininfo coin={coin} />
         </div>
      </div>
   )
}
