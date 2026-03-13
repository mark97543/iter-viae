import { Link } from "react-router-dom"
import {useAuth} from "../../Contexts/AuthContext"
import { useNavigate } from "react-router-dom"

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
      <p><Link to='/about'>About</Link></p>

    </div>
  )
}

//TODO: Remove Template Items 

export const HeaderRight = () =>{
  const {user, logout} = useAuth()
  const navigate = useNavigate()
  return(
    <div className="HeaderRightWrapper">
      {/* TODO: Make this conditional rendor based on user loggin status */}
      {/* TODO: Make this link to login page */}
      {user ? (
        <button className="std-button" onClick={() => logout()}>Logout</button>
      ) : (
        <button className="std-button" onClick={() => navigate('/login')}>Login</button>
      )}
    </div>
  )
}