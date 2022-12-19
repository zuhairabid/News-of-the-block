import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { SingleCoin } from "../config/api"
// import { CryptoState } from "../CryptoContext"
import Coininfo from "./Coininfo"

export const CoinPage = () => {
   const { id } = useParams()
   const [coin, setCoin] = useState()
   // const { currency } = CryptoState()

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
      <div>
         <div>
            <img src={coin.image.large} alt="" />
            <p>{coin.name}</p>
            <p>{coin.description.en.split(". ")[0]}</p>
         </div>
         {/* Coininfo */}
         <div>
            <Coininfo />
         </div>
      </div>
   )
}
