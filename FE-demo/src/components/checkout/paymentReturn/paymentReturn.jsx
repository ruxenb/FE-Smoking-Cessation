import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../../userContext/userContext';
import './paymentReturn.css';

function PaymentReturnPage() {
  // Hook để đọc các query params từ URL (ví dụ: ?vnp_ResponseCode=00)
  const [searchParams] = useSearchParams();
  const { logout } = useUser();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, failed

  useEffect(() => {
    // Đọc mã phản hồi từ VNPay
    const responseCode = searchParams.get('vnp_ResponseCode');
    
    if (responseCode === '00') {
      setStatus('success');
    } else {
      // Bất kỳ mã nào khác '00' đều coi là thất bại
      setStatus('failed');
      const reason = searchParams.get('vnp_ResponseCode');
      console.error(`Payment failed with VNPay response code: ${reason}`);
    }
  }, [searchParams]);

  const handleReturnToLogin = () => {
      // QUAN TRỌNG:
      // Sau khi giao dịch, backend đã cập nhật status của membership.
      // Để frontend nhận được thông tin mới nhất, cách đáng tin cậy nhất là
      // bắt người dùng đăng nhập lại. Khi đó, API login sẽ trả về
      // object user đã được cập nhật với gói membership ACTIVE.
      logout(); // Xóa thông tin user cũ khỏi localStorage và context
      navigate('/login');
      toast.info("Please log in again to update your account status.", { autoClose: 5000 });
  };

  return (
    <div className="payment-return-container">
      <div className="payment-return-card">
        {status === 'processing' && (
          <>
            <div className="icon">⏳</div>
            <h1>Processing...</h1>
            <p>We are confirming your payment status. Please wait.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="icon success-icon">✅</div>
            <h1>Payment Successful!</h1>
            <p>Your membership has been upgraded. Please log in again to see the changes.</p>
            <button className="return-button" onClick={handleReturnToLogin}>
              Return to Login
            </button>
          </>
        )}
        {status === 'failed' && (
          <>
            <div className="icon error-icon">❌</div>
            <h1>Payment Failed</h1>
            <p>There was an issue with your payment. Please try again or contact our support.</p>
            <button className="return-button" onClick={() => navigate('/membership')}>
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentReturnPage;
