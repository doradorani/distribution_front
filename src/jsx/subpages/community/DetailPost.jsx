import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/subpage/post.css';
import { useValidationItem } from '../../../js/api/VlidationItem';
import CopyToClipboard from 'react-copy-to-clipboard';
import Swal from 'sweetalert2';
import userInfo_config from '../../../js/api/config/userInfo_config';
import DetailReplys from './DetailReplys';
import LoadingPostCard from './LoadingPostCard';

const DetailPost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState();
    const [byteCount, setByteCount] = useState(0);
    const [reportReason, setReportReason] = useState('');
    const [emotionBtnData, setEmotionBtnData] = useState();

    const loginedUserNickname = userInfo_config.userNickname;
    const ValidationItem = useValidationItem();
    const nav = useNavigate();
    const { postId } = useParams();
    // 링크 복사 (공유기능을 위한 URL값 가져오기)
    const postURL = window.location.href;
    // 현재 날짜와 작성일 비교 변수
    const postDate = new Date(responseData?.data?.reg_date);
    const currentDate = new Date();
    const postTimeDifference = currentDate - postDate;
    const daysAgo = Math.floor(postTimeDifference / (1000 * 60 * 60 * 24));

    let s3_img_path = [];
    if (responseData && responseData.data && responseData.data.imgs_path) {
        s3_img_path = responseData.data.imgs_path.split(',');
    }
    let s3_first_img_path = '';
    if (s3_img_path[0] !== undefined) {
        s3_first_img_path = s3_img_path[0];
    }

    useEffect(() => {
        const getDetaillPost = async () => {
            console.log('getDetaillPost() CALLED!!');
            try {
                setIsLoading(true);
                const response = await ValidationItem('get', '/community/getDetailPost/' + postId, null);
                if (response.code === 200 && response.data !== null) {
                    console.log(response);

                    setResponseData(response);
                }
            } catch (error) {
                console.error('Error fetching posts', error);
            } finally {
                setIsLoading(false);
            }
        };
        getDetaillPost();
    }, []);

    const copyPostURL = () => {
        Swal.fire({
            icon: 'success',
            title: `해당 링크가 복사되었습니다.`,
            text: `${postURL}`,
        });
    };

    const handleTextChange = (e) => {
        const text = e.target.value;
        // 함수 호출하여 바이트 수 계산
        setReportReason(text);
        fn_checkByte(text);

        console.log(reportReason);
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

    const deletePostHandler = (index) => {
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
                deletePostConfirm(index);
            }
        });
    };

    const deletePostConfirm = async (index) => {
        try {
            const postIndex = index;

            const deleteResponse = await ValidationItem('delete', '/community/deletePost/' + postIndex, null);
            if (deleteResponse.code === 200 && deleteResponse.data === 1) {
                Swal.fire({
                    icon: 'success',
                    title: '게시물이 정상적으로\n삭제되었습니다.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '게시물이 삭제에 실패하였습니다.',
                });
            }
        } catch (error) {
            console.error('Error fetching deletePost:', error);
        } finally {
            nav('/community/my_posts');
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
                    '/community/summitReport/' + postId + '/' + 0 + '/' + reportReason,
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
                }
            }
        } catch (error) {
            console.error('summitReport error', error);
        } finally {
            setIsLoading(false);
        }
    };

    const emotionBtnHandler = async (btnIndex, post_no) => {
        try {
            setIsLoading(true);
            const res = await ValidationItem('put', '/community/updateEmotionBtn' + btnIndex + '/' + post_no, null);
            if (res.success) {
                const result = await ValidationItem('get', '/community/getEmotionBtnCnt' + post_no, null);
                setEmotionBtnData(result);
            }
        } catch (error) {
            console.error('게시물을 불러오는 중 오류 발생', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading ? (
                <>
                    <LoadingPostCard />
                    <div className="tag_for_sticky">
                        <div>
                            <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
                            <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
                        </div>
                    </div>
                </>
            ) : responseData === undefined || responseData?.data === undefined ? (
                <>
                    <div className="flex" style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <img src="/test_imgs/community_imgs/sumaho.png" alt="" style={{ width: '350px' }} />
                        <div className="nn_font" style={{ fontSize: '1.2em' }}>
                            더 이상 이용할 수 없는 컨텐츠 입니다.
                        </div>
                    </div>

                    <div className="tag_for_sticky">
                        <div>
                            <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
                            <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="post_section nn_font">
                        <div className="flex" style={{ justifyContent: 'space-between' }}>
                            <div
                                className="yg_font"
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    margin: '15px 0px 10px 25px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => nav(-1)}
                            >
                                &#60;&nbsp;뒤로가기
                            </div>
                        </div>
                        <div className="flex">
                            <div className="detail_post_wrap">
                                <div className="flex_for_profile">
                                    <div className="flex">
                                        <div className="profile_img">
                                            <img
                                                src={
                                                    responseData?.data?.img === null
                                                        ? '/test_imgs/png/profile.png'
                                                        : responseData?.data?.img
                                                }
                                            />
                                        </div>
                                        <div className="profile_info">
                                            <div className="profile_name">{responseData?.data?.nickname}</div>
                                            <div className="update_date">
                                                {daysAgo === 0 ? '오늘' : `${daysAgo}일 전`}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <img
                                            src="/test_imgs/png/more.png"
                                            style={{ width: '20px', height: '60px', objectFit: 'contain' }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal_for_post_detail"
                                        />
                                    </div>
                                </div>
                                <div className="text_contents_in_detail">{responseData?.data?.post_text}</div>
                                <div className="post_main_img_in_detail">
                                    {(Array.isArray(s3_img_path) ? s3_img_path : []).map((img, index) => (
                                        <img key={index} src={img} alt={`Image ${index}`} />
                                    ))}
                                </div>
                                <div className="emotion_btns_indetail flex">
                                    <div className="flex">
                                        <a
                                            className="flex none_underline"
                                            onClick={() => emotionBtnHandler(1, responseData?.data?.no)}
                                        >
                                            <div>
                                                <img className="emotion_btn" src="/test_imgs/png/heart.png" />
                                            </div>
                                            <div className="emotion_btn_cnt">{responseData?.data?.like_cnt}</div>
                                        </a>
                                    </div>
                                    <div className="flex">
                                        <a className="flex none_underline" onClick={() => emotionBtnHandler(2)}>
                                            <div>
                                                <img className="emotion_btn" src="/test_imgs/png/like.png" />
                                            </div>
                                            <div className="emotion_btn_cnt">{responseData?.data?.great_cnt}</div>
                                        </a>
                                    </div>
                                    <div className="flex">
                                        <a className="flex none_underline" onClick={() => emotionBtnHandler(3)}>
                                            <div>
                                                <img className="emotion_btn" src="/test_imgs/png/sad.png" />
                                            </div>
                                            <div className="emotion_btn_cnt">{responseData?.data?.sad_cnt}</div>
                                        </a>
                                    </div>
                                </div>
                                <hr className="division_line" />
                                <DetailReplys reportReason={reportReason} setReportReason={setReportReason} />
                            </div>
                            {/* 게시물 모달 START */}
                            <div
                                className="modal fade"
                                id="modal_for_post_detail"
                                tabIndex="-1"
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-lg modal-lg-text modal-dialog-centered modal-dialog-scrollable">
                                    <div className="modal-content">
                                        <div
                                            className="modal-body mx-auto"
                                            style={{ width: '450px', textAlign: 'center', fontWeight: 'bold' }}
                                        >
                                            {loginedUserNickname !== responseData?.data?.nickname && (
                                                <>
                                                    <div
                                                        className="hover_cursor"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#modal_for_post_declaration"
                                                        style={{ color: 'red' }}
                                                    >
                                                        신고하기
                                                    </div>{' '}
                                                    <hr />
                                                </>
                                            )}
                                            {loginedUserNickname === responseData?.data?.nickname ? (
                                                <>
                                                    <div
                                                        className="hover_cursor"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#modal_for_post_declaration"
                                                    >
                                                        수정하기
                                                    </div>{' '}
                                                    <hr />
                                                    <div
                                                        className="hover_cursor"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                        style={{ color: 'red' }}
                                                        onClick={() => deletePostHandler(responseData?.data?.no)}
                                                    >
                                                        삭제하기
                                                    </div>{' '}
                                                    <hr />
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                            <a
                                                className="hover_cursor none_underline"
                                                onClick={copyPostURL}
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                <CopyToClipboard text={`${postURL}`}>
                                                    <div>링크 복사</div>
                                                </CopyToClipboard>
                                            </a>
                                            <hr />
                                            <div className="hover_cursor" data-bs-dismiss="modal" aria-label="Close">
                                                취소
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="modal fade"
                                id="modal_for_post_declaration"
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
                                                placeholder="게시물의 신고사유를 작성해주세요."
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
                                                data-bs-target="#modal_for_post_detail"
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
                            {/* 게시물 모달 END */}
                        </div>
                    </div>
                    <div className="tag_for_sticky">
                        <div>
                            <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
                            <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default DetailPost;
