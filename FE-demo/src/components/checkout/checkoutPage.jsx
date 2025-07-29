import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../userContext/userContext';
import { toast } from 'react-toastify';
import dayjs from 'dayjs'; // Thư viện để xử lý ngày tháng
import { getAllMembershipPackages, initiatePurchase } from '../../services/membershipService'; 
import { createVnPayPayment } from '../../services/paymentService';
import './checkoutPage.css'; 

function Checkout() {
  const { planType } = useParams(); // Lấy 'advanced' từ URL
  const { user } = useUser(); // Lấy thông tin user
  const navigate = useNavigate(); // Dùng để chuyển hướng sau khi thanh toán
  // State để quản lý phương thức thanh toán được chọn
  const [packageDetails, setPackageDetails] = useState(null); // State để lưu thông tin gói
  const [isLoading, setIsLoading] = useState(true); // State để quản lý trạng thái loading
  const [isProcessing, setIsProcessing] = useState(false); // Thêm state để vô hiệu hóa nút khi đang xử lý

 

useEffect(() => {
    // Nếu chưa có thông tin user, không làm gì cả, chỉ đợi
    if (!user) {
      return;
    }

    // --- BƯỚC 2: KIỂM TRA ĐIỀU KIỆN TRUY CẬP TRƯỚC TIÊN ---
    // Nếu user đã có gói 'advanced', không cho phép vào trang checkout nữa
    if (user.membership && user.membership.status === 'ACTIVE') {
      toast.info("You already have the Advanced membership!");
      navigate('/dashboard', { replace: true });
      return; // Dừng useEffect ngay lập tức
    }

    // --- BƯỚC 3: MỘT HÀM DUY NHẤT ĐỂ LẤY THÔNG TIN GÓI ---
    const fetchActivePackage = async () => {
      try {
        // 1. Gọi API để lấy TẤT CẢ các gói
        const response = await getAllMembershipPackages();

        if (response.data?.status === "success") {
          const allPackages = response.data.data;
          
          // 2. Lọc ra gói trả phí (khác 0) và đang active
          const activePaidPackage = allPackages.find(pkg => pkg.active && pkg.price > 0);

          if (activePaidPackage) {
            setPackageDetails(activePaidPackage);
          } else {
            toast.error("The Advanced plan is currently not available.");
            navigate('/membership', { replace: true });
          }
        } else {
          throw new Error(response.data?.message || "Could not fetch membership details.");
        }
        
      } catch (error) {
        toast.error(error.message || "Could not fetch membership details. Please try again.");
        console.error("Failed to fetch package details:", error);
        navigate('/membership', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivePackage();

  }, [user, navigate, planType]); // Phụ thuộc vào user, navigate, và planType

  
  // --- HÀM TÍNH TOÁN THÔNG TIN (KHÔNG ĐỔI) ---
  const renderPlanInfo = () => {
    if (!packageDetails) return null;
    const startDate = dayjs();
    const renewalDate = startDate.add(packageDetails.durationInDays, 'day');
    const durationInMonths = Math.round(packageDetails.durationInDays / 30); 
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(packageDetails.price);

    return {
      priceText: `${formattedPrice}₫`,
      todayText: `Today: ${durationInMonths} months for ${formattedPrice}₫`,
      renewalText: `Starting ${renewalDate.format('MMM D, YYYY')}`,
      packageName: packageDetails.packageName,
    };
  };
  const planInfo = renderPlanInfo();

  
  // --- BƯỚC 4: HÀM XỬ LÝ THANH TOÁN 2 BƯỚC ---
  const handlePurchase = async () => {
    if (!packageDetails || !user) {
      toast.error("User or package information is missing.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Initiating your purchase...");

    try {
      const tokenType = localStorage.getItem("tokenType");
      const accessToken = localStorage.getItem("accessToken");
      const fullToken = `${tokenType} ${accessToken}`;

      // BƯỚC 4.1: Khởi tạo giao dịch, tạo bản ghi "PENDING"
      const purchasePayload = {
        userId: user.userId,
        membershipPackageId: packageDetails.id,
        paymentMethod: "VNPay",
      };
      const initResponse = await initiatePurchase(purchasePayload, fullToken);
      
      const pendingMembershipId = initResponse.data.data?.id;
      if (!pendingMembershipId) {
        throw new Error("Failed to get a transaction ID from the server.");
      }

      toast.update(toastId, { render: "Generating payment link..." });

      // BƯỚC 4.2: Tạo URL thanh toán với ID giao dịch đã có
      const vnPayPayload = { userMembershipId: pendingMembershipId };
      const paymentResponse = await createVnPayPayment(vnPayPayload, fullToken);
      
      const paymentUrl = paymentResponse.data.data;
      if (paymentResponse.data?.status === "Success" && paymentUrl) {
        toast.update(toastId, {
          render: "Redirecting to payment gateway...",
          type: "info",
          isLoading: false,
          autoClose: 3000,
        });
        window.location.href = paymentUrl; // Chuyển hướng
      } else {
        throw new Error(paymentResponse.data?.message || "Failed to create payment link!");
      }

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "An error occurred.";
      toast.update(toastId, { render: `Error: ${errorMsg}`, type: "error", isLoading: false, autoClose: 5000 });
      console.error("Purchase process failed:", error);
      setIsProcessing(false);
    }
  };


  // --- LUỒNG RENDER (KHÔNG ĐỔI) ---
  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.5rem' }}>Loading Checkout...</div>;
  }
  if (!packageDetails) {
    return <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.5rem' }}>Membership plan not found. Redirecting...</div>;
  }

    return (
      <> 
      
    <div className="checkout-container">
      <div className="checkout-content-wrapper">
        <header className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-header-user">
            {user && (
              <>
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                  alt="User Avatar"
                />
                <span>{user.username}</span>
              </>
            )}
          </div>
        </header>

        <main className="checkout-layout">
          <section className="checkout-main">
            <div className="checkout-section">
              <div className="plan-details-card">
                <div className="icon">⭐</div>
                <div className="plan-info">
                  <h3>{planInfo.packageName}</h3>
                  {/* Hiển thị động */}
                  <p>{planInfo.todayText}</p>
                  <p>{planInfo.renewalText}</p>
                </div>
                <div className="plan-price">
                  <strong>{planInfo.priceText}</strong> / month
                </div>
              </div>
            </div>

            <div className="checkout-section">
                {/* Phần chọn phương thức thanh toán không đổi */}
            </div>
          </section>

          <aside className="checkout-summary">
            <div className="summary-card">
              <h2>Summary</h2>
              <div className="summary-total">
                <span>Total now</span>
                <span>{planInfo.priceText}</span>
              </div>
              {/* Vô hiệu hóa nút khi đang xử lý để tránh click nhiều lần */}
              <button className="purchase-button" onClick={handlePurchase} disabled={isProcessing}>
                Complete Purchase
              </button>
            </div>
          </aside>
        </main>
      </div>
    </div>
    </>
  );
}


export default Checkout;