import { Select, MenuItem } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CryptoState } from "../CryptoContext"
import { Bars3Icon } from "@heroicons/react/24/outline"

import { useHistory } from "react-router"
import Modal from "./Modal"
import SideBar from "./SideBar"
import { useEffect } from "react"
const darkTheme = createTheme({
   palette: {
      mode: "dark",
   },
})

export const Header = () => {
   const history = useHistory()
   useEffect(() => {
      // setCollapsed(!collapsed)
   }, [])

   const {
      currency,
      setCurrency,
      modal,
      setModal,
      user,
      handleLogout,
      collapsed,
      setCollapsed,
   } = CryptoState()

   return (
      <div className=" z-[1000]">
         <nav className=" relative z-[100000000] flex items-center  font-mons font-bold p-3 cursor-pointer shadow-lg">
            {modal ? <Modal /> : ""}
            <h1
               className="flex-grow text-2xl text-yellow-400"
               onClick={() => history.push("/")}
            >
               News Of The Block
            </h1>
            <div className="flex-grow hidden lg:block">
               <ul className="[&>li:hover]:text-yellow-400 mt[-200px] font-mons text-xs flex text-white items-center font-bold py-5 ml-5 space-x-6">
                  <li onClick={() => history.push("/")}>Coins</li>
                  <li onClick={() => history.push("/")}>Portfolio</li>
                  <li onClick={() => history.push("/")}>Watchlist</li>
                  <li onClick={() => history.push("/exchanges")}>Exchanges</li>
                  <li onClick={() => history.push("/news")}>News</li>
               </ul>
            </div>
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
            <Bars3Icon
               onClick={() => {
                  setCollapsed(!collapsed)
                  console.log(collapsed)
               }}
               className="h-10 rounded ml-2 lg:hidden"
            />

            {!user ? (
               <button
                  onClick={() => setModal(true)}
                  className="hidden lg:inline ml-2 py-3 px-4 text-xs rounded bg-yellow-500 text-black uppercase font-normal"
               >
                  Login
               </button>
            ) : (
               <button
                  onClick={handleLogout}
                  className="hidden lg:inline  ml-2 py-3 px-4 text-xs rounded bg-yellow-500 text-black uppercase font-normal"
               >
                  logout
               </button>
            )}
         </nav>
         <SideBar />
      </div>
   )
}
