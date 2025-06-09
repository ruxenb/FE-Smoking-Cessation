import React from "react";
import "./index.css";
import LoginForm from "../authen-form/LoginForm";
import RegisterForm from "../authen-form/RegisterForm";
import PropTypes from "prop-types";
import Slider from "react-slick";

const images = [
  "/images/Image1.png",
  "/images/Image2.png",
  "/images/Image3.png",
  "/images/Image4.png",
];

// truyền vào biến isLogin để xác định xem đây là trang đăng nhập hay đăng ký'
// isLogin là một biến prop(thuộc tính) được truyền vào AuthenTemplate(component)
function AuthenTemplate({ isLogin }) {
  // cấu hình slider
  const sliderSettings = {
    dots: true, // hiện chấm tròn dưới slider
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // tự động chạy
    autoplaySpeed: 2500, // thời gian chuyển slide (ms)
    arrows: false, // ẩn nút điều hướng
  };

  return (
    <div className="authen-template">
      <div className="authen-template-form">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
      <div className="authen-template-image">
        <Slider {...sliderSettings}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`slide-${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
AuthenTemplate.propTypes = {
  isLogin: PropTypes.bool.isRequired,
};
export default AuthenTemplate;
