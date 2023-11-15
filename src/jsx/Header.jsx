import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/common/common.css';
import '../css/common/header.css';
import isUserLogin from '../js/api/config/userLogin_config';
import { useDispatch } from 'react-redux';
import { userStateAction } from '../js/api/redux_store/slice/userLoginSlice';
import { userInfoAction } from '../js/api/redux_store/slice/userInfoSlice';
import { useValidationItem } from '../js/api/VlidationItem';
import userInfo_config from '../js/api/config/userInfo_config';
import LogOutApi from '../js/api/LogOutApi';

const Header = ({
    setSelectedMenu,
    setSelectedSideMenu,
    setSelectedNotice,
    selectedUserLoginBtn,
    setSelectedUserLoginBtn,
}) => {
    const navigate = useNavigate();
    const dataDispatch = useDispatch();

    const headerMenuClickHandler = (headerMenuIndex) => {
        setSelectedMenu(headerMenuIndex);
        setSelectedSideMenu(1);
        setSelectedNotice(0);
    };

    const validateUserInfo = useValidationItem(); // 커스텀 Hook 사용

    const handleUserInfo = async () => {
        try {
            const response = await validateUserInfo('get', '/user/info', null);
            const responseUserInfo = {
                userProfile: response.img,
                userName: response.name,
                userPreNickname: response.nickname,
                userNickname: response.nickname,
                userEmail: response.email,
                userPhone: response.phone,
                userZipcode: response.zip_code,
                userAddress: response.address_detail1,
                userDetailAddress: response.address_detail2,
            };

            dataDispatch(userInfoAction.setUserInfo(responseUserInfo));
            navigate('/user_info');
        } catch (error) {
            console.log(error);
            dataDispatch(userStateAction.setState(false));
        }
    };

    const handleMyHit = () => {
        navigate('/user_myHit');
    };

    const handleMyFunding = () => {
        navigate('/user_myFunding');
    };

    const logOutHandler = () => {
        LogOutApi({ navigate, dataDispatch });
    };

    return (
        <>
            {isUserLogin.state === false && selectedUserLoginBtn === true && (
                // Login Page Header START
                <header>
                    <div id="header_wrap_login">
                        <div className="login_btn_main_page">
                            <Link to="/user_login" style={{ marginRight: '0px' }}>
                                <button
                                    type="button"
                                    className="btn btn-outline-dark login_btn"
                                    style={{ border: 'none' }}
                                >
                                    로그인
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>
                // Login Page Header END
            )}

            {isUserLogin.state === false && selectedUserLoginBtn === false && (
                <header>
                    <div id="header_wrap">
                        <div className="logo_wrap">
                            <Link to="/">
                                <img className="logo_img" src="/test_imgs/logo/logo.png" />
                                아기자기
                            </Link>
                        </div>
                        <div className="nav_bar row columns">
                            <ul className="menu *align-center *expanded text-center SMN_effect-14">
                                <li>
                                    <Link to="/" onClick={() => headerMenuClickHandler(0)}>
                                        홈
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/diary" onClick={() => headerMenuClickHandler(1)}>
                                        육아 기록
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/community" onClick={() => headerMenuClickHandler(2)}>
                                        육아 커뮤니티
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/notice/list" onClick={() => headerMenuClickHandler(3)}>
                                        공지사항
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="login_btn_main_page">
                            <Link to="/user_login">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark"
                                    style={{ border: 'none' }}
                                    onClick={() => setSelectedUserLoginBtn(true)}
                                >
                                    로그인
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>
            )}
            {/* After Login Page Header START*/}
            {isUserLogin.state === true && (
                <header>
                    <div id="header_wrap">
                        <div className="logo_wrap">
                            <Link to="/">
                                <img className="logo_img" src="/test_imgs/logo/logo.png" />
                                아기자기
                            </Link>
                        </div>
                        <div className="nav_bar row columns">
                            <ul className="menu *align-center *expanded text-center SMN_effect-14">
                                <li>
                                    <Link to="/" onClick={() => headerMenuClickHandler(0)}>
                                        홈
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/diary" onClick={() => headerMenuClickHandler(1)}>
                                        육아 기록
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/community" onClick={() => headerMenuClickHandler(2)}>
                                        육아 커뮤니티
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/notice/list" onClick={() => headerMenuClickHandler(3)}>
                                        공지사항
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="after_login_btn_main_page yg_font">
                            <div data-bs-toggle="dropdown" aria-expanded="false">
                                <a href="#none">
                                    <span>{userInfo_config.userNickname} 님</span>
                                    {/* <img className='header_user_profile_img' src='/test_imgs/png/profile.png' /> */}
                                    <img
                                        className="header_user_profile_img"
                                        src={userInfo_config.userProfile || '/test_imgs/png/profile.png'}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </a>
                            </div>
                            <ul
                                className="dropdown-menu"
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                <li>
                                    <button
                                        className="dropdown-item profile_dropdown_menu_li"
                                        type="button"
                                        onClick={handleUserInfo}
                                    >
                                        회원 정보 조회 및 수정
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item profile_dropdown_menu_li" type="button">
                                        좋아요한 게시물
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item profile_dropdown_menu_li"
                                        type="button"
                                        onClick={handleMyHit}
                                    >
                                        좋아요한 상품
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item profile_dropdown_menu_li"
                                        type="button"
                                        onClick={handleMyFunding}
                                    >
                                        펀딩 상품 조회
                                    </button>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item profile_dropdown_menu_li"
                                        onClick={() => logOutHandler()}
                                    >
                                        로그아웃
                                    </a>
                                </li>

                                {/* <li>
                                    <Link
                                        to="/user_info"
                                        className="dropdown-item profile_dropdown_menu_li"
                                        href="#none1"
                                    >
                                        회원 정보 조회 및 수정
                                    </Link>
                                </li>
                            
                                <li>
                                    <a className="dropdown-item profile_dropdown_menu_li" href="#none2">
                                        좋아요한 게시물
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item profile_dropdown_menu_li" href="#none3">
                                        좋아요한 상품
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item profile_dropdown_menu_li" href="#none4">
                                        구매 상품 조회
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item profile_dropdown_menu_li"
                                        href="#none5"
                                        onClick={() => logOutHandler()}
                                    >
                                        로그아웃
                                    </a>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </header>
            )}
            {/* After Login Page Header END*/}

            {/* Login Page Header START */}
            {/* {isLoggedIn === false && (
                <header>
                    <div id="header_wrap_login">
                        <div className="login_btn_main_page">
                            <Link to="/user_login" style={{ marginRight: '0px' }}>
                                <button
                                    type="button"
                                    className="btn btn-outline-dark login_btn"
                                    style={{ border: 'none' }}
                                >
                                    로그인
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>
            )} */}
            {/* Login Page Header END*/}
        </>
    );
};

export default Header;
