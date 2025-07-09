import React from "react";
import Question from "./Question";
import "./QuizForm.css";

function QuizForm({ quiz, answers, onAnswerChange }) { // Đổi tên prop ở đây
  return (
    <div className="quiz-wrap">
      <h2 className="quiz-title">{quiz.name}</h2>
      <p className="quiz-description">{quiz.description}</p>
      {quiz.questions.map(q =>
        <Question
          key={q.id}
          question={q}
          selectedAnswer={answers[q.id]} // Đổi tên prop ở đây
          onAnswerChange={onAnswerChange} // Đổi tên prop ở đây
        />
      )}
    </div>
  );
}

export default QuizForm;