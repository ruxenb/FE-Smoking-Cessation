import React from "react";
import QuizPage from "../../components/quiz/QuizPage";
import { Navbar } from "../../components/home/homePage";

function SmokingQuiz() {
  return (
    <div>
      <Navbar />
      <QuizPage
        quizId={"FGT_QUIZ001"} 
        quizUrl={`http://localhost:8080/api/users/smokingprofile/quiz-answer`}
        />
    </div>
  );
}

export default SmokingQuiz;