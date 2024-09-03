import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../components/Home';
import Register from '../components/Register';
import LogIn from '../components/LogIn';
import Profile from '../components/Profile';
import Error from '../components/Error';
import Navbar from '../layout/Navbar';

const index = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>

                <Route path='/' element={<Home />} />
                <Route path='/register' element={<Register />} />
                <Route path='/log-in' element={<LogIn />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='*' element={<Error />} />

            </Routes>
        </BrowserRouter>
    )
}

export default index