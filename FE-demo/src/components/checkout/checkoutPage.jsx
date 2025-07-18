import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../userContext/userContext';
import { toast } from 'react-toastify';
import dayjs from 'dayjs'; // Thư viện để xử lý ngày tháng
import { getMembershipPackageById, initiatePurchase } from '../../services/membershipService'; 
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

  // Nếu chưa có thông tin user, không làm gì cả và đợi lần render sau
    if (!user) {
      return;
    }

    // --- LOGIC 1: KIỂM TRA MEMBERSHIP HIỆN TẠI CỦA USER ---
    // 1. Xác định trạng thái membership của user, giống hệt trang MembershipPage
    let subscriptionStatus = 'basic'; // Mặc định là basic khi đã có user
    if (user.membership && user.membership.status === 'ACTIVE') {
      subscriptionStatus = 'advanced';
    }

    // 2. Kiểm tra điều kiện truy cập
    // Nếu user đã là 'advanced', không cho phép vào trang checkout nữa
    if (subscriptionStatus === 'advanced') {
      toast.info("You already have the Advanced membership!");
      navigate('/dashboard', { replace: true });
      return;
    }

    // Hàm để gọi API
    const fetchPackageDetails = async () => {
      // Giả định mapping từ planType (URL) sang packageId (database)
      // Cần điều chỉnh cho phù hợp với ID thực tế trong DB
      const packageIdMap = {
        advanced: 2, // 'advanced' tương ứng với PackageID = 1
      };
      const packageId = packageIdMap[planType];

      if (!packageId) {
        toast.error("Invalid membership plan.");
        navigate('/membership');
        return;
      }
      
      try {
        const tokenType = localStorage.getItem("tokenType");
        const accessToken = localStorage.getItem("accessToken");
        const fullToken = `${tokenType} ${accessToken}`;
        
        const response = await getMembershipPackageById(packageId, fullToken);
        setPackageDetails(response.data.data);
      } catch (error) {
        toast.error("Could not fetch membership details. Please try again.");
        console.error("Failed to fetch package details:", error);
        navigate('/membership');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageDetails();

  }, [user, navigate, planType]);

  
  

  // --- LOGIC 2: TÍNH TOÁN NGÀY VÀ GIÁ ĐỂ HIỂN THỊ ---
  const renderPlanInfo = () => {
    if (!packageDetails) return null;

    const startDate = dayjs();
    const renewalDate = startDate.add(packageDetails.durationInDays, 'day');
    // Chuyển đổi số ngày thành số tháng (làm tròn) để hiển thị
    const durationInMonths = Math.round(packageDetails.durationInDays / 30); 
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(packageDetails.price);

    return {
      priceText: `${formattedPrice}₫`,
      todayText: `Today: ${durationInMonths} months for ${formattedPrice}₫`,
      renewalText: `Starting ${renewalDate.format('MMM D, YYYY')}: ${formattedPrice}₫/month`,
      packageName: packageDetails.packageName,
    };
  };

  


  const planInfo = renderPlanInfo();

  console.log("planInfo:", planInfo);

  const handlePurchase = async () => {
    if (!packageDetails || !user) {
      toast.error("User or package information is missing.");
      return;
    }

    // Hiển thị thông báo cho người dùng biết hệ thống đang xử lý
    setIsProcessing(true); // Bắt đầu xử lý, vô hiệu hóa nút
    const toastId = toast.loading("Processing your request...");

    try {
      const tokenType = localStorage.getItem("tokenType");
      const accessToken = localStorage.getItem("accessToken");
      const fullToken = `${tokenType} ${accessToken}`;

      // --- BƯỚC 1: KHỞI TẠO GIAO DỊCH, TẠO BẢN GHI "PENDING" ---
      // Chuẩn bị payload cho API backend theo UserMembershipDto
      const purchasePayload = {
        userId: user.userId,
        membershipPackageId: packageDetails.id,
        paymentMethod: "VNPay",
      };
      const initResponse = await initiatePurchase(purchasePayload, fullToken);
            
      // Lấy ID của bản ghi UserMembership vừa tạo
      const pendingMembershipId = initResponse.data.data?.id;

      if (!pendingMembershipId) {
        throw new Error("Failed to get a transaction ID.");
      }

      toast.update(toastId, { render: "Generating payment link..." });

       // --- BƯỚC 2: TẠO URL THANH TOÁN VỚI ID GIAO DỊCH ĐÃ CÓ ---
      const vnPayPayload = {
        userMembershipId: pendingMembershipId
      };
      const paymentResponse = await createVnPayPayment(vnPayPayload, fullToken);

      if (paymentResponse.data?.status === "Success" && paymentResponse.data?.data) {
        const paymentUrl = paymentResponse.data.data;
        toast.update(toastId, {
          render: "Redirecting to payment gateway...",
          type: "info",
          isLoading: false,
          autoClose: 3000,
        });
        window.location.href = paymentUrl; // Chuyển hướng
        } else {
          const errorMsg = paymentResponse.data?.message || "Failed to create payment link!";
          throw new Error(errorMsg);
        }
         } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "An error occurred.";
            toast.update(toastId, { render: `Error: ${errorMsg}`, type: "error", isLoading: false, autoClose: 5000 });
            console.error("Purchase process failed:", error);
            setIsProcessing(false); // Kích hoạt lại nút nếu có lỗi
        }
  };


  // --- QUẢN LÝ LUỒNG RENDER ---
  // 1. Luôn hiển thị loading cho đến khi tất cả logic trong useEffect hoàn tất
  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.5rem' }}>Loading Checkout...</div>;
  }

  // 2. Sau khi loading xong, nếu không có packageDetails (do lỗi API), hiển thị thông báo
  if (!packageDetails) {
    return <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.5rem' }}>Membership plan not found.</div>;
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