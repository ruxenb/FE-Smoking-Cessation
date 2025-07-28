import React, { useState } from 'react';
import { Button, Modal, Form, Input, Rate } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
// Import service mới thay vì axios trực tiếp
import { submitFeedback } from '../../services/feedbackService'; 
import { toast } from 'react-toastify';

function FeedbackForm({ userId, receiverId = 0, open, onClose, receiverName }) { 
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const tokenType = localStorage.getItem("tokenType");
    const accessToken = localStorage.getItem("accessToken");
    const fullToken = tokenType && accessToken ? `${tokenType} ${accessToken}` : null;
    
    const modalTitle = React.useMemo(() => {
        if (receiverId === 0) {
            return "Feedback on Our System";
        } else if (receiverName) {
            return `Feedback for Coach: ${receiverName}`;
        }
        return "Submit Feedback"; // Fallback title
    }, [receiverId, receiverName]);

    const handleCancel = () => {
        onClose(); 
        form.resetFields();
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const submitData = {
                userId: userId, 
                receiverId: receiverId, 
                subject: modalTitle, // Sử dụng modalTitle làm subject
                body: values.body,
                rating: values.rating || 0,
            };

            // Gọi hàm từ service feedbackService
            const response = await submitFeedback(submitData, fullToken); 
            
            if (response.status === 201 || response.status === 200) {
                toast.success("Feedback submitted successfully!", {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    toastClassName: "success-toast",
                });
                handleCancel(); 
            } else {
                // Trường hợp API trả về status khác 200/201 nhưng không ném lỗi (ít xảy ra với Axios)
                const result = response.data;
                const errorMessage = result?.message || "An unexpected error occurred from the server.";
                toast.error(errorMessage, { theme: "dark", position: "top-left" });
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);

            let errorMessageForToast = "An unexpected error occurred. Please try again later!";

            if (error.response) {
                // Lỗi từ server (có phản hồi HTTP)
                if (error.response.data && typeof error.response.data === 'string') {
                    errorMessageForToast = error.response.data;
                } else if (error.response.data && error.response.data.message) {
                    errorMessageForToast = error.response.data.message;
                } else if (error.response.status === 400) {
                    errorMessageForToast = "Invalid input data. Please check your form."; 
                } else if (error.response.status === 404) {
                    errorMessageForToast = "Feedback submission endpoint not found.";
                } else if (error.response.status === 401 || error.response.status === 403) {
                    errorMessageForToast = "Authentication or authorization failed. Please log in again.";
                } else if (error.response.status >= 500) {
                    errorMessageForToast = "Server error. Please try again later.";
                }
            } else if (error.request) {
                // Lỗi không nhận được phản hồi (ví dụ: mất mạng, server không chạy)
                errorMessageForToast = "Cannot connect to the server. Please check your internet connection or try again later.";
            } else {
                // Lỗi khác (ví dụ: lỗi trong quá trình thiết lập request)
                errorMessageForToast = error.message;
            } 
            
            toast.error(errorMessageForToast, { 
                theme: "dark", 
                position: "top-left" 
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={modalTitle} 
            open={open} 
            onCancel={handleCancel} 
            footer={[
                <Button key="back" onClick={handleCancel} disabled={loading}>
                    Cancel
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    loading={loading} 
                    onClick={() => form.submit()} 
                >
                    Submit Feedback
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ rating: 0 }}
            >
                <Form.Item
                    name="body"
                    label="Your Feedback"
                    rules={[{ required: true, message: 'Please enter feedback content!' }]} 
                >
                    <Input.TextArea rows={4} placeholder="Enter detailed feedback content" /> 
                </Form.Item>

                <Form.Item
                    name="rating"
                    label="Rating"
                    rules={[{ required: true, message: 'Rating is required!' }]}
                >
                    <Rate allowHalf />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default FeedbackForm;