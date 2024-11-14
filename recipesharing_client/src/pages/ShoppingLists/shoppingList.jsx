import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Loading from '../../components/loading';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShoppingList = () => {
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();
    const [shoppingLists, setShoppingLists] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchShoppingLists = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8000/v1/getShoppingList/${userId}`);
                const data = await res.json();
                setShoppingLists(data.shoppingLists);
            } catch (error) {
                console.error("Error fetching shopping lists:", error);
                toast.error("Failed to load shopping lists.");
            } finally {
                setLoading(false);
            }
        };
        fetchShoppingLists();
    }, [userId]);

    const deleteList = async (shoppingListId) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:8000/v1/deleteShoppingList/${shoppingListId}`);
            toast.success("Shopping list deleted successfully.");
            navigate("/")
        } catch (error) {
            if (error?.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Failed to delete shopping list.");
            }
            console.error("Error deleting shopping list:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="h-[100vh] flex justify-center items-center bg-[#ffe3e5]"><Loading /></div>;
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4 bg-[#ffe3e5] py-4 rounded-lg overflow-auto">
            <ToastContainer position='bottom-right' />
            <div className='w-full flex justify-between items-center'>
                <div>
                    <h2 className="text-3xl font-semibold mb-6 text-gray-800">My Shopping Lists</h2>
                </div>
                <div>
                    <button
                        className='px-3 py-2 border-none outline-none bg-[#881337] text-[#fecdd3] rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#4c0519]'
                        onClick={() => window.history.back()}
                    >
                        Back
                    </button>
                </div>
            </div>
            {shoppingLists?.length > 0 ?

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {shoppingLists.map((list) => (
                        <div key={list._id} className="bg-white shadow-lg rounded-lg p-5 transition transform hover:scale-105">
                            <h3 className="text-xl font-bold text-gray-700 mb-2">{list.listname}</h3>
                            <ul className="text-gray-600 mb-4 max-h-32 overflow-auto">
                                {list.items.map((item, index) => (
                                    <li key={index} className="border-b py-1">{item.name}</li>
                                ))}
                            </ul>
                            <div className="flex justify-between">
                                <button className="text-red-500 hover:text-red-600" onClick={() => deleteList(list._id)}>
                                    <FaTrash size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div> :
                <div className='h-full flex justify-center items-center bg-[#fecdd3] my-[40px]'>
                    <h2 className='font-bold text-3xl text-[#881337]'>
                        No Shopping List is Added Yet
                    </h2>
                </div>
            }
        </div>
    );
};

export default ShoppingList;
