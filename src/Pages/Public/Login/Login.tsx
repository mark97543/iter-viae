import './Login.css';


const Login = () => {
    return (
        <div className="login">
            <h1>Login</h1>
            <form className="login-form">
                <input className="std-input" type="text" placeholder="Username" />
                <input className="std-input" type="password" placeholder="Password" />
                <button type="submit" className="std-button">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    );
};

export default Login;

// TODO: Need to make login button submit user form data

