import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formState, setFormState] = useState({
    userName: '',
    password: ''
  });
  const navigate = useNavigate();

  useEffect(()=>{
    const token = window.localStorage.getItem('token') || false;
    if (token) {
      navigate('/profile');
    }
  }, []);

  const handleForm = useCallback((e) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  }, []);

  const handleFormSubmit = useCallback(() => {
    axios.post('http://localhost:3001/user/register', { userName: formState.userName, password: formState.password })
      .then(() => {
        console.log('User registered successfully');
        navigate('/log-in')
      })
      .catch((err) => {
        console.log(err);
        navigate('/register');
      })

  }, [formState.password, formState.userName, navigate]);

  return (
    <div>
      <h2>Register</h2>
      <input type='text' placeholder='User name' id='userName' value={formState.userName} onChange={(e) => handleForm(e)} required></input>
      <input type='password' placeholder='Password' id='password' value={formState.password} onChange={(e) => handleForm(e)} required></input>
      <button onClick={handleFormSubmit}>Register</button>
    </div>
  )
}

export default Register