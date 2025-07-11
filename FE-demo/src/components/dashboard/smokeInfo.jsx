import React from 'react';
import './smokeInfo.css'; // Sẽ tạo file CSS này ở bước sau

// Component con để hiển thị một mục thông tin
const InfoItem = ({ icon, label, value }) => (
    <div className="profile-info-item">
        <span className="info-icon">{icon}</span>
        <div className="info-text">
            <span className="info-label">{label}</span>
            <span className="info-value">{value}</span>
        </div>
    </div>
);

function SmokingProfileInfo({ smokingProfile }) {
    // Nếu không có profile, không hiển thị gì cả
    if (!smokingProfile) {
        return null;
    }

    // Định dạng lại giá tiền cho đẹp
    const formattedCost = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(smokingProfile.costPerPack || 0);

    return (
        <section className="smoking-profile-info-section">
            <div className="section-header">
                <h2>Your Smoking Profile</h2>
            </div>
            <div className="profile-info-grid">
                <InfoItem
                    icon="🚬"
                    label="Cigarettes Per Day"
                    value={smokingProfile.cigarettesPerDay || 'N/A'}
                />
                <InfoItem
                    icon="💰"
                    label="Cost Per Pack"
                    value={formattedCost}
                />
                <InfoItem
                    icon="🗓️"
                    label="Weeks Smoked"
                    value={`${smokingProfile.weekSmoked || 0} weeks`}
                />
                <InfoItem
                    icon="⚠️"
                    label="Nicotine Addiction"
                    value={smokingProfile.nicotineAddiction || 'N/A'}
                />
            </div>
        </section>
    );
}

export default SmokingProfileInfo;