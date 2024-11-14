import React, { useState, useEffect } from 'react';
import logo from "../../assets/appLogo.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../components/loading';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 5
};

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [openRateModal, setOpenRateModal] = useState(false);
    const [openCommentModal, setOpenCommentModal] = useState(false);
    const [rate, setRate] = useState({
        recipeId: null,
        rate: null
    });
    const rateData = (key, val) => {
        setRate((prevData) => ({
            ...prevData,
            [key]: val
        }));
    }
    const addRate = async() => {
        try {
            const res = await axios.post(`http://localhost:8000/v1/addRate/`, rate)
            setOpenRateModal(false)
            toast.success("Rate added successfully")
        } catch (error) {
            toast.error("Failed to Add rate.");
            console.log(error);
        }
    }
    const [comment, setComment] = useState({
        recipeId: null,
        comment: ""
    });
    const commentData = (key, val) => {
        setComment((prevData) => ({
            ...prevData,
            [key]: val
        }));
    }
    const addComment = async () => {
        if (!comment.recipeId || !comment.comment) {
            toast.error("Both fields are required.");
            return;
        }
        try {
            const res = await axios.post(`http://localhost:8000/v1/addComment/`, comment);
            setOpenCommentModal(false);
            toast.success("Comment added successfully");
        } catch (error) {
            toast.error("Failed to Add Comment.");
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:8000/v1/getAllRecipes/");
                setRecipes(res.data.recipes || []);
            } catch (error) {
                toast.error("Failed to load recipes.");
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    return (
        <div className='h-screen bg-[#ffe3e5]'>
            <ToastContainer position="bottom-right" />
            <div className='flex justify-between bg-transparent'>
                <div className='my-5 mx-5 rounded-lg h-[100px] w-full flex justify-between bg-[#881337]'>
                    <div className='flex justify-center items-center mx-5'>
                        <img src={logo} className='w-[100px]' alt="App Logo" />
                    </div>
                    <div className='flex justify-center items-center mx-5'>
                        <button
                            className='px-3 py-2 border-none outline-none bg-[#fecdd3] text-[#881337] rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#4c0519]'
                            onClick={() => navigate("/dashboard")}
                        >
                            Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <div className='p-5'>
                {loading ? (
                    <div className='flex justify-center items-center h-[70vh] bg-[#ffe3e5]'><Loading /></div>
                ) : (
                    <div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
                            {recipes.map((recipe) => (
                                <div key={recipe.id} className='bg-[#fecdd3] p-4 rounded-lg shadow-md'>
                                    <img src={`data:image/jpeg;base64,${recipe.recipeImage}`} className='w-20 rounded-full' alt="" />
                                    <h2 className='text-2xl text-[#881337] font-bold'>{recipe.recipeName}</h2>
                                    <p className='text-[#4c0519] mt-2'>{recipe.description}</p>
                                    <div className='flex gap-2'>
                                        <button
                                            className='mt-3 px-4 py-2 bg-[#881337] text-white rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#4c0519]'
                                            onClick={() => navigate(`/singleRecipe/${recipe.id}`)}
                                        >
                                            View Recipe
                                        </button>
                                        <button
                                            className='mt-3 px-4 py-2 bg-[#881337] text-white rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#4c0519]'

                                            onClick={() => {
                                                setRate({ recipeId: recipe.id, rate: null })
                                                setOpenRateModal(true)
                                            }}
                                        >
                                            Rate Recipe
                                        </button>
                                        <button
                                            className='mt-3 px-4 py-2 bg-[#881337] text-white rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#4c0519]'
                                            onClick={() => {
                                                setComment({ recipeId: recipe.id, comment: "" })
                                                setOpenCommentModal(true)
                                            }}
                                        >
                                            Comment Recipe
                                        </button>
                                        {/* Rate Modal */}
                                        <Modal
                                            open={openRateModal}
                                            onClose={() => setOpenRateModal(false)}
                                            aria-labelledby="rate-modal-title"
                                            aria-describedby="rate-modal-description"
                                        >
                                            <Box sx={style}>
                                                <h1>Rate The Recipe out of 5</h1>
                                                <input type="number" max={5} onChange={(e) => rateData("rate", e.target.value)} placeholder='Rate' className='w-full bg-[#fff1f2] text-[#4d0417] px-1 py-2 rounded-lg outline-none transition-all duration-300 placeholder:text-[#4d04177e] text-xl focus:ring-4 focus:ring-[#4d0417]' />
                                                <button
                                                    type="submit"
                                                    className="bg-[#a20f35] my-3 text-[#ffe3e5] px-20 py-2 rounded-lg outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]"
                                                    onClick={addRate}
                                                >
                                                    Add Rate
                                                </button>
                                            </Box>
                                        </Modal>
                                        <Modal
                                            open={openCommentModal}
                                            onClose={() => setOpenCommentModal(false)}
                                            aria-labelledby="comment-modal-title"
                                            aria-describedby="comment-modal-description"
                                        >
                                            <Box sx={style}>
                                                <h1>Comment the recipe</h1>
                                                <input onChange={(e) => commentData("comment", e.target.value)} type="text" maxLength={100} placeholder='Comment' className='w-full bg-[#fff1f2] text-[#4d0417] px-1 py-2 rounded-lg outline-none transition-all duration-300 placeholder:text-[#4d04177e] text-xl focus:ring-4 focus:ring-[#4d0417]' />
                                                <button
                                                    type="submit"
                                                    className="bg-[#a20f35] my-3 text-[#ffe3e5] px-20 py-2 rounded-lg outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]"
                                                    onClick={addComment}
                                                >
                                                    Add comment
                                                </button>
                                            </Box>
                                        </Modal>
                                    </div>
                                </div>
                            ))}
                        </div>


                        {/* Comment Modal */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
