import React, { useState } from 'react'
import logo from "../../assets/appLogo.png"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Loading from '../../components/loading';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
    const userId = localStorage.getItem('id')
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        userId: userId,
        recipeName: "",
        description: "",
        ingredients: "",
        instructions: "",
        recipeImage: null,
    })
    const fillData = (key, val) => {
        setData((prevData) => ({ ...prevData, [key]: val }));
    }
    const handleAddRecipe = async () => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('recipeName', data.recipeName);
        formData.append('recipeImage', data.recipeImage);
        formData.append('description', data.description);
        formData.append('ingredients', data.ingredients);
        formData.append('instructions', data.instructions);
        try {
            setLoading(true)
            const res = await axios.post("http://localhost:8000/v1/recipe/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            setLoading(false)
            navigate("/")
        } catch (error) {
            setLoading(false)
            if (error.response.data.error) {
                toast.error(error.response.data.error)
            } else {
                toast.error('Some error occured')
                console.log(error)
            }
        }
    }
    return (
        <div className='h-[100vh] bg-[#ffe3e5] flex justify-center items-center'>
            <ToastContainer position='bottom-right' />
            <div className='h-[80vh] w-[40%] bg-[#fb7185] rounded-lg shadow-lg flex flex-col justify-center items-center px-8 overflow-auto'>
                <img src={logo} className='w-32' />
                <input
                    type="text"
                    placeholder="Enter Recipe name"
                    className="w-full bg-[#fff1f2] text-[#4d0417] px-2 py-3 rounded-lg outline-none transition-all duration-300 placeholder:text-[#4d04177e] text-xl focus:ring-4 focus:ring-[#4d0417]"
                    onChange={(e) => fillData("recipeName", e.target.value)}
                />
                <textarea
                    type="text"
                    placeholder="Enter Recipe Description"
                    className="w-full my-3 bg-[#fff1f2] text-[#4d0417] px-2 py-3 rounded-lg outline-none transition-all duration-300 placeholder:text-[#4d04177e] text-xl focus:ring-4 focus:ring-[#4d0417]"
                    onChange={(e) => fillData("description", e.target.value)}
                ></textarea>
                <input
                    type="file"
                    placeholder="Enter Recipe image"
                    className="w-full bg-[#fff1f2] text-[#4d0417] px-2 py-3 rounded-lg outline-none transition-all duration-300 placeholder:text-[#4d04177e] text-xl focus:ring-4 focus:ring-[#4d0417]"
                    onChange={(e) => fillData("recipeImage", e.target.files[0])}
                />
                <textarea
                    type="text"
                    placeholder="Enter Recipe Ingridients with comma seprate"
                    className="w-full my-3 bg-[#fff1f2] text-[#4d0417] px-2 py-3 rounded-lg outline-none transition-all duration-300 placeholder:text-[#4d04177e] text-xl focus:ring-4 focus:ring-[#4d0417]"
                    onChange={(e) => fillData("ingredients", e.target.value)}
                ></textarea>
                <textarea
                    type="text"
                    placeholder="Enter Recipe Instructions"
                    className="w-full bg-[#fff1f2] text-[#4d0417] px-2 py-3 rounded-lg outline-none transition-all duration-300 placeholder:text-[#4d04177e] text-xl focus:ring-4 focus:ring-[#4d0417]"
                    onChange={(e) => fillData("instructions", e.target.value)}
                ></textarea>
                {
                    loading ? <button
                        type="button"
                        className="bg-[#a20f35] my-3 text-[#ffe3e5] px-20 py-2 rounded-lg outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]"
                    >
                        <Loading />
                    </button> :
                        <button
                            type="submit"
                            className="bg-[#a20f35] my-3 text-[#ffe3e5] px-20 py-2 rounded-lg outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]"
                            onClick={handleAddRecipe}
                        >
                            Add
                        </button>
                }
            </div>
        </div>
    )
}

export default AddRecipe
