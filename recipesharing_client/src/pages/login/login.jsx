import { useState } from "react";
import logo from "../../assets/appLogo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/loading";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const fillData = (key, val) => {
    setData((prevData) => ({
      ...prevData,
      [key]: val,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents form submission

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/v1/login/", data);
      if (res.data.error) {
        toast.error(res.data.error);
        setLoading(false);
        return;
      }

      const id = res.data.user.user.id;
      const username = res.data.user.user.username;
      localStorage.setItem("id", id);
      localStorage.setItem("username", username);
      toast.success("Login successful");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="h-[100vh] bg-[#ffe3e5] flex justify-center items-center">
      <ToastContainer position="bottom-right" />
      <div className="w-[40%] h-[80vh] bg-[#ffa2ac] flex justify-center items-center rounded-lg shadow-md flex-col px-20">
        <img src={logo} className="w-[200px]" alt="App Logo" />
        <form className="w-full mx-20" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter Username"
            className="w-full bg-[#fff1f2] text-[#4d0417] px-2 py-3 rounded-lg outline-none border-none transition-all duration-300 placeholder:text-[#4d04177e] text-xl focus:ring-4 focus:ring-[#4d0417]"
            onChange={(e) => fillData("username", e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full mt-3 bg-[#fff1f2] text-[#4d0417] px-2 py-3 rounded-lg outline-none border-none transition-all duration-300 placeholder:text-[#4d04177e] text-xl focus:ring-4 focus:ring-[#4d0417]"
            onChange={(e) => fillData("password", e.target.value)}
          />
          <div className="flex justify-center">
            {loading ? (
              <button
                type="button"
                className="bg-[#a20f35] my-3 text-[#ffe3e5] px-20 py-2 rounded-lg outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]"
              >
                <Loading />
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#a20f35] my-3 text-[#ffe3e5] px-20 py-2 rounded-lg outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]"
              >
                Login
              </button>
            )}
          </div>
          <hr />
          <p className="text-[#a20f35] text-center my-3">
            Doesn't Have an Account? <Link to={"/signup"} className="underline">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
