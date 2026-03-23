import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import MockRazorpayModal from '../components/MockRazorpayModal';

const DonationPage = () => {
    const { id } = useParams();
    const [cause, setCause] = useState(null);
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [showMockModal, setShowMockModal] = useState(false);
    const [mockOrderDetails, setMockOrderDetails] = useState(null);

    useEffect(() => {
        if (id === 'general') return;
        const fetchCause = async () => {
            try {
                const res = await api.get('/causes');
                const c = res.data.find(c => c._id === id);
                setCause(c);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCause();
    }, [id]);

    const generateQRCode = () => {
        if (!amount || amount <= 0) return alert('Enter a valid amount first');
        // Standard UPI Intent format
        const upiLink = `upi://pay?pa=7330648651-2@ybl&pn=Donation%20Platform&am=${amount}&cu=INR`;
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`);
    };

    const handleMockPaymentVerify = async () => {
        try {
            // Mocking the completion for the QR code flow to update the history
            await api.post('/payments/donate', {
                causeId: id === 'general' ? null : id,
                amount,
                paymentId: 'QR_TEST_' + Math.floor(Math.random() * 1000000)
            });
            alert('Payment tracked successfully!');
            navigate('/history');
        } catch (err) {
            console.error(err);
        }
    };

    const handleRazorpay = async () => {
        if (!amount || amount <= 0) return alert('Enter a valid amount');
        
        try {
            // 1. Create order
            const orderRes = await api.post('/payments/create-order', { amount });
            const order = orderRes.data;

            // Fetch razorpay key from backend
            const keyRes = await api.get('/payments/key');
            const razorpayKey = keyRes.data.key;
            
            if (razorpayKey === 'rzp_test_YOUR_KEY_ID') {
                // Keys are not real, open the visual mock modal
                setMockOrderDetails(order);
                setShowMockModal(true);
                return;
            }

            // 2. Open Razorpay
            const options = {
                key: razorpayKey, // Dynamically loaded from backend .env
                amount: order.amount,
                currency: order.currency,
                name: "Donation Platform",
                description: `Donation for ${cause ? cause.title : 'Cause'}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await api.post('/payments/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.verified) {
                            // 4. Save Donation
                            await api.post('/payments/donate', {
                                causeId: id === 'general' ? null : id,
                                amount,
                                paymentId: response.razorpay_payment_id
                            });
                            alert('Payment successful and donation saved!');
                            navigate('/history');
                        }
                    } catch (err) {
                        alert('Payment verification failed');
                    }
                },
                theme: { color: "#007bff" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();

        } catch (err) {
            console.error(err);
            alert('Error creating Razorpay order. Ensure your Razorpay API Keys are correctly configured in the backend .env file and frontend code.');
        }
    };

    return (
        <div className="container" style={{display: 'flex', justifyContent: 'center', marginTop: '40px'}}>
            <div className="auth-form" style={{maxWidth: '500px', width: '100%', padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)'}}>
                <h2 style={{textAlign: 'center', color: '#333'}}>{id === 'general' ? 'General Donation' : 'Donate to Cause'}</h2>
                {cause && <h3 style={{textAlign: 'center', color: '#666', marginBottom: '25px'}}>{cause.title}</h3>}
                
                <div style={{marginTop: '20px'}}>
                    <label style={{display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold'}}>Donation Amount (INR)</label>
                    <input type="number" placeholder="Enter amount..." min="1" step="1"
                           value={amount} onChange={e => { setAmount(e.target.value); setQrCodeUrl(''); }} 
                           style={{width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '16px', marginBottom: '20px', boxSizing: 'border-box'}} />
                    
                    <button onClick={generateQRCode} style={{width: '100%', padding: '14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', transition: 'background-color 0.2s'}}>
                        Generate UPI QR Code
                    </button>
                    
                    <button onClick={handleRazorpay} style={{width: '100%', padding: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s'}}>
                        Pay via Razorpay
                    </button>
                </div>

                {qrCodeUrl && (
                    <div style={{marginTop: '30px', textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px'}}>
                        <h4 style={{color: '#333'}}>Scan to Pay ₹{amount}</h4>
                        <img src={qrCodeUrl} alt="UPI QR Code" style={{margin: '15px 0', border: '1px solid #ddd', padding: '10px', backgroundColor: 'white'}} />
                        <p style={{fontSize: '14px', color: '#666'}}>After completing the payment on your UPI app, click below.</p>
                        <button onClick={handleMockPaymentVerify} style={{marginTop: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                            I have paid
                        </button>
                    </div>
                )}
            </div>

            {showMockModal && mockOrderDetails && (
                <MockRazorpayModal 
                    amount={mockOrderDetails.amount}
                    description={`Donation for ${cause ? cause.title : 'Cause'}`}
                    onClose={() => setShowMockModal(false)}
                    onSuccess={async (response) => {
                        setShowMockModal(false);
                        try {
                            const verifyRes = await api.post('/payments/verify-payment', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });
                            if (verifyRes.data.verified) {
                                await api.post('/payments/donate', {
                                    causeId: id === 'general' ? null : id,
                                    amount,
                                    paymentId: response.razorpay_payment_id
                                });
                                alert('Payment successful and donation saved!');
                                navigate('/history');
                            }
                        } catch (err) {
                            alert('Payment verification failed');
                        }
                    }}
                />
            )}
        </div>
    );
};

export default DonationPage;
