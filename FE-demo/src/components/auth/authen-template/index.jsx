import React from "react";
import "./index.css";
import LoginForm from "../authen-form/LoginForm";
import RegisterForm from "../authen-form/RegisterForm";
import PropTypes from "prop-types";
import Slider from "react-slick";

// truyền vào biến isLogin để xác định xem đây là trang đăng nhập hay đăng ký'
// isLogin là một biến prop(thuộc tính) được truyền vào AuthenTemplate(component)
function AuthenTemplate({ isLogin }) {
  return (
    <div className="authen-template">
      <div className="authen-template-form">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
      <div className="authen-template-image"></div>
    </div>
  );
}
AuthenTemplate.propTypes = {
  isLogin: PropTypes.bool.isRequired,
};
export default AuthenTemplate;
