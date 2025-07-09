// Question.jsx - ĐÃ SỬA LỖI VÀ TỐI ƯU
import React from "react";
import Option from "./Option";
import "./Question.css";

function Question({ question, selectedAnswer, onAnswerChange }) {

  const handleTextInputChange = (e) => {
    // Dùng cho TEXT_ANSWER, NUMBER_ANSWER
    onAnswerChange(question.id, e.target.value);
  };

  const handleRadioSelect = (optionId) => {
    // Dùng cho SINGLE_CHOICE
    onAnswerChange(question.id, optionId);
  };

  const handleCheckboxChange = (optionId, isChecked) => {
    // Dùng cho MULTIPLE_CHOICE
    let currentSelectedOptions = Array.isArray(selectedAnswer) ? [...selectedAnswer] : [];

    if (isChecked) {
      // Đảm bảo không thêm trùng lặp
      if (!currentSelectedOptions.includes(optionId)) {
        currentSelectedOptions.push(optionId);
      }
    } else {
      currentSelectedOptions = currentSelectedOptions.filter(id => id !== optionId);
    }
    onAnswerChange(question.id, currentSelectedOptions);
  };

  const renderQuestionInput = () => {
    // Đảm bảo sử dụng optionDtos và kiểm tra an toàn
    const optionsToRender = Array.isArray(question.optionDtos) ? question.optionDtos : [];

    switch (question.questionType) {
      case 'SINGLE_CHOICE':
        return (
          <div className="quiz-options-group">
            {optionsToRender.map(opt => (
              <Option
                key={opt.id}
                option={opt}
                checked={selectedAnswer === opt.id}
                onSelect={() => handleRadioSelect(opt.id)}
                type="radio"
              />
            ))}
          </div>
        );
      case 'MULTIPLE_CHOICE':
        return (
          <div className="quiz-options-group">
            {optionsToRender.map(opt => (
              <Option
                key={opt.id}
                option={opt}
                // `selectedAnswer` là một mảng ID
                checked={Array.isArray(selectedAnswer) && selectedAnswer.includes(opt.id)}
                onSelect={(isChecked) => handleCheckboxChange(opt.id, isChecked)}
                type="checkbox"
              />
            ))}
          </div>
        );
      case 'TEXT_ANSWER':
        return (
          <textarea
            className="quiz-text-answer-input"
            value={selectedAnswer || ""}
            onChange={handleTextInputChange}
            placeholder="Write your answer here..."
          />
        );
      case 'NUMBER_ANSWER':
        return (
          <input
            type="number"
            className="quiz-number-answer-input"
            value={selectedAnswer || ""}
            onChange={handleTextInputChange}
            placeholder="Enter a number"
          />
        );
      default:
        return <p>Unsupported question type: {question.questionType}</p>;
    }
  };

  return (
    <div className="quiz-question-block">
      <h4 className="quiz-question-title">{question.questionText}</h4>
      {renderQuestionInput()}
    </div>
  );
}

export default Question;