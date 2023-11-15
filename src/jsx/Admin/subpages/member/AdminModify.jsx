import React, { useEffect, useState } from 'react';
import '../../../../css/admin/member/admin_authorization.css';
import AdminSidbar from '../../AdminSidebar';
import adminToken_config from '../../../../js/api/config/adminToken_config';
import { useValidationAdminItem } from '../../../../js/api/admin/ValidationAdminItem';
import Swal from 'sweetalert2';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import adminLogin_config from '../../../../js/api/config/adminLogin_config';
import { adminStateAction } from '../../../../js/api/redux_store/slice/adminLoginSlice';
import { useDispatch } from 'react-redux';

const AdminModify = ({ selectedMenu }) => {
    const validateModifyAdminInfo = useValidationAdminItem();
    const navigate = useNavigate();
    const modifyAdminDispatch = useDispatch();

    const [adminId, setAdminId] = useState();
    const [adminPw, setAdminPw] = useState('');
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPhone, setAdminPhone] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const res = await validateModifyAdminInfo('get', '/admin/myAdminInfo/' + adminLogin_config.account);

                if (isMounted) {
                    if (res.success) {
                        setAdminId(res.data.id);
                        setAdminName(res.data.name);
                        setAdminEmail(res.data.email);
                        setAdminPhone(res.data.phone);
                    } else {
                        alert('서버 통신 중 에러가 발생하였습니다. 다시 시도해주세요.');
                        navigate(-1);
                    }
                }
            } catch (error) {
                console.log('error : ' + error);
                alert('관리자 정보가 유효하지 않습니다. 다시 로그인 해주세요.');
                navigate(-1);
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Set the flag to false when the component is unmounted
        };
    }, []);

    const handleUpdateAdminInfo = () => {
        console.log(adminLogin_config.account);

        const updatedInfo = {
            id: adminId,
            pw: adminPw,
            name: adminName,
            email: adminEmail,
            phone: adminPhone,
            currentId: adminLogin_config.account,
        };

        let adminModifyData = new FormData();
        adminModifyData.append('info', new Blob([JSON.stringify(updatedInfo)], { type: 'application/json' }));

        try {
            validateModifyAdminInfo('put', '/admin/modifyInfo', adminModifyData).then((res) => {
                if (res.data === 0) {
                    Swal.fire({
                        title: '수정 실패',
                        text: '이미 사용 중인 아이디입니다.',
                        icon: 'error',
                        confirmButtonText: '확인',
                    });
                    navigate('/admin/admin_modify');
                } else if (res.success) {
                    Swal.fire({
                        title: '수정 성공',
                        text: '수정에 성공했습니다.',
                        icon: 'success',
                        confirmButtonText: '확인',
                    });
                    modifyAdminDispatch(adminStateAction.setAdminAccount(adminId));
                    navigate('/admin/admin_modify');
                } else {
                    Swal.fire({
                        title: '수정 실패',
                        text: '서버 문제로 실패했습니다. 다시 시도해주세요.',
                        icon: 'error',
                        confirmButtonText: '확인',
                    });
                }
            });
        } catch (error) {
            console.log('error : ' + error);
            Swal.fire({
                title: '수정 실패',
                text: '관리자 로그인을 다시 시도해주세요.',
                icon: 'error',
                confirmButtonText: '확인',
            });
        }
    };

    const passwordChangeHandler = async () => {
        let isPasswordVisible = false;

        const { value: passwordValue, isConfirmed } = await Swal.fire({
            title: '비밀번호 변경',
            input: 'password',
            inputPlaceholder: 'Enter your new password',
            inputValue: adminPw,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            customClass: {
                input: 'password-input',
                footer: 'password-footer',
            },
            footer: `
            <div id="toggleButton" style="cursor: pointer;">
              <img id="toggleImage" src="/test_imgs/password/passwordIcon.png" alt="Toggle Icon" style="width: 20px; height: 20px;" />
            </div>
          `,
            didOpen: () => {
                const toggleButton = document.getElementById('toggleButton');
                const toggleImage = document.getElementById('toggleImage');

                if (toggleButton && toggleImage) {
                    toggleButton.addEventListener('click', () => {
                        const inputField = document.querySelector('.password-input');
                        if (inputField) {
                            const isPasswordField = inputField.type === 'password';
                            inputField.type = isPasswordField ? 'text' : 'password';

                            isPasswordVisible = !isPasswordVisible;
                            toggleImage.src = isPasswordVisible
                                ? '/test_imgs/password/nonePasswordIcon.png'
                                : '/test_imgs/password/passwordIcon.png';
                        }
                    });
                }
            },
        });

        if (isConfirmed) {
            if (passwordValue !== '') {
                setAdminPw(passwordValue);
                await Swal.fire({
                    title: '비밀번호 저장 완료',
                    text: '수정하기 버튼을 누르면 비밀번호 수정이 완료됩니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                });
            } else {
                await Swal.fire({
                    title: '변경사항 없음',
                    html: '입력한 내용이 없습니다.<br/>비밀번호 변경이 취소되었습니다.',
                    icon: 'info',
                    confirmButtonText: '확인',
                });
            }
        }
    };

    return (
        <div className='input_admin_info_box_wrap_for_signup' style={{ marginTop: '40px' }}>
            <div className='input_admin_info_box_for_signup'>
                <div className='admin_login_title yg_font'>관리자 수정</div>
                <div className='form-floating mb-2'>
                    <input
                        type='text'
                        name='adminAccount'
                        defaultValue={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        className='form-control custom_floating_label'
                        id='adminAccount'
                        placeholder='Admin Account'
                    />
                    <label htmlFor='adminAccount'>Admin Account*</label>
                </div>

                <div
                    className='form-floating mb-2'
                    style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                >
                    <input
                        type='password'
                        name='password'
                        defaultValue='********'
                        //onChange={signUpHandler}
                        className='form-control custom_floating_label'
                        id='adminPassword'
                        disabled={true}
                        style={{ borderRadius: '8px', paddingRight: '40px' }}
                    />
                    <button
                        type='button'
                        className='btn btn-primary'
                        onClick={passwordChangeHandler}
                        style={{ position: 'absolute', top: '50%', right: '5px', transform: 'translateY(-50%)' }}
                    >
                        변경
                    </button>
                    <label htmlFor='Password'>Password*</label>
                </div>

                <div className='form-floating mb-2'>
                    <input
                        type='text'
                        name='name'
                        defaultValue={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className='form-control custom_floating_label'
                        id='name'
                        placeholder='Name'
                    />
                    <label htmlFor='name'>Name*</label>
                </div>
                <div className='form-floating mb-2'>
                    <input
                        type='email'
                        name='email'
                        defaultValue={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className='form-control custom_floating_label'
                        id='email'
                        placeholder='Email Address'
                    />
                    <label htmlFor='email'>Email Address*</label>
                </div>
                <div className='form-floating mb-3'>
                    <input
                        type='tel'
                        name='phoneNumber'
                        defaultValue={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        className='form-control custom_floating_label sign_up_phone'
                        id='phoneNumber'
                        placeholder="Phone Number ('-'를 빼고 입력해주세요.)"
                    />
                    <label htmlFor='phoneNumber'>Phone Number*</label>
                </div>
                <div className='d-grid gap-2 mb-2'>
                    <button type='submit' className='btn btn_admin_login' onClick={handleUpdateAdminInfo}>
                        수정하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminModify;
