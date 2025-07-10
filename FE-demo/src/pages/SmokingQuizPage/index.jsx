import React from "react";
import QuizPage from "../../components/quiz/QuizPage";

function SmokingQuiz() {
  return (
    <div>
      <QuizPage
        quizId={"FGT_QUIZ001"} 
        quizUrl={`http://localhost:8080/api/users/smokingprofile/quiz-answer`}
        />
    </div>
  );
}

export default SmokingQuiz;