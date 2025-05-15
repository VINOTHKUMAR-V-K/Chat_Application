import React, { useState } from "react";
import API from "../../utils/api"
import '../../style/login.css'
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate=useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/auth/login", formData);
      const { token, user } = response.data;
      localStorage.setItem("jwtToken", token); // Store JWT in localStorage
      localStorage.setItem("userData", JSON.stringify(user));
      setMessage("Login successful!");
      navigate("/home")
    } catch (error) {
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className="bg">
      <div className="login-box" >
        <div>
        <h2 className="py-3 fw-bold">Login</h2> 
          <form className="login-form" onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <br />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <br/>
            <p>New to ChatApp? <a href="/register">Join Now...</a></p>
            <button type="submit" className="btn btn-outline-danger">Login</button>
          </form>
        </div>
        <br/>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Login;
