import React, { useState } from "react";
import API from "../../utils/api"
import '../../style/register.css'
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/auth/register", formData);
      setMessage("Registration successful!");
      navigate("/")

    } catch (error) {
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="bg">
      <div className="register-box">
      <h2 className="py-3 fw-bold">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <br/>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <br/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <br/>
        <button type="submit" className="btn btn-outline-danger reg">Register</button>
      </form>
      <p>{message}</p>
      </div>
    </div>
  );
};

export default Register;
