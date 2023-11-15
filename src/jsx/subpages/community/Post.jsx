import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import '../../../css/subpage/post.css';
import Swal from 'sweetalert2';
import { useValidationItem } from '../../../js/api/VlidationItem';
import userInfo_config from '../../../js/api/config/userInfo_config';

const Post = ({ data, postId, setPostId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [byteCount, setByteCount] = useState(0);
    const [reportReason, setReportReason] = useState('');

    const ValidationItem = useValidationItem();
    const validationForEmotionBtn = useValidationItem();

    const postDate = new Date(data?.reg_date);
    const currentDate = new Date();
    const timeDifference = currentDate - postDate;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const s3_img_path = data.imgs_path.split(',');
    const s3_first_img_path = s3_img_path[0];

    const handleTextChange = (e) => {
        const text = e.target.value;
        // 함수 호출하여 바이트 수 계산
        setReportReason(text);
        fn_checkByte(text);

        console.log(reportReason);
    };

    const removereportReason = () => {
        console.log('removereportReason CALLED!!');
        setReportReason('');

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

    const emotionBtnHandler = () => {
        console.log('emotionBtnHandler() CALLED!!');

        const addEmotionCnt = async () => {
            try {
                const res = await validationForEmotionBtn('put', `/community/updateEmotionBtn`, null);
                if (res.success) {
                    // setResponseData(res?.data);
                }
            } catch (error) {
                console.error('게시물을 불러오는 중 오류 발생', error);
            } finally {
                // setIsLoading(false);
            }
        };
        addEmotionCnt();
    };

    const summitReport = async (index) => {
        const postId = index;
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

    return (
        <>
            <div className="post_wrap">
                <div className="flex_for_profile">
                    <div className="flex">
                        <div className="profile_img">
                            <img src={data.img === null ? `/test_imgs/png/profile.png` : data?.img} />
                        </div>
                        <div className="profile_info">
                            <div className="profile_name">{data?.nickname}</div>
                            {/* <div className="update_date">{data.mod_date.substring(0, 10)}</div> */}
                            <div className="update_date">{daysAgo == 0 ? '오늘' : `${daysAgo}일 전`}</div>
                        </div>
                    </div>
                    <Link>
                        <div onClick={removereportReason}>
                            <img
                                src="/test_imgs/png/more.png"
                                style={{ width: '20px', height: '60px', objectFit: 'contain' }}
                                data-bs-toggle="modal"
                                data-bs-target="#modal_for_post_detail"
                                onClick={() => {
                                    console.log(data.no);
                                    setPostId(data.no);
                                }}
                            />
                        </div>
                    </Link>
                </div>
                <div className="text_contents">{data?.post_text}</div>
                <Link to={`/community/detail_post/${data?.no}`} className="none_underline">
                    <div className="for_detail">자세히 보기</div>
                </Link>
                <div className="post_main_img">
                    <img src={s3_first_img_path} />
                </div>
                <div className="emotion_btns flex">
                    <div className="flex">
                        <a className="flex none_underline" onClick={() => emotionBtnHandler(1)}>
                            <div>
                                <img className="emotion_btn" src="/test_imgs/png/heart.png" />
                            </div>
                            <div className="emotion_btn_cnt">{data?.like_cnt}</div>
                        </a>
                    </div>
                    <div className="flex">
                        <a className="flex none_underline" onClick={() => emotionBtnHandler(2)}>
                            <div>
                                <img className="emotion_btn" src="/test_imgs/png/like.png" />
                            </div>
                            <div className="emotion_btn_cnt">{data?.great_cnt}</div>
                        </a>
                    </div>
                    <div className="flex">
                        <a className="flex none_underline" onClick={() => emotionBtnHandler(3)}>
                            <div>
                                <img className="emotion_btn" src="/test_imgs/png/sad.png" />
                            </div>
                            <div className="emotion_btn_cnt">{data?.sad_cnt}</div>
                        </a>
                    </div>
                </div>
                <div className="reply_cnt">
                    <Link to={`/community/detail_post/${data?.no}`} className="none_underline">
                        댓글 {data?.reply_cnt}개
                    </Link>
                </div>
                {/* 모달 START */}

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
                                    onClick={() => summitReport(postId)}
                                >
                                    제출하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 모달 END */}
            </div>
        </>
    );
};

export default Post;
