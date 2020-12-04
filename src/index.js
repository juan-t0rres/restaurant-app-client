import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./auth/UserProvider";

const darkTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: red[800],
    },
    secondary: {
      main: green[600]
    }
  },
});

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={darkTheme}>
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
