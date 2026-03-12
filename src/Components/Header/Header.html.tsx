import { Link } from "react-router-dom"

//Header Logo
export const HeaderLeft = () =>{
  return(
    <Link to='/' className="HeaderLeftLogo">Iter Viae</Link>
  )
}

//TODO: Need this to go to dashboard once user is logged in,. 

export const HeaderMiddle = () =>{
  return(
    <div className="HeaderMiddleWrapper">
      {/* <p><Link to='/'>Link 1</Link></p> */}

    </div>
  )
}

//TODO: Remove Template Items 

export const HeaderRight = () =>{
  return(
    <div className="HeaderRightWrapper">
      {/* TODO: Make this conditional rendor based on user loggin status */}
      <button className="std-button">Login</button>
    </div>
  )
}