import React, { useCallback, useEffect, useRef, useState } from 'react';
import userInfo_config from '../../../js/api/config/userInfo_config';
import { useNavigate, useParams } from 'react-router';
import { useValidationItem } from '../../../js/api/VlidationItem';
import Swal from 'sweetalert2';

const DetailReplys = ({ reportReason, setReportReason }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingForReply, setIsLoadingForReply] = useState(false);
    const [replyResponseData, setReplyResponseData] = useState();
    const [byteCount, setByteCount] = useState(0);
    const [replyText, setReplyText] = useState('');
    const [replyIndex, setReplyIndex] = useState(0);
    const [modReplyModalOpen, setModReplyModalOpen] = useState(false);
    const [reReplyModalOpen, setReReplyModalOpen] = useState(false);
    const [isReply, setIsReply] = useState(true);

    const loginedUserNickname = userInfo_config.userNickname;
    const ValidationItem = useValidationItem();
    const nav = useNavigate();

    const { postId } = useParams();
    const textRef = useRef();
    const registTextRef = useRef(null);
    const handleResizeHeight = useCallback(() => {
        if (textRef !== undefined) {
            textRef.current.style.height = 'auto';
            textRef.current.style.height = textRef.current.scrollHeight + 'px';
        }
    }, []);

    const getReplys = async () => {
        console.log('registReply() CALLED!!');
        try {
            setReplyText('');
            setIsLoading(true);
            const replyResponse = await ValidationItem('get', '/community/getReplys/' + postId, null);
            setReplyResponseData(replyResponse);
            console.log(replyResponse);
        } catch (error) {
            console.error('registReply() fetching error', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setReplyText('');
        getReplys();
    }, []);

    const handleTextChange = (e) => {
        const text = e.target.value;
        // 함수 호출하여 바이트 수 계산
        setReportReason(text);
        fn_checkByte(text);

        // console.log(postReportReason);
    };

    // 바이트 수 체크 함수
    const fn_checkByte = (text) => {
        const maxByte = 2200;
        let totalByte = 0;
        for (let i = 0; i < text.length; i++) {
            const each_char = text.charAt(i);
            const uni_char = escape(each_char);
            if (uni_char.length > 4) {
                totalByte += 2;
            } else {
                totalByte += 1;
            }
        }
        // 바이트 수 상태 업데이트
        setByteCount(totalByte);
    };

    const deleteReplyHandler = (index) => {
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
                deleteReplyConfirm(index);
            }
        });
    };

    const deleteReplyConfirm = async (index) => {
        try {
            setIsLoading(true);
            const replyIndex = index;
            const deleteResponse = await ValidationItem(
                'delete',
                '/community/deleteReply/' + postId + '/' + replyIndex,
                null
            );
            console.log(deleteResponse);
            if (deleteResponse.code === 200 && deleteResponse.data !== 0) {
                Swal.fire({
                    icon: 'success',
                    title: '댓글이 정상적으로\n삭제되었습니다.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '댓글 삭제에 실패하였습니다.',
                    text: '다시 시도해주시기 바랍니다.',
                });
            }
            getReplys();
        } catch (error) {
            console.error('Error fetching deletePost:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const inputReplyText = (e) => {
        setReplyText(e.target.value);
    };

    const registReply = async () => {
        try {
            setIsLoadingForReply(true);
            const registReplyRes = await ValidationItem(
                'put',
                '/community/registReply/' + postId + '/' + replyText,
                null
            );
            if (registReplyRes?.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: '댓글이 성공적으로 등록되었습니다.',
                    confirmButtonText: '확인',
                }).then((res) => {});
                // setRegistReplyResult(registReplyRes);
                // registTextRef.current.value = ''; // textarea의 내용을 지웁니다.
                setReplyText('');
                getReplys();
            }
        } catch (error) {
            console.error('registReply() fetching error', error);
        } finally {
            setIsLoadingForReply(false);
        }
    };

    const registReReply = async (index) => {
        try {
            const replyIndex = index;
            setIsLoadingForReply(true);
            const registReplyRes = await ValidationItem(
                'put',
                '/community/registReReply/' + postId + '/' + replyText + '/' + replyIndex,
                null
            );
            if (registReplyRes?.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: '댓글이 성공적으로 등록되었습니다.',
                    confirmButtonText: '확인',
                }).then((res) => {});
                // setRegistReplyResult(registReplyRes);
                // registTextRef.current.value = ''; // textarea의 내용을 지웁니다.
                setReplyText('');
                getReplys();
            }
        } catch (error) {
            console.error('registReply() fetching error', error);
        } finally {
            setIsLoadingForReply(false);
        }
    };

    const modifyReplyConfirm = async (index) => {
        try {
            const replyIndex = index;
            setIsLoadingForReply(true);
            if (replyText === '') {
                Swal.fire({
                    icon: 'warning',
                    title: '댓글 수정사항이 없습니다.\n댓글을 확인해주시기 바랍니다.',
                });
            } else {
                const modifyReplyRes = await ValidationItem(
                    'put',
                    '/community/modifyReply/' + replyIndex + '/' + replyText,
                    null
                );
                if (modifyReplyRes?.code === 200) {
                    if (modifyReplyRes?.code === 200 && modifyReplyRes?.data !== 0) {
                        Swal.fire({
                            icon: 'success',
                            title: '댓글이 정상적으로\n수정되었습니다.',
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '댓글 수정에 실패하였습니다.',
                            text: '다시 시도해주시기 바랍니다.',
                        });
                    }
                    closeModifyReply();
                    getReplys();
                }
            }
        } catch (error) {
            console.error('registReply() fetching error', error);
        } finally {
            setIsLoadingForReply(false);
        }
    };

    const summitReport = async () => {
        try {
            if (reportReason === '') {
                Swal.fire({
                    icon: 'warning',
                    title: '신고사유가 누락되었습니다.',
                    text: '다시 시도해주시기 바랍니다.',
                });
            } else {
                setIsLoading(true);
                const summitReportRes = await ValidationItem(
                    'post',
                    '/community/summitReport/' + postId + '/' + replyIndex + '/' + reportReason,
                    null
                );
                if (summitReportRes?.code === 200) {
                    if (summitReportRes?.code === 200 && summitReportRes?.data !== 0) {
                        Swal.fire({
                            icon: 'success',
                            title: '신고가 정상적으로\n접수되었습니다.',
                        });
                        setReportReason('');
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '신고 접수에 실패하였습니다.',
                            text: '다시 시도해주시기 바랍니다.',
                        });
                    }
                    getReplys();
                }
            }
        } catch (error) {
            console.error('summitReport error', error);
        } finally {
            setIsLoading(false);
        }
    };

    const writeReReply = (i) => {
        setReplyIndex(i);
        setReReplyModalOpen(true);
    };

    const modifyReply = (i) => {
        setReplyIndex(i);
        setModReplyModalOpen(true);
    };

    const closeModifyReply = () => {
        setReplyIndex(0);
        setModReplyModalOpen(false);
    };

    const inputReplyIndex = (i) => {
        setModReplyModalOpen(false);
        setReReplyModalOpen(false);
        setReplyIndex(i);
    };

    return (
        <>
            <div className="reply_cnt">댓글 {replyResponseData?.data?.length}개</div>
            <div className="write_reply_box">
                {replyResponseData?.data.map((comment, index) => (
                    <div className="each_reply_box" key={index}>
                        {comment?.indentation === 0 ? (
                            <>
                                <div className="flex_for_profile">
                                    <div className="flex">
                                        <div className="reply_profile_img">
                                            <img
                                                src={comment?.img ? comment?.img : '/test_imgs/png/profile.png'}
                                                alt={`Profile of ${comment?.user_mail}`}
                                            />
                                        </div>
                                        <div className="reply_profile_info">
                                            <div className="profile_name">{comment?.nickname}</div>
                                            <div className="update_date">
                                                {Math.floor(
                                                    (new Date() - new Date(comment?.reg_date)) / (1000 * 60 * 60 * 24)
                                                ) === 0
                                                    ? '오늘'
                                                    : `${Math.floor(
                                                          (new Date() - new Date(comment?.reg_date)) /
                                                              (1000 * 60 * 60 * 24)
                                                      )}일 전`}
                                            </div>
                                        </div>
                                    </div>
                                    <div onClick={() => inputReplyIndex(comment?.no)}>
                                        <img
                                            src="/test_imgs/png/more.png"
                                            style={{
                                                width: '20px',
                                                height: '60px',
                                                objectFit: 'contain',
                                                marginRight: '10px',
                                                paddingBottom: '10px',
                                            }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal_for_change_reply"
                                        />
                                    </div>
                                </div>
                                {replyIndex === comment?.no && modReplyModalOpen === true ? (
                                    <div
                                        className="flex"
                                        style={{
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <textarea
                                            className="upload_reply"
                                            name="text"
                                            placeholder="수정 댓글을 입력해주세요."
                                            style={{
                                                fontSize: '1.01em',
                                                width: '535px',
                                                border: '1px solid #aaaab1',
                                                minHeight: '80px',
                                                maxHeight: '225px',
                                            }}
                                            ref={textRef}
                                            onInput={handleResizeHeight}
                                            rows={'1'}
                                            defaultValue={comment?.comment}
                                            onChange={inputReplyText}
                                        ></textarea>
                                        <div
                                            className="flex"
                                            style={{
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <button
                                                type="button"
                                                className="btn btn-close"
                                                style={{ marginBottom: '10px', position: 'absolute', top: '0px' }}
                                                onClick={() => closeModifyReply()}
                                            ></button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm"
                                                style={{ fontSize: '0.8em', padding: '3px 6px' }}
                                                onClick={() => modifyReplyConfirm(comment?.no)}
                                            >
                                                수정
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="reply_text_content">{comment.comment}</div>
                                )}

                                <div
                                    className={`division_box_for_write_re_reply flex  ${
                                        replyIndex === comment?.no &&
                                        reReplyModalOpen === true &&
                                        comment?.indentation === 0
                                            ? ''
                                            : 're_reply_show'
                                    }`}
                                    style={{ width: '600px' }}
                                >
                                    <div className="reply_arrow_img" style={{ marginLeft: '15px' }}>
                                        <img src="/test_imgs/png/reply-blue.png" />
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <textarea
                                                className="upload_reply"
                                                name="text"
                                                placeholder="대댓글 달기..."
                                                style={{
                                                    fontSize: '1.01em',
                                                    width: '505px',
                                                    maxHeight: '225px',
                                                }}
                                                onChange={inputReplyText}
                                            ></textarea>
                                            <figure className="zoom_in">
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    style={{ marginTop: '10px' }}
                                                    onClick={() => setReReplyModalOpen(false)}
                                                ></button>
                                            </figure>
                                        </div>
                                        <div className="send_logo_wrap" style={{ width: '555px', height: '35px' }}>
                                            <a
                                                className="hover_cursor"
                                                onClick={() => {
                                                    setReReplyModalOpen(false);
                                                    registReReply(comment?.no);
                                                }}
                                            >
                                                <figure className="zoom_in">
                                                    <img
                                                        className="send_logo"
                                                        src="/test_imgs/png/paper-airplane.png"
                                                        style={{ marginRight: '25px' }}
                                                    />
                                                </figure>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="each_re_reply_text_content" style={{ marginTop: '0px' }}>
                                    <div className="reply_arrow_img">
                                        <img src="/test_imgs/png/reply-blue.png" />
                                    </div>
                                    <div className="re_reply_content_box">
                                        <div className="flex_for_profile">
                                            <div className="flex">
                                                <div className="reply_profile_img">
                                                    <img
                                                        src={comment?.img ? comment?.img : '/test_imgs/png/profile.png'}
                                                        alt={`Profile of ${comment?.user_mail}`}
                                                    />
                                                </div>
                                                <div className="reply_profile_info">
                                                    <div className="profile_name">{comment?.nickname}</div>
                                                    <div className="update_date">1일 전</div>
                                                </div>
                                            </div>
                                            <div onClick={() => inputReplyIndex(comment?.no)}>
                                                <img
                                                    src="/test_imgs/png/more.png"
                                                    style={{
                                                        width: '20px',
                                                        height: '60px',
                                                        objectFit: 'contain',
                                                        paddingBottom: '10px',
                                                    }}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modal_for_change_re_reply"
                                                />
                                            </div>
                                        </div>
                                        {replyIndex === comment?.no && modReplyModalOpen === true ? (
                                            <div
                                                className="flex"
                                                style={{
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    position: 'relative',
                                                }}
                                            >
                                                <textarea
                                                    className="upload_reply"
                                                    name="text"
                                                    placeholder="수정 대댓글을 입력해주세요."
                                                    style={{
                                                        fontSize: '1.01em',
                                                        width: '490px',
                                                        border: '1px solid #aaaab1',
                                                        minHeight: '80px',
                                                        maxHeight: '225px',
                                                    }}
                                                    ref={textRef}
                                                    onInput={handleResizeHeight}
                                                    defaultValue={comment?.comment}
                                                    onChange={inputReplyText}
                                                ></textarea>
                                                <div
                                                    className="flex"
                                                    style={{
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        className="btn btn-close"
                                                        style={{
                                                            marginBottom: '10px',
                                                            position: 'absolute',
                                                            top: '0px',
                                                        }}
                                                        onClick={() => closeModifyReply()}
                                                    ></button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary btn-sm"
                                                        style={{ fontSize: '0.8em', padding: '3px 6px' }}
                                                        onClick={() => modifyReplyConfirm(comment?.no)}
                                                    >
                                                        수정
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="reply_text_content">{comment?.comment}</div>
                                        )}
                                        {/* <div className="reply_text_content">{comment.comment}</div> */}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                <div>
                    <div className="flex" style={{ position: 'relative' }}>
                        {/* <textarea
                        className="upload_reply"
                        name="text"
                        placeholder="댓글 달기..."
                        style={{ fontSize: '1.01em' }}
                        rows={'1'}
                        ref={registTextRef}
                        onChange={inputReplyText}
                    ></textarea> */}
                        {isLoadingForReply ? (
                            <>
                                <textarea
                                    className="upload_reply"
                                    name="text"
                                    placeholder="댓글 달기..."
                                    style={{ fontSize: '1.01em' }}
                                    rows={'1'}
                                ></textarea>
                                <div
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    style={{
                                        position: 'absolute',
                                        top: '40px',
                                        left: '48%',
                                    }}
                                >
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <textarea
                                    className="upload_reply"
                                    name="text"
                                    placeholder="댓글 달기..."
                                    style={{ fontSize: '1.01em' }}
                                    rows={'1'}
                                    // ref={registTextRef}
                                    onChange={inputReplyText}
                                ></textarea>
                            </>
                        )}
                    </div>

                    <div className="send_logo_wrap">
                        <a
                            className="hover_cursor"
                            onClick={() => {
                                registReply();
                            }}
                        >
                            <figure className="zoom_in">
                                <img className="send_logo" src="/test_imgs/png/paper-airplane.png" />
                            </figure>
                        </a>
                    </div>
                </div>
                {/*댓글 모달 START */}
                <div
                    className="modal fade"
                    id="modal_for_change_reply"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                    data-backdrop="static"
                >
                    <div className="modal-dialog modal-lg modal-lg-text modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div
                                className="modal-body mx-auto"
                                style={{ width: '450px', textAlign: 'center', fontWeight: 'bold' }}
                            >
                                <a
                                    className="none_underline"
                                    onClick={() => writeReReply(replyIndex)}
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <div>대댓글 작성</div>
                                </a>
                                <hr />
                                {replyResponseData?.data.map((comment) => (
                                    <div key={comment.no}>
                                        {comment.no === replyIndex ? (
                                            <>
                                                {comment.nickname === loginedUserNickname ? (
                                                    // 로그인한 사용자와 댓글 작성자가 같을 때 보여줄 내용
                                                    <>
                                                        <a
                                                            className="none_underline"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                            onClick={() => modifyReply(replyIndex)}
                                                        >
                                                            <div>댓글 수정</div>
                                                        </a>
                                                        <hr />
                                                        <a
                                                            className="none_underline"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                            onClick={() => deleteReplyHandler(replyIndex)}
                                                            style={{ color: 'red' }}
                                                        >
                                                            <div>댓글 삭제</div>
                                                        </a>
                                                        <hr />
                                                    </>
                                                ) : (
                                                    // 로그인한 사용자와 댓글 작성자가 다를 때 보여줄 내용
                                                    <>
                                                        <div
                                                            className="hover_cursor"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#modal_for_reply_declaration"
                                                            style={{ color: 'red' }}
                                                            onClick={() => {
                                                                setIsReply(true);
                                                                setReplyIndex(comment?.no);
                                                            }}
                                                        >
                                                            댓글 신고
                                                        </div>
                                                        <hr />
                                                    </>
                                                )}
                                            </>
                                        ) : null}
                                    </div>
                                ))}

                                <div className="hover_cursor" data-bs-dismiss="modal" aria-label="Close">
                                    취소
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*댓글 모달 END */}
                {/*대댓글 모달 START */}
                <div
                    className="modal fade"
                    id="modal_for_change_re_reply"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                    data-backdrop="static"
                >
                    <div className="modal-dialog modal-lg modal-lg-text modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div
                                className="modal-body mx-auto"
                                style={{ width: '450px', textAlign: 'center', fontWeight: 'bold' }}
                            >
                                {replyResponseData?.data.map((comment) => (
                                    <div key={comment.no}>
                                        {/* {console.log(comment.nickname)} */}
                                        {comment.no === replyIndex ? (
                                            <>
                                                {comment.nickname === loginedUserNickname ? (
                                                    // 로그인한 사용자와 댓글 작성자가 같을 때 보여줄 내용
                                                    <>
                                                        <a
                                                            className="none_underline"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                            onClick={() => modifyReply(replyIndex)}
                                                        >
                                                            <div>댓글 수정</div>
                                                        </a>
                                                        <hr />
                                                        <a
                                                            className="none_underline"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                            onClick={() => deleteReplyHandler(replyIndex)}
                                                            style={{ color: 'red' }}
                                                        >
                                                            <div>댓글 삭제</div>
                                                        </a>
                                                        <hr />
                                                    </>
                                                ) : (
                                                    // 로그인한 사용자와 댓글 작성자가 다를 때 보여줄 내용
                                                    <>
                                                        <div
                                                            className="hover_cursor"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#modal_for_reply_declaration"
                                                            style={{ color: 'red' }}
                                                            onClick={() => {
                                                                setIsReply(false);
                                                                setReplyIndex(comment?.no);
                                                            }}
                                                        >
                                                            댓글 신고
                                                        </div>
                                                        <hr />
                                                    </>
                                                )}
                                            </>
                                        ) : null}
                                    </div>
                                ))}

                                <div className="hover_cursor" data-bs-dismiss="modal" aria-label="Close">
                                    취소
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="modal fade"
                    id="modal_for_reply_declaration"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg modal-lg-text modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5 yg_font" id="exampleModalLabel">
                                    신고사유 작성하기
                                </h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body mx-auto">
                                <textarea
                                    className="upload_text"
                                    placeholder="댓글의 신고사유를 작성해주세요."
                                    style={{ width: '400px' }}
                                    onChange={handleTextChange}
                                    value={reportReason}
                                ></textarea>
                            </div>
                            <sup className="byte_for_upload yg_font" style={{ marginRight: '25px' }}>
                                (<span id="nowByte">{byteCount}</span>/2200bytes)
                            </sup>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-toggle="modal"
                                    data-bs-target={isReply ? `#modal_for_change_reply` : `#modal_for_change_re_reply`}
                                >
                                    이전
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => summitReport()}
                                >
                                    제출하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*대댓글 모달 END */}
            </div>
        </>
    );
};

export default DetailReplys;
