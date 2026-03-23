import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            alert(res.data.message);
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="container">
            <div className="auth-form">
                <h2 style={{textAlign: 'center'}}>Register</h2>
                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="Name" required 
                           value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email" required 
                           value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Password" required 
                           value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    <button type="submit" className="btn">Register</button>
                </form>
                <p style={{textAlign: 'center', marginTop: '15px'}}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
