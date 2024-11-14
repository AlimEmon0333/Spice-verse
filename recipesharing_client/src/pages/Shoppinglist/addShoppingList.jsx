import React, { useState } from 'react'
import logo from "../../assets/appLogo.png"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/loading';

const AddShoppingList = () => {
    const userId = localStorage.getItem('id')
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        userId: userId,
        listname: "",
        items: [],
    })
    const [item, setItem] = useState({
        name: ""
    });
    const fillData = (key, val) => {
        setData(prevState => ({ ...prevState, [key]: val }))
    }
    const fillItem = (key, val) => {
        setItem(prevState => ({ ...prevState, [key]: val }))
    }
    const addItemToArray = () => {
        if (item.name !== "") {
            setData(prevState => ({ ...prevState, items: [...prevState.items, item] }))
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post("http://localhost:8000/v1/addShoppingList/", data)
            console.log(res.data);
            toast.success("Shopping list added successfully");
            navigate("/")
            setLoading(false)
        } catch (error) {
            setLoading(false)
            if (error.response.data.error) {
                setLoading(false)
                toast.error(error.response.data.error)
            } else {
                setLoading(false)
                toast.error("Some error occurred")
                console.log(error)
            }
        }
    }
    return (

        <div className='h-[100vh] bg-[#ffe3e5] flex justify-center items-center'>
            <ToastContainer position='bottom-right' />
            {
                loading ? <div className='flex h-full w-full justify-center items-center bg-[#fda4af]'><Loading /></div> :

                    <div className='bg-[#fda4af] w-[80%] h-[80vh] rounded-lg shadow-lg flex flex-col items-start'>
                        <div className='flex justify-between mx-5 items-center'>
                            <div className='me-[650px]'>
                                <img src={logo} className='w-[170px] mx-5' />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="bg-[#a20f35] my-3 mx-5 text-[#ffe3e5] px-20 py-2 rounded-lg outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]"
                                    onClick={handleSubmit}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Enter List name"
                                className="w-full bg-[#fff1f2] mx-5 text-[#4d0417] px-2 py-3 rounded-lg outline-none transition-all duration-300 placeholder:text-[#4d04177e] text-xl focus:ring-4 focus:ring-[#4d0417]"
                                onChange={(e) => fillData("listname", e.target.value)}
                            />
                        </div>
                        <div className='flex w-full'>
                            <input
                                type="text"
                                placeholder="Enter Your Items"
                                className="w-full bg-[#fff1f2] ms-5 my-3 text-[#4d0417] px-2 py-3 rounded-lg outline-none transition-all duration-300 placeholder:text-[#4d04177e] text-xl focus:ring-4 focus:ring-[#4d0417]"
                                onChange={(e) => fillItem("name", e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-[#a20f35] my-3 mx-5 text-[#ffe3e5] px-20 py-2 rounded-lg outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]"
                                onClick={addItemToArray}
                            >
                                Add Item
                            </button>
                        </div>
                        <div className='flex items-center mx-5 gap-2'>
                            {data.items.map((x, i) => {
                                return (
                                    <div key={i} className='text-[#fff7] bg-[#4d041796] px-3 py-2 rounded-lg shadow-lg'>
                                        {x.name}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
            }
        </div>
    )
}

export default AddShoppingList
