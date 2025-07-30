import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
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
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col"
        >
          <label className="text-sm font-medium" style={{ marginBottom: "4px" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="jondoe@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border border-gray-300 rounded-2xl w-full outline-none"
            required
            style={{ padding: "8px", marginBottom: "12px" }}
          />

          <label className="text-sm font-medium" style={{ marginBottom: "4px" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="********"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="border border-gray-300 rounded-2xl w-full outline-none"
            required
            style={{ padding: "8px", marginBottom: "12px" }}
          />

          <button
            type="submit"
            disabled={isLoggingIn}
            className="bg-amber-600 text-white font-bold rounded-2xl w-full hover:bg-amber-700"
            style={{ padding: "8px", marginTop: "8px" }}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className="text-center text-sm text-gray-600"
          style={{ marginTop: "12px" }}
        >
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline"
          >
            Go to Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
