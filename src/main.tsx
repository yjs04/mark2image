import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";  // <= 이게 빠져 있으면 CSS, Tailwind 둘 다 적용 안 됨

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
