import { Link, Outlet } from "react-router-dom";

export default function RootL(){


    return(


        <div>

  <Link to="/">home</Link>
  <Link to="about">bout</Link>
  <Outlet/>
        </div>
    )
}