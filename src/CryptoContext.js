import axios from "axios"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import React, { useContext } from "react"
import { createContext, useState, useEffect } from "react"
import { auth, db } from "./components/firebase"

const Crypto = createContext()

const CryptoContext = ({ children }) => {
   const [currency, setCurrency] = useState("USD")
   const [symbol, setSymbol] = useState("$")
   const [modal, setModal] = useState(false)
   const [collapsed, setCollapsed] = useState(true)
   const [user, setUser] = useState()
   const [watchList, setWatchList] = useState([])
   const [portfolioList, setPortfolioList] = useState([])

   useEffect(() => {
      if (currency === "INR") {
         setSymbol("₹")
      } else if (currency === "USD") {
         setSymbol("$")
      }
   }, [currency])

   useEffect(() => {
      onAuthStateChanged(auth, (user) => {
         if (user) setUser(user)
         else setUser(null)
      })
   }, [])

   const handleLogout = async () => {
      await signOut(auth)
         .then(() => {
            // Sign-out successful.
         })
         .catch((error) => {
            // An error happened.
         })
   }

   const updateWatchList = () => {
      const coinRef = doc(db, user.uid, "watchlist")
      var unsubscribe = onSnapshot(coinRef, (coin) => {
         if (coin.exists()) {
            console.log(coin.data())
            setWatchList(coin.data().coins)
         }
      })
      return () => unsubscribe()
   }
   const updatePortfoliioList = () => {
      const coinRef = doc(db, user.uid, "portfolio")
      var unsubscribe = onSnapshot(coinRef, (coin) => {
         if (coin.exists()) {
            console.log(coin.data())
            setPortfolioList(coin.data().coins)
         }
      })
      return () => unsubscribe()
   }

   useEffect(() => {
      if (user) {
         updateWatchList()
         updatePortfoliioList()
      }
   }, [user])

   return (
      <Crypto.Provider
         value={{
            currency,
            setCurrency,
            symbol,
            modal,
            setModal,
            user,
            handleLogout,
            collapsed,
            setCollapsed,
            watchList,
            portfolioList,
         }}
      >
         {children}
      </Crypto.Provider>
   )
}

export default CryptoContext

export const CryptoState = () => {
   return useContext(Crypto)
}
