import React, { useEffect, useState } from 'react';
import api from '../api';

const History = () => {
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/payments/history');
                setDonations(res.data);
            } catch (err) {
                console.error("Error fetching history", err);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="container">
            <h2 style={{textAlign: 'center'}}>My Donations</h2>
            <div style={{marginTop: '30px', overflowX: 'auto'}}>
                {donations.length === 0 ? <p style={{textAlign: 'center'}}>You haven't made any donations yet.</p> : (
                    <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px'}}>
                        <thead>
                            <tr style={{backgroundColor: '#333', color: 'white', textAlign: 'left'}}>
                                <th style={{padding: '12px'}}>Date</th>
                                <th style={{padding: '12px'}}>Cause</th>
                                <th style={{padding: '12px'}}>Amount (INR)</th>
                                <th style={{padding: '12px'}}>Payment ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map(d => (
                                <tr key={d._id} style={{borderBottom: '1px solid #ddd'}}>
                                    <td style={{padding: '12px'}}>{new Date(d.createdAt).toLocaleDateString()}</td>
                                    <td style={{padding: '12px'}}>{d.causeId?.title || 'General Donation'}</td>
                                    <td style={{padding: '12px', fontWeight: 'bold', color: '#007bff'}}>₹{d.amount}</td>
                                    <td style={{padding: '12px'}}>{d.paymentId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default History;
