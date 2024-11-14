import React, { useEffect, useState } from 'react'
import "./loading.css"
import { useNavigate } from 'react-router-dom';
const Loading = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      navigate('/dashboard');  // Navigate to the dashboard after the splash screen
    }, 5000); // Set the timeout to 5000 ms (5 seconds)

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [navigate]);

  if (!showSplash) return null; // Hide splash screen after timeout
  return (
    <div className='flex justify-center items-center h-[100vh] bg-[#ffe3e5]'>
      <div class="loader">
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__ball"></div>
      </div>
    </div>
  )
}

export default Loading
