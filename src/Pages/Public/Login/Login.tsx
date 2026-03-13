import './Login.css';
import { useAuth } from '../../../Contexts/AuthContext';


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submit triggered with values:", email, password);
        setError('');
        
        try {
            await login(email, password);
            console.log("Login successful");
            navigate('/dashboard');
        } catch (err: any) {
            console.error("Login Error details:", err?.errors || err);
            setError('Invalid email or password. If you already Registered Please wait for your profile to be approved.');
        }
    };


    return (
        <div className="login">
            <h1>Login</h1>
            {error && <p className="error" style={{color: 'red'}}>{error}</p>}
            
            <form className="login-form" onSubmit={handleSubmit}>
                <input 
                    className="std-input" 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    className="std-input" 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="std-button">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    );

};

export default Login;



