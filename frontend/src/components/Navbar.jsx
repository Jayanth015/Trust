import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="brand">
                <Link to="/">Global Trust.</Link>
            </div>
            <div className="links">
                {token ? (
                    <>
                        <Link to="/history">My Donations</Link>
                        <button onClick={handleLogout} style={{background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontWeight: '600', fontSize: '15px'}}>Logout</button>
                        <Link to="/donate/general" className="donate-btn-nav">Donate Now</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                        <Link to="/donate/general" className="donate-btn-nav">Donate Now</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
