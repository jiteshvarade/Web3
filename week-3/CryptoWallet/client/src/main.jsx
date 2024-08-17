import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_AUTH_CLIENT_KEY } from "../constants.mjs";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_KEY}>
    <Router>
      <App />
    </Router>
  </GoogleOAuthProvider>
);
