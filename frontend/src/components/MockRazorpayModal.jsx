import React, { useState } from 'react';

const MockRazorpayModal = ({ amount, description, onSuccess, onClose }) => {
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePay = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setTimeout(() => {
                onSuccess({
                    razorpay_order_id: 'order_mock_' + Math.floor(Math.random() * 1000000),
                    razorpay_payment_id: 'pay_mock_' + Math.floor(Math.random() * 1000000),
                    razorpay_signature: 'mock_signature'
                });
            }, 1000);
        }, 2000);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999, fontFamily: 'sans-serif'
        }}>
            <div style={{
                background: 'white', width: '380px', borderRadius: '8px', overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative'
            }}>
                <div style={{ background: '#007bff', padding: '20px', color: 'white' }}>
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', 
                        color: 'white', fontSize: '20px', cursor: 'pointer'
                    }}>✕</button>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Donation Platform</h3>
                    <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>{description}</p>
                    <div style={{ marginTop: '15px', fontSize: '24px', fontWeight: 'bold' }}>
                        ₹{amount / 100}
                    </div>
                </div>
                
                <div style={{ padding: '20px' }}>
                    {success ? (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: '#28a745' }}>
                            <div style={{ fontSize: '50px', marginBottom: '10px' }}>✓</div>
                            <h3 style={{ margin: 0 }}>Payment Successful</h3>
                            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Redirecting...</p>
                        </div>
                    ) : processing ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#007bff' }}>
                            <div className="spinner" style={{
                                width: '40px', height: '40px', border: '4px solid #f3f3f3',
                                borderTop: '4px solid #007bff', borderRadius: '50%', margin: '0 auto',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                            <p style={{ marginTop: '15px', fontWeight: 'bold' }}>Processing Payment...</p>
                            <p style={{ color: '#666', fontSize: '12px' }}>Please do not close this window</p>
                        </div>
                    ) : (
                        <div>
                            <p style={{ color: '#555', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>Select Payment Method</p>
                            
                            <div style={{ border: '1px solid #ddd', borderRadius: '6px', marginBottom: '15px' }}>
                                <div style={{ padding: '15px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#f9f9f9' }}>
                                    <span style={{ fontSize: '20px', marginRight: '10px' }}>💳</span>
                                    <span style={{ fontWeight: '500' }}>Card (Test Mode)</span>
                                </div>
                                <div style={{ padding: '15px' }}>
                                    <input type="text" placeholder="Card Number" defaultValue="4111 1111 1111 1111" readOnly 
                                        style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input type="text" placeholder="MM/YY" defaultValue="12/28" readOnly 
                                            style={{ width: '50%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                        <input type="text" placeholder="CVV" defaultValue="123" readOnly 
                                            style={{ width: '50%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    </div>
                                </div>
                            </div>

                            <button onClick={handlePay} style={{
                                width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white',
                                border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
                            }}>
                                Pay ₹{amount / 100} securely
                            </button>
                            <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '15px' }}>
                                🔒 Secured by MockGateway
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MockRazorpayModal;
