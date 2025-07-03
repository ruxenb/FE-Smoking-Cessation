import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../userContext/userContext';
import './paymentReturn.css';

function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const { logout } = useUser();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, failed

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode');
    
    if (responseCode === '00') {
      setStatus('success');
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  const handleReturn = () => {
      // Quan trọng: Sau khi giao dịch, bắt người dùng đăng nhập lại để lấy JWT mới
      // và thông tin user đã được cập nhật (với gói membership mới)
      logout();
      navigate('/login');
      toast.info("Please log in again to update your account status.");
  };

  return (
    <div className="payment-return-container">
      <div className="payment-return-card">
        {status === 'success' && (
          <>
            <div className="icon success-icon">✅</div>
            <h1>Payment Successful!</h1>
            <p>Your membership has been upgraded. Please log in again to see the changes.</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <div className="icon error-icon">❌</div>
            <h1>Payment Failed</h1>
            <p>There was an issue with your payment. Please try again or contact support.</p>
          </>
        )}
        <button className="purchase-button" onClick={handleReturn}>
          Return to Login
        </button>
      </div>
    </div>
  );
}

export default PaymentReturnPage;