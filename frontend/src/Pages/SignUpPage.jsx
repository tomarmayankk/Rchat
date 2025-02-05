import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore';
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const {signup, isSigningUp} = useAuthStore();
  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Please enter a full name");
  
    if (!formData.email.trim() || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      return toast.error("Please enter a valid email address");
    }
  
    if (!formData.password.trim() || formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
  
    return true; // If all validations pass
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
    if(success === true) {
      signup(formData)
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-[638px]">
      <div className="flex flex-col items-center justify-center bg-gray-50 rounded-md shadow-xl w-96 h-[450px] gap-12">
        <h1 className="text-3xl font-bold">Sign-Up</h1>
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 font-semibold"
        >
          <div className="flex flex-col">
            <label htmlFor="">FullName</label>
            <input
              type="text"
              placeholder="Jon doe"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="border-2 rounded-md w-80 h-8  font-medium"
              style={{ padding: "8px" }}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Email</label>
            <input
              type="email"
              placeholder="jondoe@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="border-2 rounded-sm w-80 h-8"
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
              className="border-2 rounded-sm w-80 h-8"
              style={{ padding: "8px" }}
            />
          </div>
          <button type="submit" className="w-32 bg-blue-800 text-white font-semibold h-10 rounded-sm hover:bg-blue-700 cursor-pointer" disabled={isSigningUp} >
            { isSigningUp ? (
              <> Loading.... </>
            ): (
              "Create Account"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Go to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
