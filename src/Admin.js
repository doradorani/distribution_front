import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './jsx/Footer';
import ScrollToTop from './jsx/ScrollToTop';
import PostReport from './jsx/Admin/subpages/community/PostReport';
import UserSuspended from './jsx/Admin/subpages/member/UserSuspended';
import AdminHeader from './jsx/Admin/AdminHeader';
import AdminAuthorization from './jsx/Admin/subpages/member/AdminAuthorization';
import AdminCoBuyingList from './jsx/Admin/subpages/co-buying/AdminCo-BuyingList';
import AdminNoticeList from './jsx/Admin/subpages/noticeboard/AdminNotice';
import CommentReport from './jsx/Admin/subpages/community/CommentReport';

function Admin() {
    const [selectedMenu, setSelectedMenu] = useState(1);
    const [selectedSideMenu, setSelectedSideMenu] = useState(1);

    let mode;

    return (
        <>
            <ScrollToTop />
            {/* <div className="admin_container">
                <AdminHeader setSelectedMenu={setSelectedMenu} />
                <Routes>
                    <Route path="/" element={<AdminLogin />}></Route>
                    <Route
                        path="/user_suspended"
                        element={<UserSuspended setSelectedSideMenu={setSelectedSideMenu} />}
                    ></Route>
                    <Route
                        path="/admin_authorization"
                        element={<AdminAuthorization setSelectedSideMenu={setSelectedSideMenu} />}
                    ></Route>

                    <Route
                        path="/admin_post"
                        element={<AdminNoticeList setSelectedSideMenu={setSelectedSideMenu} />}
                    ></Route>
                    <Route
                        path="/post_report"
                        element={<PostReport setSelectedSideMenu={setSelectedSideMenu} />}
                    ></Route>
                    <Route
                        path="/comment_report"
                        element={<CommentReport setSelectedSideMenu={setSelectedSideMenu} />}
                    ></Route>
                    <Route
                        path="/co-buying_list"
                        element={<AdminCoBuyingList setSelectedSideMenu={setSelectedSideMenu} />}
                    ></Route>
                </Routes>
            </div> */}
            <Footer />
        </>
    );
}

export default Admin;
