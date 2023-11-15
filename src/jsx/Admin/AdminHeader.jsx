import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/common/common.css';
import '../../css/common/adminheader.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import adminToken_config from '../../js/api/config/adminToken_config';
import { adminTokenAction } from '../../js/api/redux_store/slice/adminTokenSlice';
import { adminStateAction } from '../../js/api/redux_store/slice/adminLoginSlice';
import adminLogin_config from '../../js/api/config/adminLogin_config';
import Swal from 'sweetalert2';

const AdminHeader = ({ setSelectedMenu }) => {
    // const [isAdminSidebarOpen, setisAdminSidebarOpen] = useState(false);

    const adminTokenName = adminToken_config.tokenName;
    const server = adminToken_config.server;
    const navigate = useNavigate();
    const adminLoginDispatch = useDispatch();
    const adminTokenDispatch = useDispatch();

    const adminLogOut = async () => {
        const confirmAdminLogout = await Swal.fire({
            title: '로그아웃 확인',
            text: '정말 로그아웃 하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        });

        if (confirmAdminLogout.isConfirmed) {
            try {
                await axios.post(`${server}/admin/logOut`);
                adminLoginDispatch(adminStateAction.setAdminGrade(0));
                adminLoginDispatch(adminStateAction.setAdminAccount(''));
                adminLoginDispatch(adminStateAction.setAdminState(false));
                adminTokenDispatch(adminTokenAction.setAdminTokenName(''));
                adminTokenDispatch(adminTokenAction.setAdminTokenExpired(''));
                Swal.fire({
                    icon: 'success',
                    title: '로그아웃 성공',
                    text: '로그아웃에 성공하였습니다.',
                }).then(() => {
                    navigate('/admin/sign_in');
                });
            } catch (error) {
                console.error('에러 : ', error);
                Swal.fire({
                    icon: 'error',
                    title: '에러 발생',
                    text: '로그아웃 중 에러가 발생했습니다.',
                });
            }
        }
    };

    const adminGradeText =
        adminLogin_config.grade === 1 ? '관리자님' : adminLogin_config.grade === 2 ? '최고관리자님' : '';

    return (
        <>
            {/* Admin Page Header START*/}
            {
                <header>
                    <div id='admin_header_wrap'>
                        <div className='admin_logo_container'>
                            <Link to='/admin' className='flex'>
                                <img className='admin_logo_img' src='/test_imgs/logo/logo.png' />
                                <span style={{ marginLeft: '10px' }}>아기자기</span>
                                <span style={{ marginLeft: '5px', paddingTop: '15px', fontSize: '0.6em' }}>admin</span>
                            </Link>
                        </div>
                        <div className='admin_btn_page'>
                            <span
                                className='yg_font'
                                style={{ marginTop: '3px', fontWeight: 'bold', fontSize: '1.3rem' }}
                            >
                                {adminLogin_config.account} {adminGradeText}
                            </span>
                            <Link to='/admin/admin_modify'>
                                <input
                                    type='button'
                                    className='btn btn-outline-dark admin_btn'
                                    style={{ border: 'none' }}
                                    value='회원 수정'
                                    // onClick={() => {
                                    //     setSelectedMenu(7);
                                    // }}
                                />
                            </Link>

                            <input
                                type='button'
                                className='btn btn-outline-dark admin_btn'
                                style={{ border: 'none' }}
                                value='로그아웃'
                                onClick={() => {
                                    adminLogOut();
                                }}
                            />
                        </div>
                    </div>
                </header>
            }
            {/* Admin Page Header END*/}
        </>
    );
};

export default AdminHeader;
