import { createBrowserRouter } from "react-router";
import Mainlayout from "../Layout/Mainlayout";
import Home from "../Pages/Home";

 export const router=createBrowserRouter([
    {path:'/', element:<Mainlayout/>,
        children:[
            {path:'/',element:<Home></Home>}
        ]
    }
])