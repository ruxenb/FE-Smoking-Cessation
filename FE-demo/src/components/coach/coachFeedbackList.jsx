import React, { useEffect, useState } from 'react';
import { useUser } from '../../userContext/userContext'; 
import { Table, Spin, Alert, Rate, Tag } from 'antd'; 
import { getFeedbacksByReceiverId } from '../../services/feedbackService';
import { toast } from 'react-toastify';

function CoachFeedbackPage() {
    const { user } = useUser();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const tokenType = localStorage.getItem("tokenType");
    const accessToken = localStorage.getItem("accessToken");
    const fullToken = tokenType && accessToken ? `${tokenType} ${accessToken}` : null;

    useEffect(() => {
        const fetchFeedbacks = async () => {
            if (!user?.userId) {
                setError("User ID not found. Please log in.");
                setLoading(false);
                return;
            }
            
            if (!fullToken) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await getFeedbacksByReceiverId(user.userId, fullToken); 
                
                if (response.status === 200) {
                    // Ant Design Table yêu cầu key duy nhất cho mỗi hàng
                    // Đảm bảo data.map có một key 'id' hoặc tạo ra nó nếu không có
                    const formattedData = response.data.data.map(item => ({
                        ...item,
                        key: item.id // Sử dụng id của feedback làm key
                    }));
                    setFeedbacks(formattedData);
                } else {
                    const errorMessage = response.data?.message || "Failed to fetch feedbacks.";
                    setError(errorMessage);
                    toast.error(errorMessage, { theme: "dark", position: "top-left" });
                }
            } catch (err) {
                console.error("Error fetching feedbacks:", err);
                let errorMessage = "An error occurred while fetching feedbacks.";
                if (err.response) {
                    errorMessage = err.response.data?.message || err.response.statusText;
                    if (err.response.status === 401 || err.response.status === 403) {
                        errorMessage = "You are not authorized to view this content. Please log in.";
                    } else if (err.response.status === 404) {
                        errorMessage = "No feedbacks found or endpoint not available.";
                    }
                } else if (err.request) {
                    errorMessage = "Network error. Please check your internet connection.";
                } else {
                    errorMessage = err.message;
                }
                setError(errorMessage);
                toast.error(errorMessage, { theme: "dark", position: "top-left" });
            } finally {
                setLoading(false);
            }
        };

        // Chỉ fetch khi component được mở (currentPage === 'received-feedback')
        // hoặc khi user.id và fullToken đã có
        if (open || (user?.id && fullToken)) { // Tùy chỉnh điều kiện fetch
             fetchFeedbacks();
        }
       
    }, [user, fullToken, open]); // Thêm 'open' vào dependency array nếu bạn muốn re-fetch khi modal mở lại

    const columns = [
        {
            title: 'From User',
            dataIndex: 'userName',
            key: 'userName',
            width: '25%',
            render: (text) => text || "N/A" // Hiển thị "N/A" nếu subject không có
        },
        {
            title: 'Feedback',
            dataIndex: 'body',
            key: 'body',
            width: '40%',
            ellipsis: true, // Thêm ellipsis nếu nội dung quá dài
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: '15%',
            render: (rating) => <Rate disabled allowHalf defaultValue={rating} />,
            sorter: (a, b) => a.rating - b.rating,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '10%',
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" tip="Loading feedbacks..." />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="coach-feedback-page">
            <h2>My Received Feedback</h2>
            <Table 
                columns={columns} 
                dataSource={feedbacks} 
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }} 
            />
        </div>
    );
}

export default CoachFeedbackPage;