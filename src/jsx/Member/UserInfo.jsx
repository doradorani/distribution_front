import React, { useEffect, useState } from 'react';
import '../../css/member/userModifyInfo.css';
import DaumPostcode from 'react-daum-postcode';
import { Link, unstable_HistoryRouter, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useValidationUser } from '../../js/api/ValidationApi';
import { userStateAction } from '../../js/api/redux_store/slice/userLoginSlice';
import userInfo_config from '../../js/api/config/userInfo_config';
import { userInfoAction } from '../../js/api/redux_store/slice/userInfoSlice';
import Swal from 'sweetalert2';
import { useValidationItem } from '../../js/api/VlidationItem';
import { tokenAction } from '../../js/api/redux_store/slice/tokenSlice';
import { userCobuyAction } from '../../js/api/redux_store/slice/userCobuySlice';

const UserInfo = () => {
    const [userPostCode, setUserPostCode] = useState('');
    const [userFullAddress, setUserFullAddress] = useState('');
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStyle, setModalStyle] = useState('modal_for_add_profile_phote');
    let i = 1;
    // const [selectedFiles, setSelectedFiles] = useState([]);
    // const [byteCount, setByteCount] = useState(0);

    const navigate = useNavigate();
    const dataDispatch = useDispatch();
    const validateSignOutUser = useValidationItem();

    const handleGoBack = () => {
        navigate(-1);
    };

    const signOutHandler = () => {
        Swal.fire({
            title: '정말 탈퇴하시겠습니까?',
            text: '이 작업은 취소할 수 없습니다!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '네, 탈퇴하겠습니다.',
            cancelButtonText: '아니오, 취소합니다.',
        }).then((result) => {
            if (result.isConfirmed) {
                validateSignOutUser('post', '/user/signOut').then((res) => {
                    if (res == 1) {
                        dataDispatch(tokenAction.setTokenName(''));
                        dataDispatch(tokenAction.setTokenExpired(''));
                        dataDispatch(userStateAction.setState(false));
                        dataDispatch(
                            userInfoAction.setUserInfo({
                                userProfile: '',
                                userName: '',
                                userNickname: '',
                                userEmail: '',
                                userPhone: '',
                                userZipcode: '',
                                userAddress: '',
                                userDetailAddress: '',
                            })
                        );
                        dataDispatch(userCobuyAction.setFund([]));
                        dataDispatch(userCobuyAction.setHit([]));
                        Swal.fire('탈퇴되었습니다!', '이용해 주셔서 감사합니다.', 'success');
                        navigate('/');
                    } else {
                        Swal.fire('탈퇴 권한이 없습니다..', '본인 인증이 필요합니다.', 'fail');
                    }
                });
            }
        });
    };

    return (
        <div className="admin_login_wrap">
            <div className="input_admin_info_box_wrap_for_signup" style={{ marginTop: '100px', marginBottom: '60px' }}>
                <div className="input_admin_info_box_for_signup" style={{ marginTop: '30px', marginBottom: '30px' }}>
                    <div className="admin_login_title yg_font" style={{ fontSize: '2.1em' }}>
                        회원정보
                    </div>
                    <div className="user_modify_profile_wrap yg_font">
                        <img
                            className="profile_img_for_modify"
                            src={userInfo_config.userProfile || '/test_imgs/png/profile.png'}
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control custom_floating_label"
                            id="floatingInputName"
                            placeholder="이름"
                            disabled={true}
                            defaultValue={userInfo_config.userName}
                            style={{ paddingBottom: '3px', borderRadius: '10px' }}
                        />
                        <label htmlFor="floatingInputName">
                            <span>이름</span>
                            &nbsp;
                            <span style={{ color: 'red ' }}>*</span>
                        </label>
                    </div>
                    <div
                        className="form-floating mb-2"
                        style={{
                            marginBottom: '10px',
                            paddingBottom: '0px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                        }}
                    >
                        <input
                            type="text"
                            className="form-control custom_floating_label"
                            id="floatingInputNickName"
                            placeholder="별명"
                            disabled={true}
                            defaultValue={userInfo_config.userNickname}
                            style={{ paddingBottom: '3px', width: '500px', borderRadius: '10px' }}
                        />
                        <label htmlFor="floatingInputNickName">
                            <span>별명</span>
                            &nbsp;
                            <span style={{ color: 'red ' }}>*</span>
                        </label>
                    </div>

                    <div className="form-floating mb-2" style={{ marginBottom: '10px', paddingBottom: '0px' }}>
                        <input
                            type="email"
                            className="form-control custom_floating_label"
                            id="floatingInputEmail"
                            style={{ paddingBottom: '3px', borderRadius: '10px' }}
                            placeholder="E-mail"
                            disabled={true}
                            defaultValue={userInfo_config.userEmail}
                        />
                        <label htmlFor="floatingInputEmail">
                            <span>E-mail</span>
                            &nbsp;
                            <span style={{ color: 'red ' }}>*</span>
                        </label>
                    </div>
                    <div className="form-floating mb-2 " style={{ marginBottom: '10px', paddingBottom: '0px' }}>
                        <input
                            type="number"
                            className="form-control custom_floating_label sign_up_phone"
                            id="floatingInputPhoneNumber"
                            placeholder="휴대 전화"
                            disabled={true}
                            defaultValue={userInfo_config.userPhone}
                            style={{ paddingBottom: '3px', borderRadius: '10px' }}
                        />
                        <label htmlFor="floatingInputPhoneNumber">
                            <span>휴대 전화</span>
                        </label>
                    </div>
                    <div
                        className="form-floating mb-1"
                        style={{
                            marginBottom: '10px',
                            paddingBottom: '0px',
                            boxSizing: 'border-box',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                        }}
                    >
                        <input
                            type="text"
                            className="form-control custom_floating_label"
                            id="floatingInputPostCode"
                            placeholder="Password"
                            style={{ paddingBottom: '3px', width: '500px', borderRadius: '10px' }}
                            disabled={true}
                            defaultValue={userInfo_config.userZipcode}
                        />
                        <label htmlFor="floatingInputPostCode">
                            <span>우편 번호</span>
                        </label>
                    </div>

                    <div className="form-floating  mb-1 " style={{ marginBottom: '10px', paddingBottom: '0px' }}>
                        <input
                            type="text"
                            className="form-control custom_floating_label sign_up_phone"
                            id="floatingInputAddress"
                            placeholder="주소"
                            disabled={true}
                            defaultValue={userInfo_config.userAddress}
                            style={{ paddingBottom: '3px', borderRadius: '10px' }}
                        />
                        <label htmlFor="floatingInputAddress">
                            <span>주소</span>
                        </label>
                    </div>

                    <div className="form-floating mb-4 " style={{ paddingBottom: '10px' }}>
                        <input
                            type="text"
                            className="form-control custom_floating_label sign_up_phone"
                            id="floatingInputDetailAddress"
                            placeholder="상세 주소"
                            disabled={true}
                            defaultValue={userInfo_config.userDetailAddress}
                            style={{ paddingBottom: '3px', borderRadius: '10px' }}
                        />
                        <label htmlFor="floatingInputDetailAddress">
                            <span>상세 주소</span>
                        </label>
                    </div>

                    <div className="gap-3 flex" style={{ justifyContent: 'space-between', paddingBottom: '10px' }}>
                        <button className="btn btn_admin_login" type="button" style={{ width: '500px' }}>
                            <Link
                                to="/user_modify_info"
                                className="dropdown-item profile_dropdown_menu_li"
                                href="#none1"
                            >
                                수정하기
                            </Link>
                        </button>
                        <button
                            className="btn btn_admin_login"
                            type="button"
                            style={{ width: '500px' }}
                            onClick={handleGoBack}
                        >
                            뒤로가기
                        </button>
                    </div>

                    <div className="gap-3 flex" style={{ justifyContent: 'space-between' }}>
                        <button
                            className="btn btn_admin_login"
                            type="button"
                            style={{ width: '500px' }}
                            onClick={signOutHandler}
                        >
                            탈퇴하기
                        </button>
                    </div>
                </div>
            </div>
            {/* 회원 정보 수정 => 프로필 사진 선택 모달 START */}
            <div
                className="modal fade"
                id="modal_for_add_profile_phote"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            ></div>
            {/* 회원 정보 수정 => 프로필 사진 선택 모달 END */}
        </div>
    );
};

export default UserInfo;
