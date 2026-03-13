import './NotFound.css';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found-wrapper">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="std-button">Go Home</Link>
        </div>
    );
};

export default NotFound;
