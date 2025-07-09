import React from "react";
import "./Option.css";

// Thêm prop 'type' và set default là 'radio'
function Option({ option, checked, onSelect, type = "radio" }) {
  const handleChange = (e) => {
    if (type === "checkbox") {
      // Đối với checkbox, onSelect cần biết trạng thái checked
      onSelect(e.target.checked);
    } else {
      // Đối với radio, chỉ cần gọi onSelect
      onSelect();
    }
  };

  return (
    <label className="quiz-option">
      <input
        type={type} // Sử dụng prop 'type'
        checked={checked}
        onChange={handleChange}
        className="quiz-option-input"
      />
      <span className="quiz-option-text">{option.optionText}</span>
    </label>
  );
}

export default Option;