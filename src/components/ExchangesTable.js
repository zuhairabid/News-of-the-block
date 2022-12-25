import axios from "axios"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { CoinList, Exchanges } from "../config/api"
import { CryptoState } from "../CryptoContext"
import ReactPaginate from "react-paginate"
import "../loading.css"
import { numberWithCommas } from "../config/numberWithCommas"

const ExchangesTable = () => {
   const { currency, symbol } = CryptoState()
   const [coins, setCoins] = useState([])
   const [loading, setLoading] = useState(false)
   const [search, setSearch] = useState("")
   const [page, setPage] = useState(1)
   const [convert_unit, setConvert_unit] = useState()

   async function BtcToCurrency(currency) {
      // const options = {
      //    method: "GET",
      //    url: `https://api.apilayer.com/fixer/convert?to=${currency}&from=BTC&amount=1.0`,

      //    headers: { apikey: "6Z5ESemLDECW2UfKBBa1Zq8liKB2YOwy" },
      // }

      // await axios
      //    .request(options)
      //    .then(function (response) {
      //       setConvert_unit(response.data.result.toFixed(2))
      //       return response.data.result.toFixed(2)
      //       // console.log(response.data.result.toFixed(2))
      //    })
      //    .catch(function (error) {
      //       console.error(error)
      //    })
      const { data } = await axios.get(
         `https://api.exchangerate.host/convert?from=BTC&to=${currency}`
      )
      return data.info.rate
   }

   const fetchCoins = async () => {
      setLoading(true)
      const { data } = await axios.get(Exchanges(currency))
      setConvert_unit(await BtcToCurrency(currency))

      setCoins(data)
      setLoading(false)
   }

   useEffect(() => {
      fetchCoins()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currency])

   const handleSearch = () => {
      return coins.filter((coin) => coin.name.toLowerCase().includes(search))
   }

   const history = useHistory()
   return (
      <div className="font-mons text-lg">
         <p className="text-center my-4 text-3xl">
            Cryptocurrency Exchanges by Market Cap
         </p>
         <input
            className="text-xs p-3 text-gray-400 bg-transparent border border-gray-600 rounded-sm w-[90%] mx-auto block"
            type="text"
            placeholder="Search for Exchanges"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
         />
         {loading ? (
            <div className="linear-activity">
               <div className="indeterminate"></div>
            </div>
         ) : (
            <table className="w-[90%]  mx-auto my-3 font-mons rounded-xl block lg:table">
               <thead className="text-right  text-black font-bold text-xs">
                  <tr className="rounded-3xl ">
                     {[
                        "Exchange",
                        "Rank",
                        "Trust Score",
                        "Trade Volume 24 btc",
                        "Trade Volume 24 btc (normalized)",
                     ].map((head) => {
                        return (
                           <th
                              key={Math.random()}
                              className="px-5 first:text-left py-3 last:rounded-tr-md first:rounded-tl-md bg-yellow-400 first:pl-2 last:pr-2 "
                           >
                              {head}
                           </th>
                        )
                     })}
                  </tr>
               </thead>

               <tbody>
                  {handleSearch()
                     .slice((page - 1) * 10, (page - 1) * 10 + 10)
                     .map((coin) => {
                        return (
                           <tr
                              onClick={() => history.push(`/coins/${coin.id}`)}
                              className="[&>td]:pl-5 cursor-pointer text-xs text-right hover:bg-neutral-800 border-b-[0.7px] border-gray-500 "
                           >
                              <td className="flex items-center w-[100%] my-2 pl-1 text-left ">
                                 <div className="mr-2">
                                    <img src={coin.image} alt="" width={40} />
                                 </div>
                                 <div>
                                    <p className="uppercase text-sm">
                                       {coin.name}
                                    </p>
                                 </div>
                              </td>
                              <td>
                                 <p>{coin.trust_score_rank}</p>
                              </td>
                              <td>
                                 <p>{coin.trust_score} / 10</p>
                              </td>
                              <td>
                                 {symbol +
                                    " " +
                                    (
                                       coin.trade_volume_24h_btc.toFixed(2) *
                                       convert_unit
                                    ).toFixed(2)}
                              </td>

                              <td>
                                 {symbol +
                                    " " +
                                    (
                                       coin.trade_volume_24h_btc_normalized.toFixed(
                                          2
                                       ) * convert_unit
                                    ).toFixed(2)}
                              </td>
                           </tr>
                        )
                     })}
               </tbody>
            </table>
         )}
         <div className="w-full pb-5 flex items-center justify-center">
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

export default ExchangesTable
