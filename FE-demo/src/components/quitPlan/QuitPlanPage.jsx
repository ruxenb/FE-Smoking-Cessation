import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../userContext/userContext';
import { getAllQuitMethods, createQuitPlan } from '../../services/quitPlanService';
import QuitPlanForm from './QuitPlanForm';
import './QuitPlanPage.css';

function QuitPlanPage() {
    const [quitMethods, setQuitMethods] = useState([]);
    const [loadingMethods, setLoadingMethods] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { user } = useUser();

    const tokenType = localStorage.getItem("tokenType");
    const accessToken = localStorage.getItem("accessToken");
    const fullToken = tokenType && accessToken ? `${tokenType} ${accessToken}` : null;

    useEffect(() => {
        setError(null);
        setLoadingMethods(true);

        if (!fullToken || !user || !user.userId) {
            setError({ message: "You need to log in to create a quit plan." });
            setLoadingMethods(false);
            // Có thể chuyển hướng về trang đăng nhập
            // navigate('/login');
            return;
        }

        getAllQuitMethods(fullToken)
            .then(res => {
                setQuitMethods(res.data.data);
                setLoadingMethods(false);
            })
            .catch(err => {
                let msg = err.response?.data?.message || err.message || "Unknown error";
                console.error('Error fetching quit methods:', err);

                if (err instanceof TypeError && err.message === "Failed to fetch") {
                    toast.warning("Server is not running. Please try again after starting the Back-End system 😏", { theme: "dark", position: "top-left" });
                } else {
                    toast.error(`Failed to load quit methods: ${msg}`);
                }
                setError({ message: msg });
                setLoadingMethods(false);
            });
    }, [fullToken, user]); // Thêm user vào dependency array

    const handleSubmitQuitPlan = async (formData) => {
        if (!user || !user.userId) {
            toast.error("User not authenticated. Please log in.");
            return;
        }

        setSubmitting(true);
        try {
            const dataToSubmit = {
                ...formData,
                userId: user.userId,
            };
            console.log("Submitting Quit Plan:", dataToSubmit);

            const response = await createQuitPlan(dataToSubmit, fullToken);
            toast.success("Quit Plan created successfully!", { theme: "dark" });
            console.log("Quit Plan response:", response);

            setTimeout(() => {
                navigate('/dashboard'); // Hoặc trang chi tiết kế hoạch vừa tạo
            }, 2000);

        } catch (err) {
            let msg = err.response?.data?.message || err.message || "Failed to create quit plan";
            console.error("Error creating quit plan:", err.response?.data || err);

            if (err instanceof TypeError && err.message === "Failed to fetch") {
                toast.warning("Server is not running. Please try again after starting the Back-End system 😏", { theme: "dark", position: "top-left" });
            } else {
                toast.error(`Error creating quit plan: ${msg}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingMethods) {
        return <div className="quit-plan-loading">Loading quit methods...</div>;
    }

    if (error) {
        return <div className="quit-plan-error">Error: {error.message}</div>;
    }

    return (
        <div className="quit-plan-page-container">
            <h1>Create Your Quit Plan</h1>
            <QuitPlanForm
                quitMethods={quitMethods}
                onSubmit={handleSubmitQuitPlan}
                loading={submitting}
                // Thêm initialValues nếu bạn muốn có giá trị mặc định hoặc khi chỉnh sửa
            />
        </div>
    );
}

export default QuitPlanPage;