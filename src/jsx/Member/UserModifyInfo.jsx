import React, { useEffect, useState } from 'react';
import '../../css/member/userModifyInfo.css';
import DaumPostcode from 'react-daum-postcode';
import userInfo_config from '../../js/api/config/userInfo_config';
import axios from 'axios';
import token_config from '../../js/api/config/token_config';
import { useValidationItem } from '../../js/api/VlidationItem';
import TokenApi from '../../js/api/TokenApi';
import { useNavigate } from 'react-router-dom';
import { userInfoAction } from '../../js/api/redux_store/slice/userInfoSlice';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

const UserModifyInfo = () => {
    const server = token_config.server;
    const validateUserInfo = useValidationItem(); // 커스텀 Hook 사용
    const validateModifyUserInfo = useValidationItem(); // 커스텀 Hook 사용
    const navigate = useNavigate();
    const dataDispatch = useDispatch();

    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStyle, setModalStyle] = useState('modal_for_add_profile_phote');

    // const [selectedFiles, setSelectedFiles] = useState([]);
    // const [byteCount, setByteCount] = useState(0);

    const [previewProfileImage, setpreviewProfileImage] = useState(null);
    const [userProfileImage, setUserProfileImage] = useState(null);
    const [userName, setUserName] = useState(userInfo_config.userName);
    const [userNickname, setUserNickname] = useState(userInfo_config.userNickname);
    const [userEmail, setUserEmail] = useState(userInfo_config.userEmail);
    const [userPhone, setUserPhone] = useState(userInfo_config.userPhone);
    const [userZipcode, setUserZipcode] = useState(userInfo_config.userZipcode);
    const [userAddress, setUserAddress] = useState(userInfo_config.userAddress);
    const [userDetailAddress, setUserDetailAddress] = useState(userInfo_config.userDetailAddress);

    const [dupChkValue, setDupChkValue] = useState('');

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        setUserProfileImage(userInfo_config.userProfile);
    }, []);

    const handleNicknameCheck = async () => {
        axios
            .get(`${server}/user/dupNickname` + '/' + userNickname)
            .then((response) => {
                if (response.data.data > 0) alert('이미 사용 중인 닉네임입니다.');
                else {
                    alert('사용 가능한 닉네임입니다.');
                    setDupChkValue(userNickname);
                }
            })
            .catch((error) => {
                console.error('에러 발생: ' + error);
            });
    };

    const handleUpdateUserInfo = () => {
        const updatedInfo = {
            name: userName,
            nickname: userNickname,
            email: userEmail,
            phone: userPhone,
            zip_code: userZipcode,
            address_detail1: userAddress,
            address_detail2: userDetailAddress,
        };

        let userModifyData = new FormData();
        userModifyData.append('file', userProfileImage);
        userModifyData.append('info', new Blob([JSON.stringify(updatedInfo)], { type: 'application/json' }));

        if (dupChkValue === userNickname || userNickname === userInfo_config.userPreNickname) {
            try {
                validateModifyUserInfo('post', '/user/modifyInfo', userModifyData)
                    .then((modifyResponse) => {
                        if (modifyResponse.success) {
                            return validateUserInfo('get', '/user/info');
                        } else {
                            console.log(modifyResponse.error);
                            Swal.fire({
                                title: '수정 중 문제가 발생하였습니다..',
                                icon: 'warning',
                                confirmButtonText: '확인',
                            });
                            navigate('/user_info');
                        }
                    })
                    .then((modifyInfoResponse) => {
                        if (modifyInfoResponse) {
                            const responseUserInfo = {
                                userProfile: modifyInfoResponse.img,
                                userName: modifyInfoResponse.name,
                                userPreNickname: modifyInfoResponse.nickname,
                                userNickname: modifyInfoResponse.nickname,
                                userEmail: modifyInfoResponse.email,
                                userPhone: modifyInfoResponse.phone,
                                userZipcode: modifyInfoResponse.zip_code,
                                userAddress: modifyInfoResponse.address_detail1,
                                userDetailAddress: modifyInfoResponse.address_detail2,
                            };

                            dataDispatch(userInfoAction.setUserInfo(responseUserInfo));
                            Swal.fire({
                                title: '수정이 완료되었습니다.',
                                icon: 'success',
                                confirmButtonText: '확인',
                            });
                            navigate('/user_info');
                        } else {
                            // 처리에 실패한 경우에 대한 처리
                            alert('서버에 문제가 생겨 다시 불러오기를 실패하였습니다.');
                            navigate('/user_info');
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        alert('서버에 문제가 생겼습니다. 다시 수정해주세요.');
                        navigate('/user_info');
                    });
            } catch (error) {
                console.log(error);
                alert('서버에 문제가 생겼습니다. 다시 수정해주세요.');
                navigate('/user_info');
            }
        } else {
            Swal.fire({
                title: '별명이 중복되었습니다. ',
                text: '다른 별명을 선택해주세요.',
                icon: 'warning',
                button: '확인',
            });
        }
    };

    const handleFileChange = (e) => {
        // 파일이 선택되었는지 체크

        if (e.target && e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // 미리보기 이미지 업데이트
            const reader = new FileReader();

            reader.onload = (e) => {
                setpreviewProfileImage(e.target.result);
            };

            reader.readAsDataURL(file);
            setUserProfileImage(file);
        }

        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }

        setModalStyle('modal_for_add_profile_phote');
        setIsModalOpen(false); // 파일 선택 시 모달 닫기
    };

    const deleteFiles = () => {
        setpreviewProfileImage('/test_imgs/png/profile.png');
        setUserProfileImage(null);
    };

    const handleOpenPostcode = () => {
        setIsPostcodeOpen(!isPostcodeOpen);
    };

    const complete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        setUserZipcode(data.zonecode);
        setUserAddress(fullAddress);
    };

    return (
        <div className='admin_login_wrap'>
            <div className='input_admin_info_box_wrap_for_signup' style={{ marginTop: '100px', marginBottom: '60px' }}>
                <div className='input_admin_info_box_for_signup' style={{ marginTop: '30px', marginBottom: '30px' }}>
                    <div className='admin_login_title yg_font' style={{ fontSize: '2.1em' }}>
                        회원정보 수정
                    </div>
                    <div className='user_modify_profile_wrap yg_font'>
                        <img
                            className='profile_img_for_modify'
                            src={previewProfileImage || userInfo_config.userProfile || '/test_imgs/png/profile.png'}
                            style={{ objectFit: 'cover' }}
                        />

                        <div
                            data-bs-toggle='modal'
                            data-bs-target='#modal_for_add_profile_phote'
                            className='add_a_photo_img'
                            onClick={(e) => setModalStyle('modal_for_add_profile_phote1')}
                        >
                            <img className='add_a_photo_img_log' src='/test_imgs/png/white_camera.png' />
                        </div>
                    </div>
                    <div className='form-floating mb-2'>
                        <input
                            type='text'
                            className='form-control custom_floating_label'
                            id='floatingInputName'
                            placeholder='이름'
                            defaultValue={userInfo_config.userName}
                            onChange={(e) => setUserName(e.target.value)}
                            style={{ paddingBottom: '3px' }}
                        />
                        <label htmlFor='floatingInputName'>
                            <span>이름</span>
                            &nbsp;
                            <span style={{ color: 'red ' }}>*</span>
                        </label>
                    </div>
                    <div
                        className='form-floating mb-2'
                        style={{
                            marginBottom: '10px',
                            paddingBottom: '0px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                        }}
                    >
                        <input
                            type='text'
                            className='form-control custom_floating_label'
                            id='floatingInputNickName'
                            placeholder='별명'
                            defaultValue={userInfo_config.userNickname}
                            onChange={(e) => setUserNickname(e.target.value)}
                            style={{ paddingBottom: '3px', width: '250px' }}
                        />
                        <label htmlFor='floatingInputNickName'>
                            <span>별명</span>s &nbsp;
                            <span style={{ color: 'red ' }}>*</span>
                        </label>

                        <button
                            type='button'
                            className='btn btn-outline-primary'
                            style={{ marginLeft: '15px', height: '38px' }}
                            onClick={handleNicknameCheck}
                        >
                            별명 중복체크
                        </button>
                    </div>

                    <div className='form-floating mb-2' style={{ marginBottom: '10px', paddingBottom: '0px' }}>
                        <input
                            type='email'
                            className='form-control custom_floating_label'
                            id='floatingInputEmail'
                            style={{ paddingBottom: '3px' }}
                            placeholder='E-mail'
                            defaultValue={userInfo_config.userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                        <label htmlFor='floatingInputEmail'>
                            <span>E-mail</span>
                            &nbsp;
                            <span style={{ color: 'red ' }}>*</span>
                        </label>
                    </div>
                    <div className='form-floating mb-2 ' style={{ marginBottom: '10px', paddingBottom: '0px' }}>
                        <input
                            type='number'
                            className='form-control custom_floating_label sign_up_phone'
                            id='floatingInputPhoneNumber'
                            placeholder='휴대 전화'
                            defaultValue={userInfo_config.userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            style={{ paddingBottom: '3px' }}
                        />
                        <label htmlFor='floatingInputPhoneNumber'>
                            <span>휴대 전화</span>
                            &nbsp;
                            <span style={{ color: 'red ' }}>*</span>
                            &nbsp;&nbsp;
                            <span>('-'를 빼고 입력해주세요.)</span>
                        </label>
                    </div>
                    <div
                        className='form-floating mb-1'
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
                            type='text'
                            className='form-control custom_floating_label'
                            id='floatingInputPostCode'
                            placeholder='Password'
                            style={{ paddingBottom: '3px', width: '250px' }}
                            defaultValue={userZipcode}
                        />
                        <label htmlFor='floatingInputPostCode'>
                            <span>우편 번호</span>
                            &nbsp;
                            <span style={{ color: 'red ' }}>*</span>
                        </label>
                        <button
                            type='button'
                            className='btn btn-outline-primary'
                            style={{ marginLeft: '15px', boxSizing: 'border-box' }}
                            onClick={(e) => handleOpenPostcode()}
                        >
                            우편번호 검색
                        </button>
                    </div>

                    {isPostcodeOpen && (
                        <div>
                            <DaumPostcode
                                autoClose
                                onComplete={complete}
                                style={{ height: '500px', marginBottom: '30px' }} // complete 함수는 원하는 우편번호 검색 결과 처리 로직을 구현해야 합니다.
                            />
                        </div>
                    )}

                    <div className='form-floating  mb-1 ' style={{ marginBottom: '10px', paddingBottom: '0px' }}>
                        <input
                            type='text'
                            className='form-control custom_floating_label sign_up_phone'
                            id='floatingInputAddress'
                            placeholder='주소'
                            style={{ paddingBottom: '3px' }}
                            defaultValue={userAddress}
                            onChange={(e) => setUserAddress(e.target.value)}
                        />
                        <label htmlFor='floatingInputAddress'>
                            <span>주소</span>
                            &nbsp;
                            <span style={{ color: 'red ' }}>*</span>
                        </label>
                    </div>

                    <div className='form-floating mb-4 ' style={{ paddingBottom: '10px' }}>
                        <input
                            type='text'
                            className='form-control custom_floating_label sign_up_phone'
                            id='floatingInputDetailAddress'
                            placeholder='상세 주소'
                            defaultValue={userInfo_config.userDetailAddress}
                            onChange={(e) => setUserDetailAddress(e.target.value)}
                            style={{ paddingBottom: '3px' }}
                        />
                        <label htmlFor='floatingInputDetailAddress'>
                            <span>상세 주소</span>
                        </label>
                    </div>

                    <div className='gap-3 flex' style={{ justifyContent: 'space-between' }}>
                        <button
                            className='btn btn_admin_login'
                            type='button'
                            style={{ width: '200px' }}
                            onClick={handleUpdateUserInfo}
                        >
                            수정하기
                        </button>
                        <button
                            className='btn btn_user_modify_cancel'
                            type='button'
                            style={{ width: '200px' }}
                            onClick={handleGoBack}
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
            {/* 회원 정보 수정 => 프로필 사진 선택 모달 START */}
            <div
                className='modal fade'
                id='modal_for_add_profile_phote'
                tabIndex='-1'
                aria-labelledby='exampleModalLabel'
                aria-hidden='true'
            >
                <div className='modal-dialog modal-lg modal-lg-text modal-dialog-centered modal-dialog-scrollable'>
                    <div className='modal-content'>
                        <div
                            className='modal-body mx-auto'
                            style={{ width: '450px', textAlign: 'center', fontWeight: 'bold' }}
                        >
                            <input
                                type='file'
                                accept='image/*'
                                id='fileInput'
                                encType='multipart/form-data'
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <div data-bs-dismiss='modal' onClick={handleFileChange}>
                                프로필 사진 선택하기
                            </div>
                            <hr />
                            <div data-bs-dismiss='modal' onClick={deleteFiles}>
                                프로필 사진 삭제
                            </div>
                            <hr />
                            <div data-bs-dismiss='modal' aria-label='Close'>
                                닫기
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 회원 정보 수정 => 프로필 사진 선택 모달 END */}
        </div>
    );
};

export default UserModifyInfo;
