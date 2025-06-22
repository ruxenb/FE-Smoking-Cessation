import React, { useState } from 'react';

// This component's job is to collect data and pass it up.
// It receives one crucial prop: a function called 'onSaveProfile'.
function ProfileSetupOverlay({ onSaveProfile, onClose  }) {
  // State to hold the form data, neatly in one object.
  const [formData, setFormData] = useState({
    cigarettesPerDay: '',
    costPerPack: '',
    yearsSmoked: '', // Using a more user-friendly name for the form label
    note: ''
  });

  // A single, generic handler to update the form state.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the page from reloading on submit

    // Basic validation to ensure required fields are filled
    if (!formData.cigarettesPerDay || !formData.costPerPack || !formData.yearsSmoked) {
      alert('Please fill in all required fields to continue.');
      return;
    }

    // Prepare the data payload to match your backend entity.
    // Notice we parse strings to numbers here.
    const profileDataForBackend = {
      cigarettesPerDay: parseInt(formData.cigarettesPerDay, 10),
      costPerPack: parseFloat(formData.costPerPack),
      // Here we map our user-friendly 'yearsSmoked' back to your entity's 'weekSmoked' field.
      // If 'weekSmoked' is actually weeks, you'd do: parseInt(formData.yearsSmoked, 10) * 52
      weekSmoked: parseInt(formData.yearsSmoked, 10), 
      note: formData.note
    };

    // Call the function passed from the parent, handing it the clean data.
    onSaveProfile(profileDataForBackend);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}> {/* Optional: Prevent click inside content from bubbling up */}
        {/* Close Button */}
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="overlay-icon">📝</div>
        <h2>Create Your Smoking Profile</h2>
        <p>This data is essential to personalize your quit journey.</p>
        
        <form onSubmit={handleSubmit} className="overlay-form">
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
              step="0.01" // Allows for decimals like 7.50
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