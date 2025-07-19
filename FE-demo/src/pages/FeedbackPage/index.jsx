import React from "react";
import QuizPage from "../../components/quiz/QuizPage";
import NavBar from "../../components/nav-bar/NavBar";

function Feedback() {
  return (
    <div>
      <NavBar />
      <QuizPage
        quizId={"SFB_QUIZ001"}
        quizUrl={`http://localhost:8080/api/users/smokingprofile/quiz-answer`}
      />
    </div>
  );
}

export default Feedback;
