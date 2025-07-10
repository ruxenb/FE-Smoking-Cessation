import React from "react";
import QuizPage from "../../components/quiz/QuizPage";

function Feedback() {
  return (
    <div>
      <QuizPage
        quizId={"SFB_QUIZ001"}
        quizUrl={`http://localhost:8080/api/users/smokingprofile/quiz-answer`} 
        />
    </div>
  );
}

export default Feedback;