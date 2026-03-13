import { Link } from "react-router-dom"
import {useAuth} from "../../Contexts/AuthContext"
import { useNavigate } from "react-router-dom"

//Header Logo
export const HeaderLeft = () =>{
  const {user} = useAuth()
  return(
    <Link to={user ? '/dashboard' : '/'} className="HeaderLeftLogo">Iter Viae</Link>
  )
}



export const HeaderMiddle = () =>{
  return(
    <div className="HeaderMiddleWrapper">
      <p><Link to='/about'>About</Link></p>

    </div>
  )
}



export const HeaderRight = () =>{
  const {user, logout} = useAuth()
  const navigate = useNavigate()
  return(
    <div className="HeaderRightWrapper">
      {user ? (
        <button className="std-button" onClick={() => logout()}>Logout</button>
      ) : (
        <button className="std-button" onClick={() => navigate('/login')}>Login</button>
      )}
    </div>
  )
}