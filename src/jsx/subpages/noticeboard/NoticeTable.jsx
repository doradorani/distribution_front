import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/subpage/noticetable.css';
import { useDispatch } from 'react-redux';
import { userStateAction } from '../../../js/api/redux_store/slice/userLoginSlice';
import { Link, useParams } from 'react-router-dom';
import { useValidationItem } from '../../../js/api/VlidationItem';

const NoticeTable = ({ setSelectedNotice }) => {
    const [noticeTable, setNoticeTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(10);
    const { noticeId } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    // 관리자 로그인 상태 검증 관련 state
    const userLoginDispatch = useDispatch();
    const validationUserGetTable = useValidationItem();

    useEffect(() => {
        // 서버에서 공지사항 데이터 가져오는 함수
        const getNoticeTable = async () => {
            try {
                setIsLoading(true);
                // 관리자 로그인 상태 검증
                const validateUserResponse = await validationUserGetTable(
                    'get',
                    '/notice/notices/' + currentPage + '/' + perPage,
                    null
                );
                setNoticeTable(validateUserResponse?.data?.noticeDtos);
                setTotalPages(validateUserResponse?.data?.totalPages);

                console.log(validateUserResponse?.data);
            } catch (error) {
                console.error('Error fetching notices:', error);
                userLoginDispatch(userStateAction.setState(false));
            } finally {
                setIsLoading(false);
            }
        };
        getNoticeTable();
    }, [currentPage, perPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // const moveToDetail = (index) => {
    //     console.log('moveToDetail CALLED!!');
    //     noticeIndexDispatch(noticeIndexAction.setNoticeIndexState(index));
    //     console.log(noticeIndex_config.noticeIndexState);
    //     setSelectedNotice(1);
    // };

    return (
        <div className="nn_font" style={{ width: '800px' }}>
            <table className="table table-striped table-hover ">
                <thead>
                    <tr style={{ textAlign: 'center' }}>
                        <th scope="col" style={{ width: '50px' }}>
                            No.
                        </th>
                        <th scope="col" style={{ width: '280px' }}>
                            제목
                        </th>
                        <th scope="col" style={{ width: '65px' }}>
                            작성자
                        </th>
                        <th scope="col" style={{ width: '80px' }}>
                            작성일
                        </th>
                        <th scope="col" style={{ width: '65px' }}>
                            첨부파일
                        </th>
                        <th scope="col" style={{ width: '50px' }}>
                            조회수
                        </th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.88em' }}>
                    {isLoading ? (
                        <tr>
                            <td colSpan={6}>로딩중.....</td>
                        </tr>
                    ) : (
                        (Array.isArray(noticeTable) ? noticeTable : []).map((notice) => (
                            <tr key={notice?.no} style={{ textAlign: 'center' }}>
                                <td scope="row" style={{ fontWeight: 'bold' }}>
                                    {notice?.no}
                                </td>
                                <td style={{ textAlign: 'left' }}>
                                    <Link
                                        to={`/notice/detail_notice/${notice?.no}`}
                                        // onClick={noticeIndexDispatch(noticeIndexAction.setNoticeIndexState(notice.no))}
                                    >
                                        {notice?.title}
                                    </Link>
                                </td>
                                <td>{notice?.admin_id}</td>
                                <td>{notice?.reg_date.substring(0, 10)}</td>
                                <td>{notice?.attach_cnt}</td>
                                <td>{notice?.hit}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <nav aria-label="Page navigation example" style={{ marginRight: '70px', fontSize: '0.9em' }}>
                <ul className="pagination justify-content-center">
                    <li className="page-item">
                        <button
                            className="page-link pagination_btn"
                            aria-label="Previous"
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>
                    {isLoading ? (
                        <div></div>
                    ) : (
                        Array.from({ length: totalPages }, (_, i) => (
                            <li className={`page-item ${i + 1 === currentPage ? 'active' : ''}`} key={i}>
                                <button className="page-link pagination_btn" onClick={() => handlePageChange(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))
                    )}
                    <li className="page-item">
                        <button
                            className="page-link pagination_btn"
                            aria-label="Next"
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default NoticeTable;
