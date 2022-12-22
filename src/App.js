import "./App.css"
import { BrowserRouter, Route } from "react-router-dom"
import { Header } from "./components/Header"
import { CoinPage } from "./components/CoinPage"
import { HomePage } from "./components/HomePage"
import SnackbarProvider from "react-simple-snackbar"
import SideBar from "./components/SideBar"
import News from "./components/News"
function App() {
   return (
      <SnackbarProvider>
         <BrowserRouter>
            <div className="App dark">
               <Header />
               <Route path="/" component={HomePage} exact />
               <Route path="/coins/:id" component={CoinPage} />
               <Route path="/news" component={News} />
            </div>
         </BrowserRouter>
      </SnackbarProvider>
   )
}

export default App
