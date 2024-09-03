import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem('token') || false;
    if (!token) {
      navigate('/log-in');
    } else {
      axios.get('http://localhost:3001/user/profile', {
        headers: {
          Authorization: token
        }
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          navigate('/log-in');
        })
    }

  }, []);

  return (
    <div>
      <h2>User Profile</h2>
    </div>
  )
}

export default Profile