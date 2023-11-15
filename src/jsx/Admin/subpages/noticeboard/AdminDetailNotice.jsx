import React, { useEffect, useState } from 'react';
import { useValidationAdminItem } from '../../../../js/api/admin/ValidationAdminItem';
import noticeIndex_config from '../../../../js/api/config/noticeIndex_config';
import { useDispatch } from 'react-redux';
import { noticeIndexAction } from '../../../../js/api/redux_store/slice/noticeIndexSlice';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminDetailNotice = () => {
    const [noticeContent, setNoticeContent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const validationAdminForDeleteNotice = useValidationAdminItem();
    const validationAdminNotice = useValidationAdminItem();
    const noticeIndexDispatch = useDispatch();
    const nav = useNavigate();

    const [indexZeroFileNameArray, setIndexZeroFileNameArray] = useState([]);
    let IndexZeroFilePathArray = [];
    const [indexOneFileNameArray, setIndexOneFileNameArray] = useState([]);
    let IndexOneFilePathArray = [];

    const alertModalOpen = document.getElementById('exampleModal');

    useEffect(() => {
        const getDetailNotice = async () => {
            setNoticeContent(null);
            try {
                setIsLoading(true);
                const noticeIndex = noticeIndex_config.noticeIndexState;
                const modifyRequest = 0;

                const detailResponse = await validationAdminNotice(
                    'get',
                    '/notice/noticeDetail/' + noticeIndex + '/' + modifyRequest,
                    null
                );
                setNoticeContent(detailResponse.data);
                console.log(detailResponse.data);
                const zeroFileName = detailResponse.data[0].file_name;
                const ZeroFileNameArray = zeroFileName ? zeroFileName.split(',') : null;
                const oneFileName = detailResponse.data[1].file_name;
                const OneFileNameArray = oneFileName ? oneFileName.split(',') : null;

                // const ZeroFilePathArray = detailResponse.data[0].attach_path.split(',');
                // const OneFilePathArray = detailResponse.data[1].attach_path.split(',');
                setIndexZeroFileNameArray(ZeroFileNameArray);
                setIndexOneFileNameArray(OneFileNameArray);
                console.log(detailResponse);
                console.log(ZeroFileNameArray);
                console.log(OneFileNameArray);
                console.log('--------------');
                console.log(indexZeroFileNameArray);
                console.log(indexOneFileNameArray);
            } catch (error) {
                console.error('Error fetching detailNotice:', error);
            } finally {
                setIsLoading(false);
            }
        };
        getDetailNotice();
    }, []);

    const nextPageHandler = (index) => {
        console.log('nextPageHandler() CALLED!!');
        noticeIndexDispatch(noticeIndexAction.setNoticeIndexState(index));
    };

    const moveToModify = async (index) => {
        console.log('moveToModify CALLED!!');
        noticeIndexDispatch(noticeIndexAction.setNoticeIndexState(index));

        nav('/admin/modify_admin_notice');
    };

    const deleteNotice = (index) => {
        Swal.fire({
            icon: 'warning',
            title: '정말 삭제하시겠습니까?',
            text: '삭제한 게시물은 복구가 어려울 수 있습니다.',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                deleteNoticeConfirm(index);
            }
        });
    };

    const deleteNoticeConfirm = async (index) => {
        try {
            setIsLoading(true);
            const noticeIndex = index;

            const deleteResponse = await validationAdminForDeleteNotice(
                'delete',
                '/notice/deleteNotice/' + noticeIndex,
                null
            );
            setNoticeContent(null);

            console.log(deleteResponse);

            if (deleteResponse.code === 200 && deleteResponse.data === 1) {
                Swal.fire({
                    icon: 'success',
                    title: '게시물이 정상적으로\n삭제되었습니다.',
                });

                const modifyRequest = 0;

                const detailResponse = await validationAdminNotice(
                    'get',
                    '/notice/noticeDetail/' + noticeIndex + '/' + modifyRequest,
                    null
                );
                setNoticeContent(detailResponse.data);

                console.log(detailResponse);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '게시물이 삭제에 실패하였습니다.',
                });
            }
            // setCurrentPage(currentPage);
        } catch (error) {
            console.error('Error fetching deleteNotice:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="detail_notice_wrap nn_font">
            {isLoading ? (
                <div className="text-center" style={{ marginTop: '250px' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                // 버튼 및 본문 렌더링 되는 로직 관련 코드
                noticeContent &&
                (noticeContent[1] && noticeContent[1].no === noticeIndex_config.noticeIndexState ? (
                    noticeContent[1].status === 0 ? (
                        <>
                            <div
                                className="flex mb-3"
                                style={{
                                    fontSize: '1.3em',
                                    fontWeight: 'bold',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                해당 게시물은 삭제된 게시물입니다.
                                <br />
                                게시물 복구는 helper@agijagi.site로 문의주시기 바랍니다.
                            </div>
                            <div className="detail_notice_content_wrap">
                                <div className="detail_notice_content_box" style={{ backgroundColor: '#E4E5E8' }}>
                                    <div className="notice_info_wrap">
                                        <div>
                                            <span>No.</span>
                                            <span>{noticeContent[1].no}</span>
                                        </div>
                                        <div>
                                            <span>작성일</span>
                                            <span>{noticeContent[1].reg_date.substring(0, 10)}</span>
                                            <span>|</span>
                                            <span>수정일</span>
                                            <span>{noticeContent[1].mod_date.substring(0, 10)}</span>
                                            <span>|</span>
                                            <span>작성자</span>
                                            <span>{noticeContent[1].admin_id}</span>
                                            <span>|</span>
                                            <span>조회수</span>
                                            <span>{noticeContent[1].hit}</span>
                                        </div>
                                    </div>
                                    <div className="notice_detail_title">{noticeContent[1].title}</div>
                                    <div
                                        className="notice_detail_textarea"
                                        dangerouslySetInnerHTML={{ __html: noticeContent[1].content }}
                                    ></div>
                                    <div className="notice_datail_files flex">
                                        <div
                                            className="flex"
                                            style={{ justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            첨부파일
                                        </div>
                                        <div>
                                            {indexOneFileNameArray ? (
                                                indexOneFileNameArray.map((file_name, index) => (
                                                    <div key={index}>
                                                        <a href="">{file_name}</a>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>첨부파일이 없습니다.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <img className="detail_notice_pin" src="/test_imgs/png/pin.png" />
                            </div>
                            <div className="d-md-flex justify-content-md-end">
                                <Link to="/admin/admin_notice">
                                    <button type="button" className="btn btn-light ">
                                        목록보기
                                    </button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="detail_notice_content_wrap">
                                <div className="detail_notice_content_box">
                                    <div className="notice_info_wrap">
                                        <div>
                                            <span>No.</span>
                                            <span>{noticeContent[1].no}</span>
                                        </div>
                                        <div>
                                            <span>작성일</span>
                                            <span>{noticeContent[1].reg_date.substring(0, 10)}</span>
                                            <span>|</span>
                                            <span>수정일</span>
                                            <span>{noticeContent[1].mod_date.substring(0, 10)}</span>
                                            <span>|</span>
                                            <span>작성자</span>
                                            <span>{noticeContent[1].admin_id}</span>
                                            <span>|</span>
                                            <span>조회수</span>
                                            <span>{noticeContent[1].hit}</span>
                                        </div>
                                    </div>
                                    <div className="notice_detail_title">{noticeContent[1].title}</div>
                                    <div
                                        className="notice_detail_textarea"
                                        dangerouslySetInnerHTML={{ __html: noticeContent[1].content }}
                                    ></div>
                                    <div className="notice_datail_files flex">
                                        <div
                                            className="flex"
                                            style={{ justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            첨부파일
                                        </div>
                                        <div>
                                            {indexOneFileNameArray ? (
                                                indexOneFileNameArray.map((file_name, index) => (
                                                    <div key={index}>
                                                        <a href="">{file_name}</a>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>첨부파일이 없습니다.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <img className="detail_notice_pin" src="/test_imgs/png/pin.png" />
                            </div>
                            <div className="flex" style={{ justifyContent: 'space-between' }}>
                                <div className="d-md-flex justify-content-md-start">
                                    <button
                                        type="button"
                                        className="btn btn-light "
                                        onClick={() => {
                                            deleteNotice(noticeContent[1].no);
                                        }}
                                    >
                                        삭제하기
                                    </button>
                                </div>
                                <div className="d-md-flex justify-content-md-end">
                                    <button
                                        type="button"
                                        className="btn btn-light "
                                        style={{ marginRight: '20px' }}
                                        onClick={() => {
                                            moveToModify(noticeContent[1].no);
                                        }}
                                    >
                                        수정하기
                                    </button>
                                    <Link to="/admin/admin_notice">
                                        <button type="button" className="btn btn-light ">
                                            목록보기
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )
                ) : noticeContent[0].status === 0 ? (
                    <>
                        <div
                            className="flex mb-3"
                            style={{
                                fontSize: '1.3em',
                                fontWeight: 'bold',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}
                        >
                            해당 게시물은 삭제된 게시물입니다.
                            <br />
                            게시물 복구는 helper@agijagi.site로 문의주시기 바랍니다.
                        </div>
                        <div className="detail_notice_content_wrap">
                            <div className="detail_notice_content_box" style={{ backgroundColor: '#E4E5E8' }}>
                                <div className="notice_info_wrap">
                                    <div>
                                        <span>No.</span>
                                        <span>{noticeContent[0].no}</span>
                                    </div>
                                    <div>
                                        <span>작성일</span>
                                        <span>{noticeContent[0].reg_date.substring(0, 10)}</span>
                                        <span>|</span>
                                        <span>수정일</span>
                                        <span>{noticeContent[0].mod_date.substring(0, 10)}</span>
                                        <span>|</span>
                                        <span>작성자</span>
                                        <span>{noticeContent[0].admin_id}</span>
                                        <span>|</span>
                                        <span>조회수</span>
                                        <span>{noticeContent[0].hit}</span>
                                    </div>
                                </div>
                                <div className="notice_detail_title">{noticeContent[0].title}</div>
                                <div
                                    className="notice_detail_textarea"
                                    dangerouslySetInnerHTML={{ __html: noticeContent[0].content }}
                                ></div>
                                <div className="notice_datail_files flex">
                                    <div className="flex" style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        첨부파일
                                    </div>
                                    <div>
                                        {indexZeroFileNameArray ? (
                                            indexZeroFileNameArray.map((file_name, index) => (
                                                <div key={index}>
                                                    <a href="">{file_name}</a>
                                                </div>
                                            ))
                                        ) : (
                                            <div>첨부파일이 없습니다.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <img className="detail_notice_pin" src="/test_imgs/png/pin.png" />
                        </div>
                        <div className="d-md-flex justify-content-md-end">
                            <Link to="/admin/admin_notice">
                                <button type="button" className="btn btn-light ">
                                    목록보기
                                </button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="detail_notice_content_wrap">
                            <div className="detail_notice_content_box">
                                <div className="notice_info_wrap">
                                    <div>
                                        <span>No.</span>
                                        <span>{noticeContent[0].no}</span>
                                    </div>
                                    <div>
                                        <span>작성일</span>
                                        <span>{noticeContent[0].reg_date.substring(0, 10)}</span>
                                        <span>|</span>
                                        <span>수정일</span>
                                        <span>{noticeContent[0].mod_date.substring(0, 10)}</span>
                                        <span>|</span>
                                        <span>작성자</span>
                                        <span>{noticeContent[0].admin_id}</span>
                                        <span>|</span>
                                        <span>조회수</span>
                                        <span>{noticeContent[0].hit}</span>
                                    </div>
                                </div>
                                <div className="notice_detail_title">{noticeContent[0].title}</div>
                                <div
                                    className="notice_detail_textarea"
                                    dangerouslySetInnerHTML={{ __html: noticeContent[0].content }}
                                ></div>
                                <div className="notice_datail_files flex">
                                    <div className="flex" style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        첨부파일
                                    </div>
                                    <div>
                                        {indexZeroFileNameArray ? (
                                            indexZeroFileNameArray.map((file_name, index) => (
                                                <div key={index}>
                                                    <a href="">{file_name}</a>
                                                </div>
                                            ))
                                        ) : (
                                            <div>첨부파일이 없습니다.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <img className="detail_notice_pin" src="/test_imgs/png/pin.png" />
                        </div>
                        <div className="flex" style={{ justifyContent: 'space-between' }}>
                            <div className="d-md-flex justify-content-md-start">
                                <Link to="/admin/admin_notice">
                                    <button
                                        type="button"
                                        className="btn btn-light "
                                        onClick={() => deleteNotice(noticeContent[0].no)}
                                    >
                                        삭제하기
                                    </button>
                                </Link>
                            </div>
                            <div className="d-md-flex justify-content-md-end">
                                <Link to="/admin/admin_notice" style={{ marginRight: '20px' }}>
                                    <button
                                        type="button"
                                        className="btn btn-light "
                                        onClick={() => {
                                            moveToModify(noticeContent[0].no);
                                        }}
                                    >
                                        수정하기
                                    </button>
                                </Link>
                                <Link to="/admin/admin_notice">
                                    <button type="button" className="btn btn-light ">
                                        목록보기
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </>
                ))
            )}

            {isLoading ? (
                <></>
            ) : (
                // 이전글 다음글 렌더링 되는 로직 관련 코드
                noticeContent && (
                    <div className="prev_next_notice_box">
                        <div className="next_notice_box flex" style={{ justifyContent: 'space-between' }}>
                            <div className="flex">
                                <div className="prev_next_notice_box_head">다음 글</div>
                                <div>
                                    {noticeContent.length === 2 &&
                                    noticeIndex_config.noticeIndexState === noticeContent[1].no ? (
                                        <a>다음 게시물이 없습니다.</a>
                                    ) : noticeIndex_config.noticeIndexState === noticeContent[1].no ? (
                                        <a href="" onClick={() => nextPageHandler(noticeContent[2].no)}>
                                            {noticeContent[2].title}
                                        </a>
                                    ) : (
                                        <a href="" onClick={() => nextPageHandler(noticeContent[1].no)}>
                                            {noticeContent[1].title}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="flex">
                                {noticeContent.length === 2 &&
                                noticeIndex_config.noticeIndexState === noticeContent[1].no ? (
                                    <div></div>
                                ) : noticeIndex_config.noticeIndexState === noticeContent[1].no ? (
                                    <>
                                        <div>{noticeContent[2].admin_id}</div>
                                        <div>|</div>
                                        <div>{noticeContent[2].reg_date.substring(0, 10)}</div>
                                    </>
                                ) : (
                                    <>
                                        <div>{noticeContent[1].admin_id}</div>
                                        <div>|</div>
                                        <div>{noticeContent[1].reg_date.substring(0, 10)}</div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className=" prev_notice_box flex" style={{ justifyContent: 'space-between' }}>
                            <div className="flex">
                                <div className="prev_next_notice_box_head">이전 글</div>
                                <div>
                                    {noticeContent.length === 2 &&
                                    noticeIndex_config.noticeIndexState === noticeContent[0].no ? (
                                        <a>이전 게시물이 없습니다.</a>
                                    ) : (
                                        <a href="" onClick={() => nextPageHandler(noticeContent[0].no)}>
                                            {noticeContent[0].title}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="flex">
                                {noticeContent.length === 2 &&
                                noticeIndex_config.noticeIndexState === noticeContent[0].no ? (
                                    <div></div>
                                ) : (
                                    <>
                                        <div>{noticeContent[0].admin_id}</div>
                                        <div>|</div>
                                        <div>{noticeContent[0].reg_date.substring(0, 10)}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default AdminDetailNotice;
