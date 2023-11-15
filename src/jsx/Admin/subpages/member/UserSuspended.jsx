import React, { useEffect, useState } from 'react';
import '../../../../css/admin/member/admin_authorization.css';
import AdminSidbar from '../../AdminSidebar';
import adminToken_config from '../../../../js/api/config/adminToken_config';
import { useValidationAdminItem } from '../../../../js/api/admin/ValidationAdminItem';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const UserSuspended = ({ selectedMenu }) => {
    const server = adminToken_config.server;
    const validateUserManage = useValidationAdminItem();
    const navigate = useNavigate();

    const [userManageList, setUserManageList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [listCnt, setListCnt] = useState(0);
    const [perPage] = useState(10);
    const [updateUserNo, setUpdateUserNo] = useState();
    const [isLoading, setIsLoading] = useState(false);

    // 페이지네이션을 10개씩 보이도록 수정
    const itemsPerPage = 10;
    const startPage = Math.floor((currentPage - 1) / itemsPerPage) * itemsPerPage + 1;
    const endPage = Math.min(startPage + itemsPerPage - 1, totalPages);

    useEffect(() => {
        const userManageList = async () => {
            try {
                validateUserManage('get', '/admin/userManageList/' + currentPage + '/' + perPage).then((res) => {
                    if (res.success) {
                        const processedData = res.data.userManageListDtos.map((user) => ({
                            ...user,
                            reg_date: formatDate(user.reg_date),
                            mod_date: formatDate(user.mod_date),
                        }));
                        setUserManageList(processedData);
                        setTotalPages(res.data.totalPages);
                        setListCnt(res.data.totalPages);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '통신 중 문제가 생겼습니다',
                            text: '다시 시도해주세요.',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: '확인',
                        });
                    }
                });

                setIsLoading(true);
            } catch (error) {
                console.log('error : ' + error);
            } finally {
                setIsLoading(false);
                setUpdateUserNo('');
            }
        };
        userManageList();
    }, [currentPage, updateUserNo]);

    const userManageListHandler = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const formatDate = (dateArray) => {
        if (!dateArray || dateArray.length !== 6) {
            return 'Invalid Date';
        }

        const [year, month, day, hour, minute, second] = dateArray;

        // 월, 일, 시, 분, 초가 한 자리 숫자일 경우 앞에 0을 추가
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        const formattedMinute = minute < 10 ? `0${minute}` : minute;
        //const formattedSecond = second < 10 ? `0${second}` : second;

        // 'xxxx-xx-xx xx:xx:xx' 형태로 반환
        // return `${year}-${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}:${formattedSecond}`;
        return `${year}-${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}`;
    };

    const userDetailHandler = (email) => {
        try {
            validateUserManage('get', '/admin/showUserDetail/' + email).then((res) => {
                if (res.success) {
                    navigate('/admin/user_detail', { state: res.data });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '실패',
                        text: '서버에 문제가 생겨 실패하였습니다. 다시 시도해주세요.',
                    });
                }
            });
        } catch (error) {
            console.error('error: ', error);
            Swal.fire({
                icon: 'error',
                title: '에러',
                text: '서버에 문제가 생겨 실패하였습니다. 다시 시도해주세요.',
            });
        }
    };

    const userManageHandler = (no, status) => {
        Swal.fire({
            title: '권한을 입력하세요',
            input: 'select',
            inputOptions: {
                0: '탈퇴',
                1: '활성화',
                2: '제재',
            },
            inputPlaceholder: '상태를 변경하세요',
            inputValue: status, // 기본값 설정
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then((result) => {
            if (result.isConfirmed) {
                const statusData = result.value;
                try {
                    validateUserManage('put', '/admin/updateUserStatus/' + no + '/' + statusData).then((res) => {
                        if (res.success && res.data == 1) {
                            Swal.fire('업데이트 완료', '상태가 업데이트되었습니다.', 'success');
                            setUpdateUserNo(no);
                        } else {
                            Swal.fire('업데이트 실패', '서버 오류가 발생했습니다.', 'error');
                        }
                    });
                } catch (error) {
                    Swal.fire('에러', '예상치 못한 오류가 발생했습니다.', 'error');
                }
            }
        });
    };

    return (
        <div className='admin_authorization_wrap nn_font'>
            <div className='admin_page_menu_title_wrap'>
                <img src='/test_imgs/svg/group.svg' />
                <div className='admin_page_menu_title yg_font '>유저 관리</div>
            </div>
            <div className='admin_authorization_second_wrap'>
                <table className='admin_authorization table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>이름</th>
                            <th>아이디</th>
                            <th>이메일</th>
                            <th>핸드폰 번호</th>
                            <th>가입일자</th>
                            <th>수정일자</th>
                            <th>상태</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userManageList.map((user, index) => (
                            <tr key={index} onClick={() => userDetailHandler(user.email)}>
                                <td>{user.no}</td>
                                <td>{user.name}</td>
                                <td>{user.nickname}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.reg_date}</td>
                                <td>{user.mod_date}</td>
                                <td>{user.status}</td>
                                <td
                                    style={{
                                        padding: '0px',
                                        paddingTop: '4px',
                                    }}
                                >
                                    <button
                                        type='button'
                                        className='btn btn-light '
                                        style={{
                                            fontFamily: 'NanumSquareRound',
                                            margin: '0',
                                            padding: '3px 7px ',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // 이벤트 전파 방지
                                            userManageHandler(user.no, user.status);
                                        }}
                                    >
                                        상태 변경
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div aria-label='Page navigation example' style={{ marginTop: '10px' }}>
                    <ul className='pagination justify-content-center'>
                        <li className='page-item'>
                            <button
                                className='page-link pagination_btn'
                                aria-label='Previous'
                                onClick={() => {
                                    if (startPage === 1) {
                                        userManageListHandler(1);
                                    } else {
                                        userManageListHandler(startPage - 1);
                                    }
                                }}
                            >
                                <span aria-hidden='true'>&laquo;</span>
                            </button>
                        </li>
                        {isLoading ? (
                            <div></div>
                        ) : (
                            Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                                <li
                                    className={`page-item ${startPage + i === currentPage ? 'active' : ''}`}
                                    key={startPage + i}
                                >
                                    <button
                                        className='page-link pagination_btn'
                                        onClick={() => userManageListHandler(startPage + i)}
                                    >
                                        {startPage + i}
                                    </button>
                                </li>
                            ))
                        )}
                        <li className='page-item'>
                            <button
                                className='page-link '
                                aria-label='Next'
                                onClick={() => userManageListHandler(endPage + 1)}
                            >
                                <span aria-hidden='true'>&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserSuspended;
