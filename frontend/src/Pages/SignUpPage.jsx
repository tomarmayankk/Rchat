import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    age: "",
    password: "",
  });

  const {
    signup,
    isSigningUp,
    checkUsernameAvailability,
    usernameAvailable,
    isCheckingUsername,
  } = useAuthStore();

  // Debounce check username
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (formData.username.trim().length >= 3) {
        checkUsernameAvailability(formData.username);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.username, checkUsernameAvailability]);

  const validateForm = () => {
    const { fullName, username, email, age, password } = formData;

    if (!fullName.trim()) return toast.error("Please enter your full name");
    if (!username.trim()) return toast.error("Please choose a username");
    if (usernameAvailable === false) return toast.error("Username is already taken");
    if (!email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      return toast.error("Please enter a valid email address");
    if (!age || isNaN(age) || age < 10 || age > 120)
      return toast.error("Please enter a valid age between 10 and 120");
    if (!password || password.length < 6)
      return toast.error("Password must be at least 6 characters long");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      signup({ ...formData, age: Number(formData.age) });
    }
  };

  return (
    <div
      className="flex justify-center items-center w-full bg-gray-100"
      style={{ minHeight: "calc(100vh - 4px)", margin: 0, padding: 0 }}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-96"
        style={{ padding: "24px", margin: 0 }}
      >
        <h1
          className="text-2xl font-bold text-center"
          style={{ marginBottom: "16px" }}
        >
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Full Name */}
          <label style={{ marginBottom: "4px" }}>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="border border-gray-300 rounded-2xl w-full outline-none"
            style={{ padding: "8px", marginBottom: "12px" }}
          />

          {/* Username */}
          <label style={{ marginBottom: "4px" }}>Username</label>
          <input
            type="text"
            placeholder="johndoe123"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className={`border rounded-2xl w-full outline-none ${
              usernameAvailable === false ? "border-red-500" : "border-gray-300"
            }`}
            style={{ padding: "8px", marginBottom: "4px" }}
          />
          {formData.username.trim().length > 2 && (
            <p
              className="text-sm"
              style={{
                marginBottom: "12px",
                color: usernameAvailable ? "green" : "red",
              }}
            >
              {isCheckingUsername
                ? "Checking availability..."
                : usernameAvailable
                ? "Username is available ✅"
                : "Username is taken ❌"}
            </p>
          )}

          {/* Email */}
          <label style={{ marginBottom: "4px" }}>Email</label>
          <input
            type="email"
            placeholder="johndoe@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border border-gray-300 rounded-2xl w-full outline-none"
            style={{ padding: "8px", marginBottom: "12px" }}
          />

          {/* Age */}
          <label style={{ marginBottom: "4px" }}>Age</label>
          <input
            type="number"
            placeholder="21"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="border border-gray-300 rounded-2xl w-full outline-none"
            style={{ padding: "8px", marginBottom: "12px" }}
          />

          {/* Password */}
          <label style={{ marginBottom: "4px" }}>Password</label>
          <input
            type="password"
            placeholder="********"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="border border-gray-300 rounded-2xl w-full outline-none"
            style={{ padding: "8px", marginBottom: "12px" }}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSigningUp}
            className="bg-amber-600 text-white font-bold rounded-2xl w-full hover:bg-amber-700"
            style={{ padding: "8px", marginTop: "8px" }}
          >
            {isSigningUp ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p
          className="text-center text-sm text-gray-600"
          style={{ marginTop: "12px" }}
        >
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Go to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
