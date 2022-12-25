import axios from "axios"
import { onAuthStateChanged, signOut } from "firebase/auth"
import React, { useContext } from "react"
import { createContext, useState, useEffect } from "react"
import { auth } from "./components/firebase"

const Crypto = createContext()

const CryptoContext = ({ children }) => {
   const [currency, setCurrency] = useState("USD")
   const [symbol, setSymbol] = useState("$")
   const [modal, setModal] = useState(false)
   const [collapsed, setCollapsed] = useState(true)
   const [user, setUser] = useState()

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
