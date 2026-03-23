document.getElementById('donateBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const amountInput = document.getElementById('amount').value;
    const amount = parseFloat(amountInput);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than 0");
        return;
    }

    // Create the UPI URL for the provided UPI ID
    // upi://pay?pa=7330648651-2@ybl&pn=Global%20Trust&am=[AMOUNT]&cu=INR
    const upiId = "7330648651-2@ybl";
    const upiUrl = `upi://pay?pa=${upiId}&pn=Global%20Donation&am=${amount}&cu=INR`;
    const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

    // Create Modal Overlay
    const overlay = document.createElement('div');
    overlay.id = 'qr-modal-overlay';
    Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(5px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999',
        opacity: '0', transition: 'opacity 0.3s'
    });

    // Create Modal Box
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        backgroundColor: '#fff', padding: '40px', borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)', textAlign: 'center',
        maxWidth: '400px', width: '90%', fontFamily: "'Poppins', sans-serif"
    });

    modal.innerHTML = `
        <h2 style="margin: 0 0 10px; color: #0f172a; font-size: 24px;">Scan to Donate</h2>
        <p style="color: #64748b; margin-bottom: 25px;">Scan this QR code using PhonePe, GPay, or Paytm to complete your strong donation of <strong>₹${amount}</strong>.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; display: inline-block; margin-bottom: 25px; border: 1px solid #e2e8f0;">
            <img src="${qrImageSrc}" alt="UPI QR Code" style="width: 200px; height: 200px; display: block; margin: 0 auto;">
        </div>
        <p style="color: #0f172a; font-weight: 600; margin-bottom: 20px;">UPI ID: ${upiId}</p>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="close-modal" style="background:#e2e8f0; color:#475569; padding: 12px 25px; border:none; border-radius:8px; font-weight:600; cursor:pointer;">Cancel</button>
            <button id="finish-modal" style="background:#f97316; color:white; padding: 12px 25px; border:none; border-radius:8px; font-weight:600; cursor:pointer; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">I Have Paid</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Fade in
    setTimeout(() => overlay.style.opacity = '1', 10);

    // Event Listeners for buttons
    document.getElementById('close-modal').addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => document.body.removeChild(overlay), 300);
    });

    document.getElementById('finish-modal').addEventListener('click', () => {
        modal.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
            <h2 style="color: #10b981; margin-bottom: 10px;">Payment Successful!</h2>
            <p style="color: #64748b; margin-bottom: 25px;">Thank you for your generous donation of ₹${amount}. Your support means everything to us.</p>
            <button id="success-close" style="background:#10b981; color:white; padding: 12px 30px; border:none; border-radius:8px; font-weight:600; cursor:pointer;">Back to Home</button>
        `;
        document.getElementById('success-close').addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => document.body.removeChild(overlay), 300);
            document.getElementById('amount').value = '';
        });
    });
});
