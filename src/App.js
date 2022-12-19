import "./App.css"
import { BrowserRouter, Route } from "react-router-dom"
import { Header } from "./components/Header"
import { CoinPage } from "./components/CoinPage"
import { HomePage } from "./components/HomePage"
function App() {
   return (
      <BrowserRouter>
         <div className="App dark">
            <Header />
            <Route path="/" component={HomePage} exact />
            <Route path="/coins/:id" component={CoinPage} />
         </div>
      </BrowserRouter>
   )
}

export default App
