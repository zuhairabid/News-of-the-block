import React from "react"
import { Select, MenuItem } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CryptoState } from "../CryptoContext"

import { useHistory } from "react-router"
const darkTheme = createTheme({
   palette: {
      mode: "dark",
   },
})

export const Header = () => {
   const history = useHistory()

   const { currency, setCurrency } = CryptoState()

   return (
      <nav className="flex items-center text-lg text-yellow-400 font-mons font-bold p-3 cursor-pointer shadow-lg">
         <h1 className="flex-grow" onClick={() => history.push("/")}>
            News Of The Block
         </h1>
         <ThemeProvider theme={darkTheme}>
            <Select
               value={currency}
               onChange={(e) => setCurrency(e.target.value)}
               variant="outlined"
               className="w-[100px] h-[40px] ml-15 border border-white text-blue"
            >
               <MenuItem value={"USD"}>USD</MenuItem>
               <MenuItem value={"INR"}>INR</MenuItem>
            </Select>
         </ThemeProvider>
      </nav>
   )
}
