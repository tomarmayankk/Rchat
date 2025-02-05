import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {login, isLoggingIn} = useAuthStore();
  const handleSubmit = (e) => {
    e.preventDefault();
      login(formData)
  };

  return (
    <div className="flex items-center justify-center w-full h-[638px]">
      <div className="flex flex-col items-center justify-center bg-gray-50 rounded-md shadow-xl w-96 h-[450px] gap-12">
        <h1 className="text-3xl font-bold">Login</h1>
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 font-semibold"
        >
          <div className="flex flex-col">
            <label htmlFor="">Email</label>
            <input
              type="text"
              placeholder="jondoe@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="border-2 rounded-sm w-80 h-8 placeholder:p-2"
              style={{ padding: "8px" }}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="">Password</label>
            <input
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="border-2 rounded-sm w-80 h-8 placeholder:p-2"
              style={{ padding: "8px" }}
            />
          </div>
          <button type="submit" className="w-32 bg-blue-800 text-white font-semibold h-10 rounded-sm hover:bg-blue-700 cursor-pointer" disabled={isLoggingIn} >
            { isLoggingIn ? (
              <> Loading.... </>
            ): (
              "Login"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Go to Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
