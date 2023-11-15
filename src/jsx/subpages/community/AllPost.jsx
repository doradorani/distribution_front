import React, { useEffect, useRef, useState } from 'react';
import Post from './Post';
import LoadingPostCard from './LoadingPostCard';
import { useValidationItem } from '../../../js/api/VlidationItem';
import { Link } from 'react-router-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import Swal from 'sweetalert2';
import userInfo_config from '../../../js/api/config/userInfo_config';

const AllPost = ({ isUpdate, setIsUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState([]);
    const [page, setPage] = useState(6);
    const [postId, setPostId] = useState(0);

    const validationItemForAllPost = useValidationItem();
    const loadMoreDataRef = useRef(null);
    const loginedUserNickname = userInfo_config.userNickname;

    // 추후에 postURL 각 포스트 주소값으로 직접 할당해야함
    const postURL = window.location.href;

    const copyPostURL = () => {
        Swal.fire({
            icon: 'success',
            title: `해당 링크가 복사되었습니다.`,
            text: `${postURL}/detail_post/${postId}`,
        });
    };

    console.log(responseData);

    useEffect(() => {
        setIsUpdate(false);
        setPage(1);
        const getAllPost = async () => {
            try {
                setIsLoading(true);
                if (responseData?.length < 5) {
                    const res = await validationItemForAllPost('get', `/community/getAllPosts`, null);
                    if (res.success) {
                        setResponseData(res?.data);
                    }
                }
            } catch (error) {
                console.error('게시물을 불러오는 중 오류 발생', error);
            } finally {
                setIsLoading(false);
            }
        };
        getAllPost();
    }, [isUpdate]);

    useEffect(() => {
        // console.log('useEffect for Intersection Observer is triggered!');
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5, // 50% 이상 보일 때
        };

        const observer = new IntersectionObserver(handleIntersection, options);
        if (loadMoreDataRef.current) {
            observer.observe(loadMoreDataRef.current);
        }

        return () => {
            if (loadMoreDataRef.current) {
                observer.unobserve(loadMoreDataRef.current);
            }
        };
    }, [loadMoreDataRef.current]);

    const handleIntersection = (entries) => {
        entries.forEach((entry) => {
            // console.log('Intersection Observer Callback:', entry);
            if (entry.isIntersecting) {
                // "test" div가 뷰포트에 들어왔을 때
                // console.log('테스트 div가 뷰포트에 있습니다!');
                // 여기에서 더 많은 데이터를 로드하거나 다른 작업을 수행할 수 있습니다.
                setPage((prevPage) => prevPage + 5);
                loadMoreData();
            }
        });
    };

    const loadMoreData = async () => {
        // console.log('loadMoreData() CALLED!!');
        try {
            setIsLoading(true);
            if (responseData && responseData.length >= 5) {
                const currentPage = page - 1;
                const res = await validationItemForAllPost(
                    'get',
                    `/community/getMorePosts/` + responseData[currentPage].no,
                    null
                );
                if (res.success) {
                    setResponseData((prevData) => [...prevData, ...res.data]);
                }
            }
        } catch (error) {
            console.error('게시물을 불러오는 중 오류 발생', error);
        } finally {
            setIsLoading(false);
        }
    };

    const targetRow = responseData?.find((item) => item.no === postId);

    return (
        <>
            {isLoading ? (
                <div></div>
            ) : (
                <>
                    <div className="post_section nn_font">
                        <div className=" flex yg_font" style={{ marginBottom: '30px' }}>
                            <img src="/test_imgs/png/아기여워.png" style={{ width: '55px', marginRight: '15px' }} />
                            <div style={{ fontSize: '40px', marginRight: '15px' }}>아 ~ 기여워</div>
                            <div
                                style={{
                                    fontSize: '20px',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    marginBottom: '10px',
                                }}
                            >
                                &#62;&nbsp;전체 게시글
                            </div>
                        </div>
                        {isLoading ? (
                            <>
                                <LoadingPostCard />
                                <LoadingPostCard />
                                <LoadingPostCard />
                            </>
                        ) : responseData !== null && responseData.length == 0 ? (
                            <div>첫번째 게시물을 등록해보세요.</div>
                        ) : (
                            (responseData !== null ? responseData : [])?.map((data) => (
                                <Post key={data?.no} data={data} postId={postId} setPostId={setPostId} />
                            ))
                        )}
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
                                        {loginedUserNickname !== targetRow?.nickname && (
                                            <>
                                                <div
                                                    className="hover_cursor"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modal_for_post_declaration"
                                                    style={{ color: 'red' }}
                                                >
                                                    신고
                                                </div>
                                                <hr />
                                            </>
                                        )}
                                        <Link to={`/community/detail_post/${postId}`} className="none_underline">
                                            <div data-bs-dismiss="modal" aria-label="Close">
                                                게시물로 이동
                                            </div>
                                        </Link>
                                        <hr />
                                        <a
                                            className="hover_cursor none_underline"
                                            onClick={copyPostURL}
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        >
                                            <CopyToClipboard text={`${postURL}/detail_post/${postId}`}>
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

                        <div ref={loadMoreDataRef} style={{ width: '730px', height: '60px' }}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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

export default AllPost;
