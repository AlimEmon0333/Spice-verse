import React, { useEffect } from 'react'
import image from "../../assets/Startup image.png"
import logo from "../../assets/appLogo.png"
import { Link, useNavigate } from 'react-router-dom';

const Startup = () => {
    const navigate = useNavigate()
    const id = localStorage.getItem("id")
    useEffect(() => {
        if (id) {
            navigate("/loading")
        }
    }, [])
    return (
        <div className='flex h-[100vh] bg-[#ffe3e5]'>
            <div className='w-[40%] flex flex-col items-start justify-center'>
                <img src={logo} className='w-60' />
                <h3 className='text-3xl text-[#8a1134] ms-10'>Welcome To Spice verse</h3>
                <p className='text-[#f83b57dc] ms-10'>A Recipe Sharing App</p>
                <button className='my-5 ms-10 py-3 w-full rounded-full bg-[#c20e37] text-xl text-[#ffe3e5] transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]' onClick={() => navigate("/login")}>Login</button>
                <button className='my-5 ms-10 py-3 w-full rounded-full bg-[#c20e37] text-xl text-[#ffe3e5] transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]' onClick={() => navigate("/signup")}>Signup</button>
            </div>
            <div className='w-[60%] h-[100%] flex justify-center items-center'>
                <img src={image} className='h-[80vh] rounded-lg' />
            </div>
        </div>
    )
}

export default Startup
