import React from "react";
//import "./index.css";
import LoginForm from "../authen-form/login/LoginForm";
import RegisterForm from "../authen-form/register/RegisterForm";
import PropTypes from "prop-types";
import Slider from "react-slick";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../../nav-bar/NavBar";
// truyền vào biến isLogin để xác định xem đây là trang đăng nhập hay đăng ký'
// isLogin là một biến prop(thuộc tính) được truyền vào AuthenTemplate(component)
function AuthenTemplate({ isLogin }) {
  return (
    // Div này tạo ra nền xanh lá cây và căn giữa nội dung
    <div className="authen-template">
      {/* AnimatePresence quản lý hiệu ứng khi component con thay đổi */}
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* LoginForm đã tự chứa layout thẻ màu trắng của nó */}
            <LoginForm />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* RegisterForm cũng đã tự chứa layout thẻ màu trắng */}
            <RegisterForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
AuthenTemplate.propTypes = {
  isLogin: PropTypes.bool.isRequired,
};
export default AuthenTemplate;
