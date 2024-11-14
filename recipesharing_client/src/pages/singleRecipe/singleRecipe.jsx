import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../components/loading';
import logo from "../../assets/appLogo.png";
import defaultImage from "../../assets/default recipe.jpg";

const SingleRecipe = () => {
    const params = useParams();
    const recipeId = params.id;
    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState({});
    const navigate = useNavigate();

    // Function to calculate the average rating
    const calculateAverageRating = (ratings) => {
        if (ratings.length === 0) return 0; // If no ratings, return 0
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0); // Sum of ratings
        const average = total / ratings.length; // Calculate the average
        return average.toFixed(1); // Round to 1 decimal place
    };

    useEffect(() => {
        setLoading(true);
        const fetchSingleRecipe = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/v1/getRecipeById/${recipeId}`);
                setRecipe({ ...res.data.recipe });
                setLoading(false);
            } catch (error) {
                toast.error("Failed to load recipe.");
                setLoading(false);
            }
        };
        fetchSingleRecipe();
    }, [recipeId]);

    const averageRating = calculateAverageRating(recipe.ratings || []);
    return (
        <div>
            {loading ? (
                <div className='flex justify-center items-center h-[100vh] bg-[#ffe3e5]'><Loading /></div>
            ) : (
                <div className='h-screen bg-[#ffe3e5]'>
                    <div className='flex justify-between bg-transparent'>
                        <div className='my-5 mx-5 rounded-lg h-[100px] w-full flex justify-between bg-[#881337]'>
                            <div className='flex justify-center items-center mx-5'>
                                <img src={logo} className='w-[100px]' alt="App Logo" />
                            </div>
                            <div className='flex justify-center items-center mx-5'>
                                <button
                                    className='px-3 py-2 border-none outline-none bg-[#fecdd3] text-[#881337] rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#4c0519]'
                                    onClick={() => window.history.back()}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className='h-[70vh] overflow-auto bg-[#9f1239] mx-5 rounded-lg shadow-lg flex flex-col'>
                            <div className='py-5 flex items-center'>
                                <img src={recipe.recipeImage ? `data:image/jpeg;base64,${recipe.recipeImage}` : defaultImage} className='mx-5 rounded-lg w-20' alt="Recipe" />
                                <h3 className='text-[#fecdd3] text-xl font-semibold mx-3 my-3'>
                                    Recipe Rating: {averageRating} out of 5
                                </h3>
                            </div>
                            <div>
                                <h1 className='text-[#fecdd3] text-3xl font-bold mx-3 my-3'>{recipe.recipeName}</h1>
                                <p className='text-[#fecdd3] text-lg font-bold mx-3 my-3'>{recipe.description}</p>
                                <p className='text-[#fecdd3] mx-3'>Ingredients: {recipe.ingredients}</p>
                                <p className='text-[#fecdd3] mx-3 my-3'>Instructions: {recipe.instructions}</p>
                            </div>
                            <div>
                                <div className='h-[200px] overflow-auto mx-5 my-5 rounded-lg shadow-lg bg-[#fecdd3]'>
                                    <h1 className='text-[#9f1239] text-3xl font-bold mx-3 my-3 '>Comments Section</h1>
                                    {recipe.comments && recipe.comments.length > 0 ? (
                                        recipe.comments.map((comment, index) => (
                                            <div key={index}>
                                                <p className='text-[#fb7185] text-lg mx-3 my-2'>{comment.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className='text-[#fb7185] text-lg mx-3 my-2'>No comments available.</p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default SingleRecipe;


// {recipe.comments.length > 0 && recipe.comments.map((comment) => {
//     return (
//         <div>
//             <p>{comment.comment}</p>
//         </div>
//     )
// })}