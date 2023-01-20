import axios from "axios"
import React, { useEffect, useState } from "react"
import { CoinList } from "../config/api"
import { doc, setDoc } from "firebase/firestore"
import { db } from "./firebase"
import { CryptoState } from "../CryptoContext"
import { useSnackbar } from "react-simple-snackbar"
import { createTheme, MenuItem, Select, ThemeProvider } from "@mui/material"
import { useHistory } from "react-router-dom"
import { numberWithCommas } from "../config/numberWithCommas"
import ReactPaginate from "react-paginate"

const darkTheme = createTheme({
   palette: {
      mode: "dark",
   },
})

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
   const [portfolioCoins, setPortfolioCoins] = useState([])
   const [data, setData] = useState([])
   const [finalSelected, setFinalSelected] = useState()
   const [finalSelectedAmount, setFinalSelectedAmount] = useState()
   const [portfolio_name, setPortfolio_name] = useState("default")
   const [portfolio_name_list, setPortfolio_name_list] = useState([])
   // -----------------------------------------------------------------------
   const [coinId, setCoinId] = useState()

   const [loading, setLoading] = useState(false)
   const [search, setSearch] = useState("")
   const [page, setPage] = useState(1)
   const { currency, symbol } = CryptoState()
   const { user, portfolioList } = CryptoState()

   // const handleSearch = () => {
   //    return coins.filter(
   //       (coin) =>
   //          coin.name.toLowerCase().includes(search) ||
   //          coin.symbol.toLowerCase().includes(search)
   //    )
   // }

   const history = useHistory()
   // ------------------------------------------------------------------------

   const coinSearchFilter = async () => {
      const { data } = await axios.get(CoinList("usd"))

      setData(data)
   }

   // const inputHandle = () => {
   //    const coins = data.filter((coin) => {
   //       return (
   //          coin.name.toLowerCase().includes(coinSearch) ||
   //          coin.symbol.toLowerCase().includes(coinSearch)
   //       )
   //    })
   //    setCoins(coins)
   // }

   const modifyData = () => {
      const data = portfolioList
      let newPortfolioList = {}

      if (
         !data.portfolios ||
         !data ||
         (data.porfolios ? data.portfolios.length == 0 : false)
      ) {
         newPortfolioList = {
            portfolios: [
               {
                  portfolio_name: "myportfolio",
                  coins: [{ id: finalSelected, amount: finalSelectedAmount }],
               },
            ],
         }
      } else if (data.portfolios.length > 0) {
         newPortfolioList = {
            portfolios: [
               ...data.portfolios,
               {
                  portfolio_name: "myportfolio2",
                  coins: [{ id: finalSelected, amount: finalSelectedAmount }],
               },
            ],
         }
      }

      return newPortfolioList

      // if (data.length == 0) {
      //    return [
      //       {
      //          portfolio_name: "hello",
      //          coins: [{ name: finalSelected, amount: finalSelectedAmount }],
      //       },
      //    ]
      // } else if (data.length > 0) {
      //    data.forEach((item, index) => {
      //       if (item.portfolio_name === "hello") {
      //          data[index].coins.push({
      //             name: finalSelected,
      //             amount: finalSelectedAmount,
      //          })
      //       }
      //    })
      //    return data
      // }
   }

   const portfolioNameList = () => {
      let portfolio_names = []
      const data = portfolioList
      if (data.portfolios) {
         data.portfolios.forEach((i) => {
            if (!portfolio_names.includes(i.portfolio_name)) {
               portfolio_names.push(i.portfolio_name)
            }
         })
         setPortfolio_name_list(portfolio_names)
         console.log(portfolio_names)
      }
   }

   const addToPortfolio = async () => {
      const coinRef = doc(db, "users", user.uid, "portfolios", "portfolios")
      try {
         await setDoc(coinRef, modifyData(), { merge: true })
         openSnackbarSuccess("WatchList Added")
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      coinSearchFilter()
      portfolioNameList()
      // console.log()
      setCoins(portfolioList.portfolios)
   }, [portfolioList])

   const filterDataByPortfolio = () => {
      console.log(portfolioList)
      var coinListByPortfolio = portfolioList.portfolios
      const coinListByPortfolio2 = coinListByPortfolio.filter((i) => {
         return i.portfolio_name === "myportfolio"
      })
      const coinListByPortfolio3 = coinListByPortfolio2.map((i) => {
         return i.coins[0]
      })
      setPortfolioCoins(coinListByPortfolio3)
      console.log(coinListByPortfolio3)
   }
   filterDataByPortfolio()
   console.log(data)

   const setCoinsListByPortfolio = () => {
      let portfolioCoinsIds = portfolioCoins.map((i) => {
         console.log(i.name)
         return i.name
      })
      var coins = data.filter((i) => {
         return portfolioCoinsIds.includes(i.data)
      })
      console.log(coins)
   }
   setCoinsListByPortfolio()

   return (
      // <div className="p-5">
      //    <div className="flex z-[1000]">
      //      <p className="text-3xl flex-grow font-bold">My Portfolio</p>
      //       <ThemeProvider theme={darkTheme}>
      //          <Select
      //             value={portfolio_name}
      //             onChange={(e) => setPortfolio_name(e.target.value)}
      //             variant="outlined"
      //             className="w-[300px] h-[40px] ml-15 border border-white text-blue"
      //          >
      //             <MenuItem value={"default"}>Select Portfolio</MenuItem>
      //             {portfolio_name_list
      //                ? portfolio_name_list.map((i) => (
      //                     <MenuItem value={i}>{i}</MenuItem>
      //                  ))
      //                : ""}
      //             {/* <MenuItem value={"USD"}>USD</MenuItem>
      //             <MenuItem value={"INR"}>INR</MenuItem> */}
      //          </Select>
      //       </ThemeProvider>
      //       <div>
      //          <button
      //             className="text-black ml-3 bg-yellow-400 px-3 py-2 rounded font-bold text-md"
      //             onClick={() => {
      //                setShowPortfolioCreate(!showPortfolioCreate)
      //             }}
      //          >
      //             Create Portfolio +
      //          </button>
      //          <button
      //             className="text-black ml-3 bg-yellow-400 px-3 py-2 rounded font-bold text-md"
      //             onClick={() => {
      //                setShowAddCoin(!showAddCoin)
      //             }}
      //          >
      //             Add New Coin
      //          </button>
      //       </div>
      //    </div>
      //    <div className="my-10">
      //       <div
      //          className={
      //             "z-[10] relative flex flex-col items-center border  overflow-hidden space-y-5  " +
      //             (showPortfolioCreate ? "h-full" : "h-0")
      //          }
      //       >
      //          <p className="text-2xl mt-7 uppercase ">Create Portfolio</p>
      //          <input
      //             className="w-80 h-10 bg-transparent border-yellow-400 border p-2"
      //             type="text"
      //             placeholder="Portfolio Name"
      //          />
      //          <div>
      //             <button className=" ml-3 px-3 py-2 rounded font-bold text-md border border-yellow-400">
      //                Cancel
      //             </button>
      //             <button className="text-black ml-3 bg-yellow-400 px-3 py-2 rounded font-bold text-md mb-8">
      //                Add Portfolio
      //             </button>
      //          </div>
      //       </div>
      //       <div
      //          className={
      //             "z-[10] relative flex flex-col items-center  border  overflow-hidden space-y-5  " +
      //             (showAddCoin ? "h-full" : "h-0")
      //          }
      //       >
      //          <p className="text-2xl mt-7 uppercase ">Add Coin</p>
      //          {finalSelected ? (
      //             <div className="w-80 flex items-center">
      //                <p className="flex-grow">Selected Coin: </p>
      //                <img
      //                   src={
      //                      data.filter((coin) => coin.id === finalSelected)[0]
      //                         .image
      //                   }
      //                   alt=""
      //                   className="h-5 w-5 mr-2"
      //                />
      //                <p className="font-bold">
      //                   {
      //                      data.filter((coin) => coin.id === finalSelected)[0]
      //                         .name
      //                   }
      //                </p>
      //             </div>
      //          ) : (
      //             ""
      //          )}
      //          <input
      //             className="w-80 h-10 bg-transparent border-yellow-400 border p-2"
      //             type="text"
      //             placeholder="Coin Name"
      //             onInput={(e) => {
      //                setCoinSearch(
      //                   e.target.value.length > 1 ? e.target.value : "121211"
      //                )
      //                inputHandle()
      //             }}
      //          />
      //          <div className="w-80 flex flex-col border border-gray-600 mt-10[]'">
      //             {coins.map((coin) => {
      //                return (
      //                   <div
      //                      className="cursor-pointer flex hover:bg-slate-500 "
      //                      onClick={() => {
      //                         setFinalSelected(coin.id)
      //                         setCoins([])
      //                      }}
      //                   >
      //                      {" "}
      //                      <img className="h-5 mr-2" src={coin.image} />{" "}
      //                      <p>{coin.name}</p>
      //                   </div>
      //                )
      //             })}
      //          </div>
      //          <input
      //             className="w-80 h-10 bg-transparent border-yellow-400 border p-2"
      //             type="text"
      //             placeholder="Enter Amount"
      //             value={finalSelectedAmount}
      //             onInput={(e) => setFinalSelectedAmount(e.target.value)}
      //          />
      //          <div>
      //             <button
      //                className=" ml-3 px-3 py-2 rounded font-bold text-md border border-yellow-400"
      //                onClick={() => {
      //                   setCoins([])
      //                   setShowAddCoin(false)
      //                   setCoinSearch("")
      //                   setFinalSelected("")
      //                   setFinalSelectedAmount("")
      //                   setCoinSearch("")
      //                   setFinalSelectedAmount("")
      //                }}
      //             >
      //                Cancel
      //             </button>
      //             <button
      //                className="text-black ml-3 bg-yellow-400 px-3 py-2 rounded font-bold text-md mb-8"
      //                onClick={() => {
      //                   addToPortfolio()
      //                   // setCoins([])
      //                   // setShowAddCoin(false)
      //                   // setCoinSearch("")
      //                   // setFinalSelected("")
      //                   // setFinalSelectedAmount("")
      //                   // setCoinSearch("")
      //                   // setFinalSelectedAmount("")
      //                }}
      //             >
      //                Add Coin
      //             </button>
      //          </div>
      //       </div>
      //    </div>
      //    <div className="flex mt-10">
      //       <div className="bg-[#1a1a21] p-4 rounded border border-gray-600 mr-3 text-lg">
      //          <p>$ 7,512.96</p>
      //          <p>Total Balance</p>
      //       </div>
      //       <div className="bg-[#1a1a21] p-4 rounded border border-gray-600 mr-3 text-lg">
      //          <p>$ 7,512.96</p>
      //          <p>Total Balance</p>
      //       </div>
      //    </div>
      //    <div>
      //       <div className="font-mons text-lg">
      //          <p className="text-center my-4">
      //             Cryptocurrency Prices by Market Cap
      //          </p>
      //          <input
      //             className="text-xs p-3 text-gray-400 bg-transparent border border-gray-600 rounded-sm w-[90%] mx-auto block"
      //             type="text"
      //             placeholder="Search for a Crypto Currency"
      //             onChange={(e) => setSearch(e.target.value.toLowerCase())}
      //          />
      //          {loading ? (
      //             <div className="linear-activity">
      //                <div className="indeterminate"></div>
      //             </div>
      //          ) : (
      //             <table className="w-[90%]  mx-auto my-3 font-mons rounded-xl block lg:table">
      //                <thead className="text-right  text-black font-bold text-xs">
      //                   <tr className="rounded-3xl ">
      //                      {["Coin", "Price", "24h Change", "Market Cap"].map(
      //                         (head) => {
      //                            return (
      //                               <th
      //                                  key={Math.random()}
      //                                  className="px-5 first:text-left py-3 last:rounded-tr-md first:rounded-tl-md bg-yellow-400 first:pl-2 last:pr-2 "
      //                               >
      //                                  {head}
      //                               </th>
      //                            )
      //                         }
      //                      )}
      //                   </tr>
      //                </thead>

      //                <tbody>
      //                   {handleSearch()
      //                      .slice((page - 1) * 10, (page - 1) * 10 + 10)
      //                      .map((coin) => {
      //                         const growth_percentage =
      //                            coin.price_change_percentage_24h.toFixed(2)

      //                         return (
      //                            <tr
      //                               onClick={() =>
      //                                  history.push(`/coins/${coin.id}`)
      //                               }
      //                               className="[&>td]:pl-5 cursor-pointer text-xs text-right hover:bg-neutral-800 border-b-[0.7px] border-gray-500 "
      //                            >
      //                               <td className="flex items-center w-[100%] my-2 pl-1 text-left ">
      //                                  <div className="mr-2">
      //                                     <img
      //                                        src={coin.image}
      //                                        alt=""
      //                                        width={40}
      //                                     />
      //                                  </div>
      //                                  <div>
      //                                     <p className="uppercase text-sm">
      //                                        {coin.symbol}
      //                                     </p>
      //                                     <p className="text-[9px]">
      //                                        {coin.name}
      //                                     </p>
      //                                  </div>
      //                               </td>
      //                               <td>
      //                                  {symbol +
      //                                     " " +
      //                                     numberWithCommas(
      //                                        coin.current_price.toFixed(2)
      //                                     )}
      //                               </td>
      //                               <td
      //                                  className={
      //                                     growth_percentage > 0
      //                                        ? "text-green-500 font-bold"
      //                                        : "text-red-500 font-bold"
      //                                  }
      //                               >
      //                                  {growth_percentage > 0
      //                                     ? `+${growth_percentage}`
      //                                     : `${growth_percentage}`}
      //                               </td>
      //                               <td>
      //                                  {numberWithCommas(
      //                                     coin.market_cap
      //                                        .toString()
      //                                        .slice(0, -6)
      //                                  )}{" "}
      //                                  M
      //                               </td>
      //                            </tr>
      //                         )
      //                      })}
      //                </tbody>
      //             </table>
      //          )}
      //          <div className="w-full pb-5 flex items-center justify-center">
      //             <ReactPaginate
      //                containerClassName="container"
      //                previousClassName="page_items"
      //                nextClassName="page_items"
      //                pageClassName="page_items text-xs"
      //                activeClassName="active_page"
      //                breakLabel="..."
      //                nextLabel=">"
      //                onPageChange={(f) => setPage(f.selected + 1)}
      //                pageRangeDisplayed={2}
      //                marginPagesDisplayed={2}
      //                pageCount={(coins.length / 10).toFixed(0)}
      //                //    pageCount={100}
      //                previousLabel="<"
      //                renderOnZeroPageCount={null}
      //                disabledLinkClassName="disable_page"
      //             />
      //          </div>
      //       </div>
      //    </div>
      // </div>
      <div></div>
   )
}
