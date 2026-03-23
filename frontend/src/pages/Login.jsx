import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="container">
            <div className="auth-form">
                <h2 style={{textAlign: 'center'}}>Login</h2>
                <form onSubmit={onSubmit}>
                    <input type="email" placeholder="Email" required 
                           value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Password" required 
                           value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    <button type="submit" className="btn">Login</button>
                </form>
                <p style={{textAlign: 'center', marginTop: '15px'}}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
