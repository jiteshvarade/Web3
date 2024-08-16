import React from 'react';
import HeroSectionVideo from "../../assets/LandingPage/HeroSection.mp4";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

function HeroSection() {

  const navigate = useNavigate();

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
                onSuccess={credentialResponse => {
                    const token = credentialResponse.credential;
                    const decoded = jwtDecode(token);
                    console.log(decoded)

                    navigate('/dashboard');
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />;
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
