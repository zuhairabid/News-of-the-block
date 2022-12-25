import React from "react"
import { useHistory } from "react-router-dom"
import { CryptoState } from "../CryptoContext"

const SideBar = () => {
   const { setModal, user, handleLogout, collapsed, setCollapsed } =
      CryptoState()
   const history = useHistory()
   const sidebarClass =
      "flex flex-col items-center justify-center lg:hidden overflow-x-hidden z-[10000] transition-all duration-[500ms] bg-neutral-900 bg-opacity-95  border-b border-yellow-400 absolute w-full top-0 right-0 h-full "
   return (
      <div
         onClick={() => setCollapsed(!collapsed)}
         className={!collapsed ? sidebarClass : sidebarClass + "w-0"}
      >
         <ul className="mt[-200px] font-mons text-lg flex flex-col space-y-3 items-center font-bold py-5">
            <li onClick={() => history.push("/")}>Coins</li>
            <li onClick={() => history.push("/")}>Portfolio</li>
            <li onClick={() => history.push("/")}>Watchlist</li>
            <li onClick={() => history.push("/exchanges")}>Exchanges</li>
            <li onClick={() => history.push("/news")}>News</li>
            {!user ? (
               <button
                  onClick={() => setModal(true)}
                  className="ml-2 py-3 px-4 text-xs rounded bg-yellow-500 text-black uppercase font-normal"
               >
                  Login
               </button>
            ) : (
               <button
                  onClick={handleLogout}
                  className="ml-2 py-3 px-4 text-xs rounded bg-yellow-500 text-black uppercase font-normal"
               >
                  logout
               </button>
            )}
         </ul>
      </div>
   )
}

export default SideBar
