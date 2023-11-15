import User from './User';
import Admin from './Admin';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScrollToTop from './jsx/ScrollToTop';
import NoMatch from './NoMatch';
import AdminLogin from './jsx/Admin/AdminLogin';
import AdminSignUp from './jsx/Admin/AdminSingUp';
import AdminHome from './jsx/Admin/AdminHome';
import UserAuth from './jsx/Member/UserAuth';

function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    return (
        <>
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    <Route path="/*" element={<User />}></Route>
                    <Route path="/admin/*" element={<AdminHome />}></Route>
                    <Route path="/admin/sign_in" element={<AdminLogin />}></Route>
                    <Route path="/admin/sign_up" element={<AdminSignUp />}></Route>
                    <Route path="*" element={<NoMatch />}></Route>

                    <Route path="/login/oauth2/callback/kakao" element={<UserAuth />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
