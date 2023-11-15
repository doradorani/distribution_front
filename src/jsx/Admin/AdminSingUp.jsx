import React, { useState } from 'react';
import '../../css/admin/member/admin_login.css';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import token_config from "../../js/api/config/token_config";

const AdminSignUp = () => {

    const server = token_config.server;
    const navigator = useNavigate();

    const [signUpData, setSignUpData] = useState({
        adminAccount: '',
        password: '',
        name: '',
        email: '',
        phoneNumber: '',
    });

    const signUpHandler = (event) => {
        const { name, value } = event.target;
        setSignUpData({
            ...signUpData,
            [name]: value,
        });
    };

    const signUpSubmit = async (event) => {
        event.preventDefault();
        try {
            // POST 요청을 보내는 부분
            const response = await axios.post(`${server}/admin/signUp`, signUpData);

            if(response.data.data === 1) {
                alert('등록에 성공하였습니다.');
                navigator('/admin/sign_in');
            }
            else if(response.data.data === 0) alert('이미 등록된 관리자입니다');
        } catch (error) {
            alert('서버에 문제로 등록에 실패하였습니다.');
        }
    };

    return (
        <div className="admin_login_wrap">
            <img src="/test_imgs/baby_imgs/baby10.jpg" alt="baby" />
            <div className="admin_login_background"></div>
            <div className="input_admin_info_box_wrap_for_signup" style={{ marginTop: '40px' }}>
                <div className="input_admin_info_box_for_signup">
                    <div className="logo_wrap_admin_login yg_font">
                        <img className="logo_img" src="/test_imgs/logo/logo.png" alt="logo" />
                        <div>아기자기</div>
                    </div>
                    <div className="admin_login_title yg_font">회원가입</div>

                    <form onSubmit={signUpSubmit}>
                        <div className="form-floating mb-2" >
                            <input
                                type="text"
                                name="adminAccount"
                                defaultValue={signUpData.adminAccount}
                                onChange={signUpHandler}
                                className="form-control custom_floating_label"
                                id="adminAccount"
                                placeholder="Admin Account"
                            />
                            <label htmlFor="adminAccount">Admin Account*</label>
                        </div>
                        <div className="form-floating mb-2">
                            <input
                                type="password"
                                name="password"
                                defaultValue={signUpData.password}
                                onChange={signUpHandler}
                                className="form-control custom_floating_label"
                                id="password"
                                placeholder="Password"
                            />
                            <label htmlFor="password">Password*</label>
                        </div>
                        <div className="form-floating mb-2">
                            <input
                                type="text"
                                name="name"
                                defaultValue={signUpData.name}
                                onChange={signUpHandler}
                                className="form-control custom_floating_label"
                                id="name"
                                placeholder="Name"
                            />
                            <label htmlFor="name">Name*</label>
                        </div>
                        <div className="form-floating mb-2">
                            <input
                                type="email"
                                name="email"
                                defaultValue={signUpData.email}
                                onChange={signUpHandler}
                                className="form-control custom_floating_label"
                                id="email"
                                placeholder="Email Address"
                            />
                            <label htmlFor="email">Email Address*</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="tel"
                                name="phoneNumber"
                                defaultValue={signUpData.phoneNumber}
                                onChange={signUpHandler}
                                className="form-control custom_floating_label sign_up_phone"
                                id="phoneNumber"
                                placeholder="Phone Number ('-'를 빼고 입력해주세요.)"
                            />
                            <label htmlFor="phoneNumber">Phone Number*</label>
                        </div>
                        <div className="d-grid gap-2 mb-2">
                            <button type="submit" className="btn btn_admin_login">
                                Sign-up
                            </button>
                        </div>
                    </form>


                    <div className="btn_for_admin_signup yg_font">
                        이미 계정이 있으신가요? &nbsp;&nbsp;
                        <Link to="/admin/sign_in">로그인</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSignUp;
