import React, { useEffect, useState } from "react";
import QuizForm from "./QuizForm";
import { getQuizById, submitUserQuizAnswer } from "../../services/quizService";
import { toast } from "react-toastify";
import { useUser } from '../../userContext/userContext';
import { useNavigate } from 'react-router-dom'; // <-- Thêm dòng này
import "./QuizPage.css";

function QuizPage({quizId, quizUrl}) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);

  const tokenType = localStorage.getItem("tokenType");
  const accessToken = localStorage.getItem("accessToken");
  const fullToken = tokenType && accessToken ? `${tokenType} ${accessToken}` : null;
  const { user, refreshUser  } = useUser(); // Lấy thông tin người dùng từ context

  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    setLoading(true);

    // Kiểm tra token và userId từ context
    if (!fullToken || !user || !user.userId) { 
      setError({ message: "You need to log in to take the quiz." });
      setLoading(false);
      // Có thể chuyển hướng về trang đăng nhập nếu không có token/userId
      // navigate('/login'); 
      return;
    }

    // Lấy data quiz từ BE
    getQuizById(quizId, fullToken)
      .then(res => {
        const fetchedQuiz = res.data?.data || res.data;
        setQuiz(fetchedQuiz);

        const initialAnswers = {};
        // Tạo answers dựa trên loại câu hỏi của quiz
        if (fetchedQuiz && fetchedQuiz.questions) {
          fetchedQuiz.questions.forEach(q => {
            switch (q.questionType) {
              case 'MULTIPLE_CHOICE':
                initialAnswers[q.id] = [];
                break;
              case 'SINGLE_CHOICE':
              case 'TEXT_ANSWER':
              case 'NUMBER_ANSWER':
                initialAnswers[q.id] = null;
                break;
              default:
                initialAnswers[q.id] = null;
            }
          });
        }
        setAnswers(initialAnswers);
        setLoading(false);
      })
      .catch(err => {
        let msg = err.response?.data?.message || err.message || "Unknown error";
        console.error("Error loading quiz:", err.response?.data || err);

        // Xử lý lỗi "Failed to fetch" (server chưa chạy)
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          toast.warning(
            "Lỗi Server chưa được khởi động, thử lại sau khi đã chạy hệ thống Back-End nhen 😏",
            { theme: "dark", position: "top-left" }
          );
        } else {
          toast.error(`Failed to load quiz: ${msg}`); 
        }
        setLoading(false);
      });
  }, [quizId, fullToken, user]); // Thêm 'user' vào dependency array để re-run effect khi user thay đổi

  // Hàm xử lý thay đổi câu trả lời
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Hàm xử lý gửi câu trả lời
  const handleSubmit = async () => {
    if (!quiz) return;

    // Kiểm tra tất cả câu hỏi đã được trả lời chưa
    const allAnswered = quiz.questions.every(q => {
      const userAnswer = answers[q.id];
      switch (q.questionType) {
        case 'MULTIPLE_CHOICE':
          return Array.isArray(userAnswer) && userAnswer.length > 0;
        case 'SINGLE_CHOICE':
          return userAnswer !== null && userAnswer !== undefined;
        case 'TEXT_ANSWER':
        case 'NUMBER_ANSWER':
          return typeof userAnswer === 'string' && userAnswer.trim() !== '';
        default:
          return userAnswer !== null && userAnswer !== undefined;
      }
    });

    if (!allAnswered) {
      toast.warn("Please answer all the questions before submitting!");
      return;
    }

    // Chuẩn bị danh sách câu hỏi và câu trả lời cho Backend
    const userAnswersForSubmission = quiz.questions.map(q => {
      const userAnswer = answers[q.id];

      let questionDtoForSubmission = {
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType,
        optionDtos: null,
        answerText: null
      };
      // Xử lý câu trả lời dựa trên loại câu hỏi
      switch (q.questionType) {
        case 'SINGLE_CHOICE':
          const selectedOption = q.optionDtos.find(opt => opt.id === userAnswer);
          if (selectedOption) {
            questionDtoForSubmission.optionDtos = [selectedOption];
          }
          break;
        case 'MULTIPLE_CHOICE':
          if (Array.isArray(userAnswer) && userAnswer.length > 0) {
            const selectedOptions = q.optionDtos.filter(opt => userAnswer.includes(opt.id));
            questionDtoForSubmission.optionDtos = selectedOptions;
          }
          break;
        case 'TEXT_ANSWER':
        case 'NUMBER_ANSWER':
          questionDtoForSubmission.answerText = String(userAnswer);
          break;
        default:
          console.warn(`Question type ${q.questionType} not explicitly handled for submission.`);
          break;
      }
      return questionDtoForSubmission;
    });

    // Tạo UserQuizAnswerRequestDto
    const requestBody = {
      quizId: quiz.quizId,
      userId: Number(user.userId), // Sử dụng userId từ user context
      questions: userAnswersForSubmission,
    };

    //console.log("Submitting this data to BE:", requestBody);
    const toastId = toast.loading("Saving your profile...");


    try {
      // Gọi API để gửi dữ liệu
      const response = await submitUserQuizAnswer(requestBody, fullToken, quizUrl);
      console.log("Quiz submitted successfully:", response.data);
      // Hiển thị thông báo thành công
      toast.update(toastId, { render: "Profile saved! Updating your dashboard...", isLoading: true });

      const refreshed = await refreshUser();

      if (refreshed) {
        // Nếu refresh thành công, thông báo và điều hướng
        toast.update(toastId, { 
            render: "Dashboard updated! Redirecting...", 
            type: "success", 
            isLoading: false, 
            autoClose: 2000 
        });
        // Chuyển hướng người dùng về trang Dashboard sau khi thành công
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      } else {
        // Nếu refresh thất bại, cảnh báo người dùng
        toast.update(toastId, { 
            render: "Profile saved, but please log in again to see the changes.", 
            type: "warning", 
            isLoading: false, 
            autoClose: 5000 
        });
      }   

    } catch (err) {
      // Xử lý lỗi khi gửi dữ liệu
      const errorMsg = err.response?.data?.message || err.message || "An error occurred.";
      toast.update(toastId, { 
          render: `Error: ${errorMsg}`, 
          type: "error", 
          isLoading: false, 
          autoClose: 4000 
      });
      console.error("Error during submission process:", err);
    }
  };
  // Hiển thị các trạng thái của quiz
  if (loading)
    return <div className="quiz-loading">Loading quiz...</div>;

  if (error)
    return <div className="quiz-error">Error: {error.message}</div>;

  if (!quiz)
    return <div className="quiz-error">Quiz not found!</div>;

  return (
    <div className="quiz-page-container">
      <QuizForm
        quiz={quiz}
        answers={answers}
        onAnswerChange={handleAnswerChange}
      />
      <button className="quiz-submit-btn" onClick={handleSubmit}>
        Send answer
      </button>
    </div>
  );
}

export default QuizPage;