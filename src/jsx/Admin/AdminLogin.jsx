import React, { useState } from 'react';
import '../../css/admin/member/admin_login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminToken_config from '../../js/api/config/adminToken_config';
import { useDispatch } from 'react-redux';
import { adminTokenAction } from '../../js/api/redux_store/slice/adminTokenSlice';
import moment from 'moment';
import AdminTokenApi from '../../js/api/admin/AdminTokenApi';
import { adminStateAction } from '../../js/api/redux_store/slice/adminLoginSlice';
import { tr } from 'date-fns/locale';
import Swal from 'sweetalert2';

const AdminLogin = () => {
    const server = adminToken_config.server;
    const navigator = useNavigate();
    const adminDispatch = useDispatch();

    const [signInData, setSignInData] = useState({
        adminAccount: '',
        password: '',
    });

    const signInHandler = (event) => {
        const { name, value } = event.target;
        setSignInData({
            ...signInData,
            [name]: value,
        });
    };

    const signInSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${server}/admin/signIn`, signInData);

            if (response.data.adminGrade == 0) {
                Swal.fire({
                    icon: 'info',
                    title: '관리자 승인이 필요합니다',
                    html: '유저는 아직 승인되지 않았습니다.<br/><br/>관리자에게 문의하세요.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '확인',
                });
            } else {
                let adminGradeName;
                if (response.data.adminGrade == 1) adminGradeName = '관리자님';
                else if (response.data.adminGrade == 2) adminGradeName = '최고 관리자님';

                Swal.fire({
                    icon: 'success',
                    title: signInData.adminAccount + ' ' + adminGradeName,
                    text: '행복한 업무되세요!',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '확인',
                });
                adminDispatch(adminStateAction.setAdminAccount(signInData.adminAccount));
                adminDispatch(adminStateAction.setAdminGrade(response.data.adminGrade));
                adminDispatch(adminTokenAction.setAdminTokenName(response.data.accessToken));
                adminDispatch(
                    adminTokenAction.setAdminTokenExpired(moment().add(20, 'seconds').format('yyyy-MM-DD HH:mm:ss'))
                );
                adminDispatch(adminStateAction.setAdminState(true));
                navigator('/admin');
            }
        } catch (error) {
            if (error.response.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: '관리자 인증 실패',
                    text: '올바른 관리자 계정으로 다시 로그인하세요.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '확인',
                });
            } else console.log('error -> ' + error);
        }
    };

    return (
        <div className='admin_login_wrap'>
            <img src='/test_imgs/baby_imgs/baby10.jpg ' />
            <div className='admin_login_background'></div>
            <div className='input_admin_info_box_wrap' style={{ marginTop: '150px' }}>
                <div className='input_admin_info_box'>
                    <div className='logo_wrap_admin_login yg_font'>
                        <img className='logo_img' src='/test_imgs/logo/logo.png' />
                        <div>아기자기</div>
                    </div>
                    <div className='admin_login_title yg_font'>로그인</div>

                    <form onSubmit={signInSubmit}>
                        <div className='form-floating mb-2'>
                            <input
                                type='text'
                                name='adminAccount'
                                defaultValue={signInData.adminAccount}
                                onChange={signInHandler}
                                className='form-control custom_floating_label'
                                id='floatingInput'
                                placeholder='name@example.com'
                            />
                            <label htmlFor='floatingInput'>Admin Account*</label>
                        </div>
                        <div className='form-floating mb-4' style={{ marginBottom: '10px', paddingBottom: '0px' }}>
                            <input
                                type='password'
                                name='password'
                                defaultValue={signInData.password}
                                onChange={signInHandler}
                                className='form-control custom_floating_label'
                                id='floatingPassword'
                                placeholder='Password'
                            />
                            <label htmlFor='floatingPassword'>Password*</label>
                        </div>
                        {/* <form class="form-floating">
                        <input
                            type="email"
                            class="form-control is-invalid"
                            id="floatingInputInvalid"
                            placeholder="name@example.com"
                            value=""
                        />
                        <label for="floatingInputInvalid">Invalid input</label>
                    </form> */}
                        <div className='d-grid gap-2 mb-3 ' style={{ marginBottom: '10px' }}>
                            <button className='btn btn_admin_login' type='submit'>
                                Login
                            </button>
                        </div>
                    </form>

                    <div className='btn_for_admin_signup yg_font' style={{ paddingBottom: '30px', paddingTop: '10px' }}>
                        관리자 계정이 없으신가요? &nbsp;&nbsp;
                        <Link to='/admin/sign_up'>회원가입</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
