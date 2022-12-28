import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { SingleCoin } from "../config/api"
import { CryptoState } from "../CryptoContext"
import ReactHtmlParser from "react-html-parser"
import Coininfo from "./Coininfo"
import { numberWithCommas } from "../config/numberWithCommas"
import { doc, setDoc } from "firebase/firestore"
import { db } from "./firebase"

import { useSnackbar } from "react-simple-snackbar"

export const CoinPage = () => {
   const options_success = {
      position: "bottom-center",
      style: {
         zIndex: 3000,
         backgroundColor: "#34A853",
         color: "white",
         fontFamily: "Menlo, monospace",
         fontSize: "20px",
         textAlign: "center",
      },
      closeStyle: {
         color: "white",
         fontSize: "16px",
      },
   }
   const options_error = {
      position: "bottom-center",
      style: {
         zIndex: 3000,
         backgroundColor: "#EA4335",
         color: "white",
         fontFamily: "Menlo, monospace",
         fontSize: "20px",
         textAlign: "center",
      },
      closeStyle: {
         color: "white",
         fontSize: "16px",
      },
   }
   const [openSnackbarSuccess] = useSnackbar(options_success)
   const [openSnackbarError] = useSnackbar(options_error)
   const { id } = useParams()
   const [coin, setCoin] = useState()
   const { currency, symbol, user, watchList } = CryptoState()
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

   const inWatchList = watchList.includes(coin.id)
   const addToWatchlist = async () => {
      const coinRef = doc(db, user.uid, "watchlist")
      try {
         await setDoc(
            coinRef,
            {
               coins: watchList ? [...watchList, coin.id] : [coin.id],
            },
            { merge: true }
         )
         openSnackbarSuccess("WatchList Added")
      } catch (error) {
         console.log(error)
      }
   }
   const removeWatchlist = async () => {
      const coinRef = doc(db, user.uid, "watchlist")
      try {
         await setDoc(
            coinRef,
            {
               coins: watchList.filter((wish) => wish !== coin.id),
            },
            { merge: true }
         )
         openSnackbarSuccess("WatchList Removed")
      } catch (error) {
         console.log(error)
      }
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
               {user ? (
                  !inWatchList ? (
                     <button
                        className="mt-5 bg-yellow-400 px-4 py-3 text-black rounded font-bold"
                        onClick={addToWatchlist}
                     >
                        Add To WatchList
                     </button>
                  ) : (
                     <button
                        className="mt-5 bg-red-400 px-4 py-3 text-black rounded font-bold"
                        onClick={removeWatchlist}
                     >
                        Remove From WatchList
                     </button>
                  )
               ) : (
                  ""
               )}
            </div>
         </div>
         {/* Coininfo */}
         <div className="lg:w-[90%] overflow-hidden">
            <Coininfo coin={coin} />
         </div>
      </div>
   )
}
