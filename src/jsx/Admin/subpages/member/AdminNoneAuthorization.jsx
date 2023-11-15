import React, { useEffect, useState } from 'react';
import '../../../../css/admin/member/admin_authorization.css';
import AdminSidbar from '../../AdminSidebar';
import adminToken_config from '../../../../js/api/config/adminToken_config';
import { useValidationAdminItem } from '../../../../js/api/admin/ValidationAdminItem';
import adminLogin_config from '../../../../js/api/config/adminLogin_config';
import Swal from 'sweetalert2';

const AdminNoneAuthorization = ({ setSelectedSideMenu }) => {
    const server = adminToken_config.server;
    const validateNoneAuth = useValidationAdminItem();
    const [adminNoneAuthList, setAdminNoneAuthList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [listCnt, setListCnt] = useState(0);
    const [perPage] = useState(10);
    const [updateAdminNo, setUpdateAdminNo] = useState();
    const [isLoading, setIsLoading] = useState(false);

    // 페이지네이션을 10개씩 보이도록 수정
    const itemsPerPage = 10;
    const startPage = Math.floor((currentPage - 1) / itemsPerPage) * itemsPerPage + 1;
    const endPage = Math.min(startPage + itemsPerPage - 1, totalPages);

    useEffect(() => {
        const userManageList = async () => {
            try {
                validateNoneAuth('get', '/admin/noneAuthList/' + currentPage + '/' + perPage).then((res) => {
                    if (res.success) {
                        const processedData = res.data.noneAuthListDtos.map((admin) => ({
                            ...admin,
                            reg_date: formatDate(admin.reg_date),
                            mod_date: formatDate(admin.mod_date),
                        }));
                        setAdminNoneAuthList(processedData);
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
                setUpdateAdminNo('');
            }
        };
        userManageList();
    }, [currentPage, updateAdminNo]);

    const authNoneListHandler = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const adminGradeHandler = (no, grade) => {
        if (adminLogin_config.grade !== 2) {
            Swal.fire({
                icon: 'error',
                title: '접근 권한이 없습니다',
                text: '최고 관리자만 해당 기능을 사용할 수 있습니다.',
            });
            return;
        }
        Swal.fire({
            title: '권한을 입력하세요',
            input: 'select',
            inputOptions: {
                0: '미승인',
                1: '승인',
                2: '최고관리자',
            },
            inputPlaceholder: '권한을 선택하세요',
            inputValue: grade, // 기본값 설정
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then((result) => {
            if (result.isConfirmed) {
                const gradeData = result.value;
                try {
                    validateNoneAuth('put', '/admin/updateGrade/' + no + '/' + gradeData).then((res) => {
                        if (res.success && res.data == 1) {
                            Swal.fire('업데이트 완료', '권한이 업데이트되었습니다.', 'success');
                            setUpdateAdminNo(no);
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

    return (
        <div className='admin_authorization_wrap'>
            <div className='admin_page_menu_title_wrap'>
                <img src='/test_imgs/svg/approval.svg' />
                <div className='admin_page_menu_title yg_font '>관리자 승인</div>
                <div className='yg_font admin_page_menu_sub_title'> &#62; 미승인 관리자</div>
            </div>
            <div className='admin_authorization_second_wrap'>
                <table
                    className='admin_authorization table table-striped table-hover nn_font'
                    style={{ marginTop: '15px' }}
                >
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>이름</th>
                            <th>아이디</th>
                            <th>이메일</th>
                            <th>핸드폰 번호</th>
                            <th>가입일자</th>
                            <th>수정일자</th>
                            <th>등급 수정</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminNoneAuthList.map((admin, index) => (
                            <tr key={index}>
                                <td>{admin.no}</td>
                                <td>{admin.name}</td>
                                <td>{admin.id}</td>
                                <td>{admin.email}</td>
                                <td>{admin.phone}</td>
                                <td>{admin.reg_date}</td>
                                <td>{admin.mod_date}</td>
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
                                        onClick={() => adminGradeHandler(admin.no, admin.grade)}
                                    >
                                        등급 변경
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
                                        authNoneListHandler(1);
                                    } else {
                                        authNoneListHandler(startPage - 1);
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
                                        onClick={() => authNoneListHandler(startPage + i)}
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
                                onClick={() => authNoneListHandler(endPage + 1)}
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

export default AdminNoneAuthorization;
