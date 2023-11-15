import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import AdminHeader from './AdminHeader';
import AdminSidbar from './AdminSidebar';
import UserSuspended from './subpages/member/UserSuspended';
import AdminAuthorization from './subpages/member/AdminAuthorization';
import AdminNoticeList from './subpages/noticeboard/AdminNotice';
import PostReport from './subpages/community/PostReport';
import CommentReport from './subpages/community/CommentReport';
import AdminCoBuyingList from './subpages/co-buying/AdminCo-BuyingList';
import ScrollToTop from '../ScrollToTop';
import WriteNotice from './subpages/noticeboard/WriteNotice';
import { useValidationAdmin } from '../../js/api/admin/ValidationAdminApi';

import '../../css/common/adminCommon.css';
import RegistProduct from './subpages/co-buying/RegistProduct';
import AdminDetailNotice from './subpages/noticeboard/AdminDetailNotice';
import ModifyNotice from './subpages/noticeboard/ModifyNotice';
import AdminCoBuyingDetail from './subpages/co-buying/AdminCoBuyingDetail';
import AdminNoneAuthorization from './subpages/member/AdminNoneAuthorization';
import UserDetail from './subpages/member/UserDetail';
import AdminModify from './subpages/member/AdminModify';

const AdminHome = () => {
    const [adminData, setAdminData] = useState();
    const [isSidebarCollapsed, setisSidebarCollapsed] = useState(true);
    const [reportIndex, setReportIndex] = useState(0);
    const [postIndex, setPostIndex] = useState(0);
    const navigate = useNavigate();
    const validationAdmin = useValidationAdmin('post', '/admin/validate');
    useEffect(() => {
        async function validateAdmin() {
            try {
                const response = await validationAdmin();
                setAdminData(response);
            } catch (error) {
                navigate('/admin/sign_in');
                console.log(error);
            }
        }
        validateAdmin();
    }, []);
    //======================================//

    return (
        <>
            <ScrollToTop />
            <AdminHeader />
            <div className='admin_container'>
                <AdminSidbar isSidebarCollapsed={isSidebarCollapsed} setisSidebarCollapsed={setisSidebarCollapsed} />
                <div className='admin_content_section_wrap'>
                    <Routes>
                        {/* <Route path="/user_suspended" element={<UserSuspended selectedMenu={selectedMenu} />}></Route> */}
                        <Route path='/user_suspended' element={<UserSuspended />}></Route>
                        <Route path='/user_detail' element={<UserDetail />}></Route>
                        <Route path='/admin_modify' element={<AdminModify />}></Route>
                        <Route path='/admin_authorization' element={<AdminAuthorization />}></Route>
                        <Route path='/admin_none_authorization' element={<AdminNoneAuthorization />}></Route>
                        <Route path='/admin_notice' element={<AdminNoticeList />}></Route>
                        <Route path='/admin_notice_detail' element={<AdminDetailNotice />}></Route>
                        <Route path='/write_admin_notice' element={<WriteNotice />}></Route>
                        <Route path='/modify_admin_notice' element={<ModifyNotice />}></Route>
                        <Route
                            path='/post_report'
                            element={
                                <PostReport
                                    isSidebarCollapsed={isSidebarCollapsed}
                                    postIndex={postIndex}
                                    setPostIndex={setPostIndex}
                                    reportIndex={reportIndex}
                                    setReportIndex={setReportIndex}
                                />
                            }
                        ></Route>
                        <Route
                            path='/comment_report'
                            element={
                                <CommentReport
                                    isSidebarCollapsed={isSidebarCollapsed}
                                    reportIndex={reportIndex}
                                    setReportIndex={setReportIndex}
                                />
                            }
                        ></Route>
                        <Route path='/co-buying_list' element={<AdminCoBuyingList />}></Route>
                        <Route path='/regist_product' element={<RegistProduct />}></Route>
                        <Route path='/co-buying_detail' element={<AdminCoBuyingDetail />}></Route>
                    </Routes>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default AdminHome;
