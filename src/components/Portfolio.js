import axios from "axios"
import React, { useEffect, useState } from "react"
import { CoinList } from "../config/api"
import { doc, setDoc } from "firebase/firestore"
import { db } from "./firebase"
import { CryptoState } from "../CryptoContext"
import { useSnackbar } from "react-simple-snackbar"

export const Portfolio = () => {
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
   const [showPortfolioCreate, setShowPortfolioCreate] = useState(false)
   const [showAddCoin, setShowAddCoin] = useState(false)
   const [coinSearch, setCoinSearch] = useState("")
   const [coins, setCoins] = useState([])
   const [data, setData] = useState([])
   const [finalSelected, setFinalSelected] = useState()
   const [finalSelectedAmount, setFinalSelectedAmount] = useState()
   const { user, portfolioList } = CryptoState()

   const coinSearchFilter = async () => {
      const { data } = await axios.get(CoinList("usd"))

      setData(data)
      console.log(data)
   }
   useEffect(() => {
      coinSearchFilter()
      console.log([
         portfolioList.length > 0
            ? [
                 ...portfolioList,
                 {
                    name: finalSelected,
                    amount: finalSelectedAmount,
                 },
              ]
            : {
                 name: finalSelected,
                 amount: finalSelectedAmount,
              },
      ])
   }, [])

   const inputHandle = () => {
      const coins = data.filter((coin) => {
         return (
            coin.name.toLowerCase().includes(coinSearch) ||
            coin.symbol.toLowerCase().includes(coinSearch)
         )
      })
      setCoins(coins)
   }

   const addToPortfolio = async () => {
      const coinRef = doc(db, user.uid, "portfolio")
      try {
         await setDoc(
            coinRef,
            {
               coins: [
                  [
                     ...portfolioList,
                     {
                        name: finalSelected,
                        amount: finalSelectedAmount,
                     },
                  ],
               ],
            },
            { merge: true }
         )
         openSnackbarSuccess("WatchList Added")
      } catch (error) {
         console.log(error)
         console.log([
            ...portfolioList,
            {
               name: finalSelected,
               amount: finalSelectedAmount,
            },
         ])
      }
   }

   return (
      <div className="p-5">
         <div className="flex z-[1000]">
            <p className="text-3xl flex-grow font-bold">My Portfolio</p>
            <div>
               <button
                  className="text-black ml-3 bg-yellow-400 px-3 py-2 rounded font-bold text-md"
                  onClick={() => {
                     setShowPortfolioCreate(!showPortfolioCreate)
                  }}
               >
                  Create Portfolio +
               </button>
               <button
                  className="text-black ml-3 bg-yellow-400 px-3 py-2 rounded font-bold text-md"
                  onClick={() => {
                     setShowAddCoin(!showAddCoin)
                  }}
               >
                  Add New Coin
               </button>
            </div>
         </div>
         <div className="my-10">
            <div
               className={
                  "z-[10] relative flex flex-col items-center border  overflow-hidden space-y-5  " +
                  (showPortfolioCreate ? "h-full" : "h-0")
               }
            >
               <p className="text-2xl mt-7 uppercase ">Create Portfolio</p>
               <input
                  className="w-80 h-10 bg-transparent border-yellow-400 border p-2"
                  type="text"
                  placeholder="Portfolio Name"
               />
               <div>
                  <button className=" ml-3 px-3 py-2 rounded font-bold text-md border border-yellow-400">
                     Cancel
                  </button>
                  <button className="text-black ml-3 bg-yellow-400 px-3 py-2 rounded font-bold text-md mb-8">
                     Add Portfolio
                  </button>
               </div>
            </div>
            <div
               className={
                  "z-[10] relative flex flex-col items-center  border  overflow-hidden space-y-5  " +
                  (showAddCoin ? "h-full" : "h-0")
               }
            >
               <p className="text-2xl mt-7 uppercase ">Add Coin</p>
               {finalSelected ? (
                  <div className="w-80 flex items-center">
                     <p className="flex-grow">Selected Coin: </p>
                     <img
                        src={
                           data.filter((coin) => coin.id === finalSelected)[0]
                              .image
                        }
                        alt=""
                        className="h-5 w-5 mr-2"
                     />
                     <p className="font-bold">
                        {
                           data.filter((coin) => coin.id === finalSelected)[0]
                              .name
                        }
                     </p>
                  </div>
               ) : (
                  ""
               )}
               <input
                  className="w-80 h-10 bg-transparent border-yellow-400 border p-2"
                  type="text"
                  placeholder="Coin Name"
                  onInput={(e) => {
                     setCoinSearch(
                        e.target.value.length > 1 ? e.target.value : 1234555
                     )
                     console.log(coinSearch)
                     inputHandle()
                  }}
               />
               <div className="w-80 flex flex-col border border-gray-600 mt-10[]'">
                  {coins.map((coin) => {
                     return (
                        <div
                           className="cursor-pointer flex hover:bg-slate-500 "
                           onClick={() => {
                              setFinalSelected(coin.id)
                              setCoins([])
                           }}
                        >
                           {" "}
                           <img className="h-5 mr-2" src={coin.image} />{" "}
                           <p>{coin.name}</p>
                        </div>
                     )
                  })}
               </div>
               <input
                  className="w-80 h-10 bg-transparent border-yellow-400 border p-2"
                  type="text"
                  placeholder="Enter Amount"
                  onInput={(e) => setFinalSelectedAmount(e.target.value)}
               />
               <div>
                  <button className=" ml-3 px-3 py-2 rounded font-bold text-md border border-yellow-400">
                     Cancel
                  </button>
                  <button
                     className="text-black ml-3 bg-yellow-400 px-3 py-2 rounded font-bold text-md mb-8"
                     onClick={addToPortfolio}
                  >
                     Add Portfolio
                  </button>
               </div>
            </div>
         </div>
         <div className="flex mt-10">
            <div className="bg-[#1a1a21] p-4 rounded border border-gray-600 mr-3 text-lg">
               <p>$ 7,512.96</p>
               <p>Total Balance</p>
            </div>
            <div className="bg-[#1a1a21] p-4 rounded border border-gray-600 mr-3 text-lg">
               <p>$ 7,512.96</p>
               <p>Total Balance</p>
            </div>
         </div>
      </div>
   )
}
