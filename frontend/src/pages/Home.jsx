import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [causes, setCauses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCauses = async () => {
            try {
                const res = await api.get('/causes');
                setCauses(res.data);
            } catch (err) {
                console.error("Error fetching causes", err);
            }
        };
        fetchCauses();
    }, []);

    const handleDonateClick = (causeId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to donate');
            navigate('/login');
        } else {
            navigate(`/donate/${causeId}`);
        }
    };

    return (
        <div>
            {/* 1. Hero Section */}
            <div className="hero">
                <h1>Donate with Confidence</h1>
                <p>Safe, secure, and 100% transparent. Be the reason someone smiles today.</p>
                <button className="cta-btn" onClick={() => handleDonateClick('general')}>Start Donating Today</button>
            </div>

            <div className="container">
                {/* 2. Trust Indicators (Security Section) */}
                <div className="trust-bar">
                    <div className="trust-item">
                        <div className="trust-icon">🛡️</div>
                        <div>
                            <div className="trust-text">Verified NGO</div>
                            <div className="trust-subtext">Government registered</div>
                        </div>
                    </div>
                    <div className="trust-item">
                        <div className="trust-icon">🔒</div>
                        <div>
                            <div className="trust-text">Secure Payments</div>
                            <div className="trust-subtext">SSL & 256-bit encryption</div>
                        </div>
                    </div>
                    <div className="trust-item">
                        <div className="trust-icon">👥</div>
                        <div>
                            <div className="trust-text">Trusted by 10,000+</div>
                            <div className="trust-subtext">Donors worldwide</div>
                        </div>
                    </div>
                    <div className="trust-item">
                        <div className="trust-icon">👁️</div>
                        <div>
                            <div className="trust-text">100% Transparent</div>
                            <div className="trust-subtext">See where money goes</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. How It Works Section */}
            <div className="bg-light section-padding" style={{marginTop: '60px'}}>
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">Making an impact is easier than you think. Follow these simple steps.</p>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Choose a Cause</h3>
                            <p>Browse through our verified campaigns and pick a cause that resonates with your heart.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Donate Securely</h3>
                            <p>Make a quick, safe payment using UPI, Credit Card, or Netbanking securely.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Track Impact</h3>
                            <p>Receive regular updates detailing exactly how your money is changing lives on the ground.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Causes Grid Selection */}
            <div className="container section-padding">
                <h2 className="section-title">Urgent Causes</h2>
                <p className="section-subtitle">Every rupee matters. Support these active campaigns today.</p>
                <div className="causes-grid">
                    {causes.map((cause, idx) => {
                        // Mocking progress for visual template feel
                        const progress = Math.min(100, 30 + (idx * 25));
                        const raisedAmount = (cause.targetAmount * progress) / 100;
                        return (
                        <div className="card" key={cause._id}>
                            {cause.image && <img src={cause.image} alt={cause.title} loading="lazy" />}
                            <div className="card-content">
                                <h3>{cause.title}</h3>
                                <p>{cause.description}</p>
                                
                                <div className="progress-container">
                                    <div className="progress-stats">
                                        <span className="raised-amt">₹{raisedAmount.toLocaleString()} raised</span>
                                        <span>₹{cause.targetAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{width: `${progress}%`}}></div>
                                    </div>
                                </div>

                                <button className="btn" onClick={() => handleDonateClick(cause._id)}>Donate Now</button>
                            </div>
                        </div>
                    )})}
                    {causes.length === 0 && <p style={{textAlign: 'center', width: '100%', color: '#64748b'}}>No active campaigns right now.</p>}
                </div>
            </div>

            {/* 5. Transparency / Stats Banner */}
            <div className="stats-section">
                <div className="container">
                    <h2 style={{color: 'white', marginBottom: '50px'}}>Our Global Impact</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <h2>₹20M+</h2>
                            <p>Total Funds Raised</p>
                        </div>
                        <div className="stat-item">
                            <h2>50,000+</h2>
                            <p>Generous Donors</p>
                        </div>
                        <div className="stat-item">
                            <h2>120</h2>
                            <p>Campaigns Completed</p>
                        </div>
                        <div className="stat-item">
                            <h2>25</h2>
                            <p>Countries Reached</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Testimonials */}
            <div className="bg-light section-padding">
                <div className="container">
                    <h2 className="section-title">What Our Donors Say</h2>
                    <p className="section-subtitle">Real reviews from people who are making a difference every day.</p>
                    <div className="test-grid">
                        <div className="test-card">
                            <p className="test-text">"I love how transparent this platform is. I can see exactly where my money is going, and the updates are heartwarming!"</p>
                            <div className="test-author">
                                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80" alt="Donor" className="test-author-img"/>
                                <div>
                                    <h4>Priya Sharma</h4>
                                    <span>Monthly Donor</span>
                                </div>
                            </div>
                        </div>
                        <div className="test-card">
                            <p className="test-text">"The payment process was so smooth and secure. Using the QR code to instantly donate via UPI was super convenient."</p>
                            <div className="test-author">
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80" alt="Donor" className="test-author-img"/>
                                <div>
                                    <h4>Raj Patel</h4>
                                    <span>Supported Education Fund</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 7. FAQ */}
            <div className="container section-padding">
                <h2 className="section-title">Frequently Asked Questions</h2>
                <div className="faq-list">
                    <div className="faq-item">
                        <h4>Is my payment safe?</h4>
                        <p>Yes, absolutely. We use industry standard 256-bit encryption and partner with globally trusted payment gateways to ensure your card details are never compromised.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Where does my money go?</h4>
                        <p>100% of public donations directly fund the verified projects. We operate our overheads through an independent private trust. You will receive impact reports via email.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Are donations tax-deductible?</h4>
                        <p>Yes, all donations made are eligible for 80G tax benefits under Indian government regulations. Your receipt will be automatically emailed to you.</p>
                    </div>
                </div>
            </div>

            {/* 8. Footer */}
            <footer>
                <div className="footer-grid">
                    <div className="footer-col">
                        <h3>Global Trust.</h3>
                        <p>123 Philanthropy Blvd,<br/>New Delhi, India 110001</p>
                        <p>📞 +91 98765 43210</p>
                        <p>✉️ support@globaltrust.org</p>
                    </div>
                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <a href="#">About Us</a>
                        <a href="#">All Campaigns</a>
                        <a href="#">Financial Reports</a>
                        <a href="#">Privacy Policy</a>
                    </div>
                    <div className="footer-col">
                        <h3>Social Connect</h3>
                        <a href="#">📘 Facebook</a>
                        <a href="#">🐦 Twitter</a>
                        <a href="#">📸 Instagram</a>
                        <a href="#">💼 LinkedIn</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; 2026 Global Donation Trust. All rights reserved. Registered NGO #89432.
                </div>
            </footer>
        </div>
    );
};

export default Home;
