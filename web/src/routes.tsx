import React from "react"

import Home from "./pages/Home"
import CreatePoint from "./pages/CreatePoint"

import {Route, BrowserRouter} from "react-router-dom";


const Routes : React.FC = () => {
  return ( <BrowserRouter>
    <Route component={Home}  exact path="/"></Route>
    <Route component={CreatePoint} path="/create-point"></Route>

     </BrowserRouter>  
  
  )

}

export default Routes