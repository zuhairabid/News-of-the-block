import axios from "axios"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { CoinList } from "../config/api"
import { CryptoState } from "../CryptoContext"
import ReactPaginate from "react-paginate"
import "../loading.css"
import { numberWithCommas } from "../config/numberWithCommas"

const CoinsTable = () => {
   const [coins, setCoins] = useState([])
   const [loading, setLoading] = useState(false)
   const [search, setSearch] = useState("")
   const [page, setPage] = useState(1)
   const { currency, symbol } = CryptoState()

   const fetchCoins = async () => {
      setLoading(true)
      const { data } = await axios.get(CoinList(currency))
      console.log(data)

      setCoins(data)
      setLoading(false)
   }

   useEffect(() => {
      fetchCoins()
   }, [currency])

   const handleSearch = () => {
      return coins.filter(
         (coin) =>
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
      )
   }
   console.log(handleSearch())

   const history = useHistory()
   return (
      <div className="font-mons text-lg">
         <p className="text-center my-4">Cryptocurrency Prices by Market Cap</p>
         <input
            className="text-xs p-3 text-gray-400 bg-transparent border border-gray-600 rounded-sm w-[90%] mx-auto block"
            type="text"
            placeholder="Search for a Crypto Currency"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
         />
         {loading ? (
            <div class="linear-activity">
               <div class="indeterminate"></div>
            </div>
         ) : (
            <table className="w-[90%]  mx-auto my-3 font-mons rounded-xl">
               <thead className="text-right  text-black font-bold text-xs">
                  <tr className="rounded-3xl ">
                     {["Coin", "Price", "24h Change", "Market Cap"].map(
                        (head) => {
                           return (
                              <th className="first:text-left py-3 last:rounded-tr-md first:rounded-tl-md bg-yellow-400 first:pl-2 last:pr-2 ">
                                 {head}
                              </th>
                           )
                        }
                     )}
                  </tr>
               </thead>

               <tbody>
                  {handleSearch()
                     .slice((page - 1) * 10, (page - 1) * 10 + 10)
                     .map((coin) => {
                        const growth_percentage =
                           coin.price_change_percentage_24h.toFixed(2)

                        return (
                           <tr
                              onClick={() => history.push(`/coins/${coin.id}`)}
                              className=" cursor-pointer text-xs text-right hover:bg-neutral-800 border-b-[0.7px] border-gray-500 "
                           >
                              <td className="flex items-center w-[100%] my-2 pl-1 text-left ">
                                 <div className="mr-2">
                                    <img src={coin.image} alt="" width={40} />
                                 </div>
                                 <div>
                                    <p className="uppercase text-sm">
                                       {coin.symbol}
                                    </p>
                                    <p className="text-[9px]">{coin.name}</p>
                                 </div>
                              </td>
                              <td>
                                 {symbol +
                                    " " +
                                    numberWithCommas(
                                       coin.current_price.toFixed(2)
                                    )}
                              </td>
                              <td
                                 className={
                                    growth_percentage > 0
                                       ? "text-green-500 font-bold"
                                       : "text-red-500 font-bold"
                                 }
                              >
                                 {growth_percentage > 0
                                    ? `+${growth_percentage}`
                                    : `${growth_percentage}`}
                              </td>
                              <td>
                                 {numberWithCommas(
                                    coin.market_cap.toString().slice(0, -6)
                                 )}{" "}
                                 M
                              </td>
                           </tr>
                        )
                     })}
               </tbody>
            </table>
         )}
         <div className="w-full pb-5">
            <ReactPaginate
               containerClassName="container"
               previousClassName="page_items"
               nextClassName="page_items"
               pageClassName="page_items text-xs"
               activeClassName="active_page"
               breakLabel="..."
               nextLabel=">"
               onPageChange={(f) => setPage(f.selected + 1)}
               pageRangeDisplayed={2}
               marginPagesDisplayed={2}
               pageCount={(coins.length / 10).toFixed(0)}
               //    pageCount={100}
               previousLabel="<"
               renderOnZeroPageCount={null}
               disabledLinkClassName="disable_page"
            />
         </div>
      </div>
   )
}

export default CoinsTable
