/* main.jsx entry point - file gốc của dự án (tuong đương với index.jsx) */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css"; // v5+ (dùng chung với theme custom)

import App from "./App.jsx";
/* import slick carousel vào main vì main là entrypoint - nơi hợp lý để load Css cho toàn app  */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
