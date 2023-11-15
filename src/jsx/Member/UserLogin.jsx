import React, { useEffect } from 'react';
import '../../css/member/userLogin.css';
import { KAKAO_AUTH_URL } from '../../js/api/OAuth';
import { Link } from 'react-router-dom';

const UserLogin = ({ setSelectedUserLoginBtn }) => {
    useEffect(() => {
        setSelectedUserLoginBtn(true);
    }, []);

    return (
        <div className='user_login_wrap'>
            <Link className='logo_wrap_user_login_link' to='/'>
                <div className='logo_wrap_user_login yg_font' onClick={() => setSelectedUserLoginBtn(false)}>
                    <img className='logo_img' src='/test_imgs/logo/logo.png' />
                    <div>아기자기</div>
                </div>
            </Link>
            <div className='user_login_title yg_font'>로그인</div>
            <button className='kakao_login_box_btn'>
                <div className='kakao_login_box'>
                    <div className='user_login_img'>
                        <img src='/test_imgs/png/kakao-talk.png' />
                    </div>
                    <div className='user_login_text_box yg_font'>
                        <a href={KAKAO_AUTH_URL}>카카오로 3초만에 시작하기</a>
                    </div>
                </div>
            </button>
            {/* <div className="link_to_sign_up yg_font">
                아직 아기자기 계정이 없나요?&nbsp;&nbsp;&nbsp;
                <a href="/user_sign_up">회원가입</a>
            </div> */}
        </div>
    );
};

export default UserLogin;
