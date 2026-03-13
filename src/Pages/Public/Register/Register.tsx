import './Register.css'
import { PasswordMatch, PasswordStrength } from './Register.hooks'
import { useState } from 'react'
import { useAuth } from '../../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { register, login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true); // Default true so error doesn't show initially
    const [passwordStrength, setPasswordStrength] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        if (confirmPassword) setPasswordMatch(PasswordMatch(val, confirmPassword));
        setPasswordStrength(PasswordStrength(val));
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setConfirmPassword(val);
        setPasswordMatch(PasswordMatch(password, val));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!passwordMatch) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await register(email, password, username);
            // After successful registration, log them in automatically
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            console.error("Registration failed:", err);
            setError(err?.errors?.[0]?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="register-wrapper">
            <h1>Register</h1>
            {error && <p className="error" style={{color: 'red'}}>{error}</p>}
            <form className="register-form" onSubmit={handleSubmit}>
                <input 
                    className="std-input" type="text" placeholder="Username" required
                    value={username} onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    className="std-input" type="email" placeholder="Email" required
                    value={email} onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    className="std-input" type="password" placeholder="Password" required
                    value={password} onChange={handlePasswordChange}
                />
                <input 
                    className="std-input" type="password" placeholder="Confirm Password" required
                    value={confirmPassword} onChange={handleConfirmPasswordChange}
                />
                <button type="submit" className="std-button">Register</button>
            </form>
            <p>Password Strength: {passwordStrength}</p>
            {!passwordMatch && <p className="error" style={{color: 'red'}}>Passwords do not match</p>}
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );  
};

export default Register;
