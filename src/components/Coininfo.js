import axios from "axios"
import { useEffect, useState } from "react"
import { HistoricalChart } from "../config/api"
import { Line } from "react-chartjs-2"
// eslint-disable-next-line
import Chart from "chart.js/auto"
// import SelectButton from "./SelectButton"
import { chartDays } from "../config/data"
import { CryptoState } from "../CryptoContext"
import SelectButton from "./SelectButton"

const CoinInfo = ({ coin }) => {
   const [historicData, setHistoricData] = useState()
   const [days, setDays] = useState(1)
   const { currency } = CryptoState()
   const [flag, setflag] = useState(false)

   const fetchHistoricData = async () => {
      const { data } = await axios.get(HistoricalChart(coin.id, days, currency))
      setflag(true)
      setHistoricData(data.prices)
   }

   useEffect(() => {
      fetchHistoricData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [days])

   return (
      <div className="mt-20  ">
         {!historicData | (flag === false) ? (
            <div className="linear-activity">
               <div className="indeterminate"></div>
            </div>
         ) : (
            <>
               <Line
                  data={{
                     labels: historicData.map((coin) => {
                        let date = new Date(coin[0])
                        let time =
                           date.getHours() > 12
                              ? `${
                                   date.getHours() - 12
                                }:${date.getMinutes()} PM`
                              : `${date.getHours()}:${date.getMinutes()} AM`
                        return days === 1 ? time : date.toLocaleDateString()
                     }),

                     datasets: [
                        {
                           data: historicData.map((coin) => coin[1]),
                           label: `Price ( Past ${days} Days ) in ${currency}`,
                           borderColor: "#EEBC1D",
                        },
                     ],
                  }}
                  options={{
                     elements: {
                        point: {
                           radius: 1,
                        },
                     },
                  }}
               />
               <div
                  style={{
                     display: "flex",
                     marginTop: 20,
                     justifyContent: "space-around",
                     width: "100%",
                  }}
               >
                  {chartDays.map((day) => (
                     <SelectButton
                        key={day.value}
                        onClick={() => {
                           setDays(day.value)
                           setflag(false)
                        }}
                        selected={day.value === days}
                     >
                        {day.label}
                     </SelectButton>
                  ))}
               </div>
               <div className="h-10"></div>
            </>
         )}
      </div>
   )
}

export default CoinInfo
