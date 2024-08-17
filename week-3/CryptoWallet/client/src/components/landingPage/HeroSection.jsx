import React from "react";
import HeroSectionVideo from "../../assets/LandingPage/HeroSection.mp4";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {SERVER_URL} from "../../../constants.mjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function HeroSection() {
  const navigate = useNavigate();

  const credentialResponse = async (e) => {
    const token = e.credential;
    const decoded = jwtDecode(token);

    const name = decoded.name;
    const email = decoded.email

    const res = await fetch(`${SERVER_URL}/auth`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (res.status == 200 || res.status == 201) {
      navigate("/dashboard", { state: { email,name } });
    } else {
      console.log("response false");
      toast.error("Failed to SignUp");
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={HeroSectionVideo}
        autoPlay
        loop
        muted
      />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-50">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-6">
          Secure Your Crypto
        </h1>
        <div className="flex space-x-4">
          <GoogleLogin
            onSuccess={credentialResponse}
            onError={() => {
              console.log("Login Failed");
            }}
          />
          ;
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default HeroSection;
