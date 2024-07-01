import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/home'
import User from './pages/user/user'
import Created from './pages/created/created'
import Complete from './pages/complete/complete'
import Login from './pages/login/login'



function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<User />} />
            <Route path="/created" element={<Created />} />
            <Route path="/complete" element={<Complete />} />
            <Route path="/login" element={<Login />} />

        </Routes>
    );
}

export default Router;