import './Register.css'
import { PasswordMatch, PasswordStrength } from './Register.hooks'
import { useState } from 'react'

const Register = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState('')

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        setPasswordMatch(PasswordMatch(e.target.value, confirmPassword))
        setPasswordStrength(PasswordStrength(e.target.value))
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value)
        setPasswordMatch(PasswordMatch(password, e.target.value))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        //TODO:Need to add backend integration
        //TODO: Need to make sure all information is there 
    }

    return (
        <div className="register-wrapper">
            <h1>Register</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <input className="std-input" type="text" placeholder="Username" />
                <input className="std-input" type="email" placeholder="Email" />
                <input className="std-input" type="password" placeholder="Password" onChange={handlePasswordChange}/>
                <input className="std-input" type="password" placeholder="Confirm Password" onChange={handleConfirmPasswordChange}/>
                <button type="submit" className="std-button">Register</button>
            </form>
            <p>Password Strength: {passwordStrength}</p>
            {passwordMatch ? '' : <p className="error">Passwords do not match</p>}
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );  
};

export default Register;
