import {
   createUserWithEmailAndPassword,
   getAuth,
   GoogleAuthProvider,
   signInWithEmailAndPassword,
   signInWithPopup,
} from "firebase/auth"
import React, { useState } from "react"
import { CryptoState } from "../CryptoContext"
import { auth } from "./firebase"
import { useSnackbar } from "react-simple-snackbar"
const Modal = () => {
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
   const [openSnackbarError] = useSnackbar(options_error)
   const [isSignUp, setIsSignUp] = useState(true)
   const [email, setEmail] = useState()
   const [pass, setPass] = useState()
   const [confirmpass, setConfirmPass] = useState()
   const { setModal } = CryptoState()

   const provider = new GoogleAuthProvider()

   const handleSignUp = async () => {
      if (confirmpass !== pass) {
         openSnackbarError("Password not equal")

         return
      }
      await createUserWithEmailAndPassword(auth, email, pass)
         .then((userCredential) => {
            // Signed in
            const user = userCredential.user
            openSnackbarSuccess("User Created Successfully")

            // ...
         })
         .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            openSnackbarError(`Error : ${errorMessage}`)

            // ..
         })
   }

   const handleSignIn = async () => {
      await signInWithEmailAndPassword(auth, email, pass)
         .then((userCredential) => {
            // Signed in
            const user = userCredential.user
            openSnackbarSuccess(" Logged In!!")
            setModal(false)
            // ...
         })
         .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            openSnackbarError(errorMessage)
         })
   }

   const handleGoogleAuth = async () => {
      await signInWithPopup(auth, provider)
         .then((result) => {
            setModal(false)
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            // The signed-in user info.
            const user = result.user
            // ...
         })
         .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code
            const errorMessage = error.message
            // The email of the user's account used.
            const email = error.customData.email
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error)
            // ...
         })
   }

   return (
      <div
         onMouseUp={(e) => {
            if (e.target.id === "opac_container") {
               setModal(false)
            }
         }}
         id="opac_container"
         className="bg-black bg-opacity-40 z-40 absolute top-0 h-screen left-0 w-full flex flex-col items-center justify-center"
      >
         <div className="z-100 text-white  font-normal bg-neutral-700 w-[70%] lg:w-[50%] rounded">
            <div className="flex text-center cursor-pointer ">
               <div
                  className={
                     isSignUp
                        ? "border-b-2 px-4 py-2 w-[50%]  border-red-500"
                        : " px-4 py-2 w-[50%] "
                  }
                  onClick={() => setIsSignUp(true)}
               >
                  <span className="uppercase">Sign Up</span>
               </div>
               <div
                  className={
                     !isSignUp
                        ? "border-b-2 px-4 py-2 w-[50%]  border-red-500"
                        : " px-4 py-2 w-[50%] "
                  }
                  onClick={() => setIsSignUp(false)}
               >
                  <span className="uppercase">Login</span>
               </div>
            </div>
            {isSignUp ? (
               <div className="flex flex-col space-y-2 p-4">
                  <input
                     onChange={(e) => {
                        setEmail(e.target.value)
                     }}
                     type="text"
                     placeholder="Enter Email"
                     className="placeholder-white bg-transparent border border-neutral-500 rounded py-1 px-4 text-xs"
                  />
                  <input
                     onChange={(e) => {
                        setPass(e.target.value)
                     }}
                     type="text"
                     placeholder="Enter Password"
                     className="placeholder-white bg-transparent border border-neutral-500 rounded py-1 px-4 text-xs"
                  />
                  <input
                     onChange={(e) => {
                        setConfirmPass(e.target.value)
                     }}
                     type="text"
                     placeholder="Confirm Password"
                     className="placeholder-white bg-transparent border border-neutral-500 rounded py-1 px-4 text-xs"
                  />
                  <button
                     onClick={handleSignUp}
                     className="rounded bg-yellow-500 text-black uppercase"
                  >
                     Sign Up
                  </button>
                  <button
                     onClick={handleGoogleAuth}
                     className="hidden  p-1 rounded bg-[#4285F4] md:flex items-center text-sm space-x-3 justify-center"
                  >
                     <img
                        className="bg-white rounded p-1"
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt=""
                     />
                     <span>SIGN UP WITH GOOGLE</span>
                  </button>
               </div>
            ) : (
               <div className="flex flex-col space-y-2 p-4">
                  <input
                     onChange={(e) => {
                        setEmail(e.target.value)
                     }}
                     type="text"
                     placeholder="Enter Email"
                     className="placeholder-white bg-transparent border border-neutral-500 rounded py-1 px-4 text-xs"
                  />
                  <input
                     onChange={(e) => {
                        setPass(e.target.value)
                     }}
                     type="text"
                     placeholder="Enter Password"
                     className="placeholder-white bg-transparent border border-neutral-500 rounded py-1 px-4 text-xs"
                  />

                  <button
                     onClick={handleSignIn}
                     className="rounded bg-yellow-500 text-black uppercase"
                  >
                     Sign In
                  </button>
                  <button
                     onClick={handleGoogleAuth}
                     className="hidden  p-1 rounded bg-[#4285F4] md:flex items-center text-sm space-x-3 justify-center"
                  >
                     <img
                        className="bg-white rounded p-1"
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt=""
                     />
                     <span>SIGN IN WITH GOOGLE</span>
                  </button>
               </div>
            )}
         </div>
      </div>
   )
}

export default Modal
