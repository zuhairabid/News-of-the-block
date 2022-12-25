import React, { useState } from "react"
import DerivativesTable from "./DerivativesTable"
import ExchangesTable from "./ExchangesTable"

export const Exchanges = () => {
   const [type, setType] = useState(true)
   return (
      <div>
         <div
            className="font-bold font-mons text-lg flex w-[90%] mx-auto mt-10 border-b border-yellow-400
            "
         >
            <div
               onClick={() => setType(true)}
               className="cursor-pointer border border-b-0 border-yellow-400 p-2 mr-2 rounded"
            >
               Exchanges
            </div>
            <div
               onClick={() => setType(false)}
               className="cursor-pointer border border-b-0 border-yellow-400 p-2 mr-2 rounded"
            >
               Derivatives
            </div>
         </div>
         {type ? <ExchangesTable /> : <DerivativesTable />}
      </div>
   )
}
