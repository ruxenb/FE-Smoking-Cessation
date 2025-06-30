import React, { useState, useEffect  } from 'react';

// Component bây giờ nhận thêm prop `existingProfile`
function ProfileSetupOverlay({ onSaveProfile, onClose, existingProfile }) {
  const [formData, setFormData] = useState({
    cigarettesPerDay: '',
    costPerPack: '',
    yearsSmoked: '',
    note: ''
  });

  //useEffect để điền dữ liệu cũ vào form ---
  useEffect(() => {
    if (existingProfile) {
      setFormData({
        cigarettesPerDay: existingProfile.cigarettesPerDay || '',
        costPerPack: existingProfile.costPerPack || '',
        // Backend lưu là weekSmoked, chúng ta cần chuyển đổi nếu cần
        // Giả sử form vẫn dùng `yearsSmoked`
        yearsSmoked: existingProfile.weekSmoked || '', // Sửa đổi nếu cần (ví dụ: weekSmoked / 52)
        note: existingProfile.note || ''
      });
    }
  }, [existingProfile]); // Chạy khi prop existingProfile thay đổi

  // A single, generic handler to update the form state.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn cho page ko reload khi đang submit

    // Đảm bảo các trường đều đc fill
    if (!formData.cigarettesPerDay || !formData.costPerPack || !formData.yearsSmoked) {
      alert('Please fill in all required fields to continue.');
      return;
    }

    // Chuẩn bị data payload để khớp backend entity.
    const profileDataForBackend = {
      cigarettesPerDay: parseInt(formData.cigarettesPerDay, 10),
      costPerPack: parseFloat(formData.costPerPack),
      // Backend của bạn dùng `weekSmoked`, nên chúng ta sẽ gửi đúng trường này
      weekSmoked: parseInt(formData.yearsSmoked, 10), 
      note: formData.note
    };

    onSaveProfile(profileDataForBackend);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="overlay-icon">📝</div>
        {/* Thay đổi tiêu đề dựa trên việc có profile cũ hay không */}
        <h2>{existingProfile ? 'Update Your Smoking Profile' : 'Create Your Smoking Profile'}</h2>
        <p>This data is essential to personalize your quit journey.</p>
        
        <form onSubmit={handleSubmit} className="overlay-form">
          {/* Form inputs không đổi */}
          <div className="form-group">
            <label htmlFor="cigarettesPerDay">Average Cigarettes Per Day</label>
            <input
              type="number"
              id="cigarettesPerDay"
              name="cigarettesPerDay"
              value={formData.cigarettesPerDay}
              onChange={handleInputChange}
              placeholder="e.g., 20"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="costPerPack">Cost Per Pack</label>
            <input
              type="number"
              id="costPerPack"
              name="costPerPack"
              step="0.01"
              value={formData.costPerPack}
              onChange={handleInputChange}
              placeholder="e.g., 8.50"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="yearsSmoked">For how many years have you smoked?</label>
            <input
              type="number"
              id="yearsSmoked"
              name="yearsSmoked"
              value={formData.yearsSmoked}
              onChange={handleInputChange}
              placeholder="e.g., 12"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">Your Motivation (Optional)</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="My reason for quitting is..."
              rows="3"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="overlay-button">Save and Begin</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetupOverlay;