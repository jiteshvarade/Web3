import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import GOOGLE_AUTH_CLIENT_KEY from "../constants.mjs";
import { BrowserRouter as Router } from 'react-router-dom';

console.log(GOOGLE_AUTH_CLIENT_KEY)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="838796822561-6bb5sa3tv08rj4b8vtp3tbd0mrqfn9ls.apps.googleusercontent.com">
    <Router>
      <App />
    </Router>
    </GoogleOAuthProvider>
  </StrictMode>,
)
