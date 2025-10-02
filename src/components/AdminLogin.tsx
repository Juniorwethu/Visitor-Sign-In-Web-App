import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AdminLogin.css';

// This password should be stored securely in an environment variable.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'password123';

const AdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Incorrect password.');
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-box">
                <Link to="/" className="back-to-home-link">&#x2190; Back to Home</Link>
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
