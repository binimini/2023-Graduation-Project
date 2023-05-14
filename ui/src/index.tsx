import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import "@/assets/styles/index.scss";
import App from "@/App";
import { ThemeProvider } from "@/context/ThemeContext";

import '@fortawesome/fontawesome-free/js/all.js';

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
