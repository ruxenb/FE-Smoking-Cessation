import React from "react";
import "./index.css";
import LoginForm from "../authen-form/LoginForm";
import RegisterForm from "../authen-form/RegisterForm";
import PropTypes from "prop-types";
import Slider from "react-slick";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
// truyền vào biến isLogin để xác định xem đây là trang đăng nhập hay đăng ký'
// isLogin là một biến prop(thuộc tính) được truyền vào AuthenTemplate(component)
function AuthenTemplate({ isLogin }) {
  return (
    <div className="authen-template">
      <div className="authen-template-form">
        {/* Sử dụng framer-motion để render login/register form có hiệu ứng đẹp */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LoginForm />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RegisterForm />
            </motion.div>
          )}
        </AnimatePresence>{" "}
      </div>
      <div className="authen-template-image"></div>
    </div>
  );
}
AuthenTemplate.propTypes = {
  isLogin: PropTypes.bool.isRequired,
};
export default AuthenTemplate;
