import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../../css/subpage/myposts.css';
import MyPostCard from './MyPostCard';
import { useValidationItem } from '../../../js/api/VlidationItem';
import userInfo_config from '../../../js/api/config/userInfo_config';
import LoadingMyPostCard from './LoadingMyPostCard';
import { useDispatch } from 'react-redux';
import LogOutApi from '../../../js/api/LogOutApi';

const MyPosts = ({ isUpdate, setIsUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState([]);

    const validationItemForMyPosts = useValidationItem();
    const navigate = useNavigate();
    const dataDispatch = useDispatch();

    useEffect(() => {
        setIsUpdate(false);
        setResponse(null);
        const getMyPosts = async () => {
            console.log('getMyPosts() CALLED!!');
            try {
                setIsLoading(true);
                const response = await validationItemForMyPosts('get', '/community/getMyPosts', null);
                if (response.code === 200 && response.data !== null) {
                    console.log(response);
                    setResponse(response.data);
                }
            } catch (error) {
                console.error('Error fetching posts', error);
            } finally {
                setIsLoading(false);
            }
        };
        getMyPosts();
    }, [isUpdate]);

    const logOutHandler = () => {
        LogOutApi({ navigate, dataDispatch });
    };

    return (
        <>
            {isLoading ? (
                <>
                    <div className="post_section nn_font" style={{ width: '1200px' }}>
                        <div className="my_posts_wrap" style={{ width: '1070px' }}>
                            <div className="my_posts_profile_wrap" style={{ width: '800px' }}>
                                <div className="flex_for_my_posts_profile">
                                    <div className="flex">
                                        <div className="my_posts_profile_img" style={{ marginRight: '20px' }}>
                                            <div
                                                className="spinner-grow"
                                                style={{ width: '7rem', height: '7rem', marginRight: '15px' }}
                                                role="status"
                                            ></div>
                                        </div>
                                        <div
                                            className="flex"
                                            style={{
                                                width: '100px',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <h5 className="card-title placeholder-glow" style={{ margin: '3px' }}>
                                                <span className="placeholder col-12"></span>
                                            </h5>
                                            <h5 className="card-title placeholder-glow" style={{ margin: '3px' }}>
                                                <span className="placeholder col-8"></span>
                                            </h5>
                                            <h5 className="card-title placeholder-glow" style={{ margin: '3px' }}>
                                                <span className="placeholder col-7"></span>
                                            </h5>
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            className="spinner-grow "
                                            style={{
                                                width: '4rem',
                                                height: '4rem',
                                                marginTop: '25px',
                                            }}
                                            role="status"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <hr className="division_line_in_posts" />
                            <div className="my_posts_contents_wrap">
                                <LoadingMyPostCard />
                                <LoadingMyPostCard />
                                <LoadingMyPostCard />
                                <LoadingMyPostCard />
                                <LoadingMyPostCard />
                                <LoadingMyPostCard />
                            </div>
                        </div>
                    </div>
                    {/* <div className="tag_for_sticky">
                        <div>
                            <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
                            <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
                        </div>
                    </div> */}
                </>
            ) : (
                <>
                    <div className="post_section nn_font" style={{ width: '1200px' }}>
                        <div className="my_posts_wrap" style={{ width: '1070px' }}>
                            <div className="my_posts_profile_wrap" style={{ width: '800px' }}>
                                <div className="flex_for_my_posts_profile">
                                    <div className="flex">
                                        <div className="my_posts_profile_img">
                                            <img
                                                src={
                                                    response?.userDto
                                                        ? response?.userDto?.img
                                                        : `/test_imgs/png/profile.png`
                                                }
                                            />
                                        </div>
                                        <div className="my_post_profile_info">
                                            <div className="my_posts_profile_name yg_font">
                                                {response?.userDto?.nickname}
                                            </div>
                                            <div className="my_posts_cnt">게시물 {response?.postDtos?.length}</div>
                                            <div className="my_posts_profile_nickname">{response?.userDto?.name}</div>
                                        </div>
                                    </div>
                                    <Link>
                                        <div>
                                            <img
                                                src="/test_imgs/png/cogwheel.png"
                                                style={{ width: '50px', height: '120px', objectFit: 'contain' }}
                                                data-bs-toggle="modal"
                                                data-bs-target="#modal_for_profile_setting"
                                            />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <hr className="division_line_in_posts" />
                            <div className="my_posts_contents_wrap">
                                {isLoading ? (
                                    response?.postDtos?.map((data) => <LoadingMyPostCard key={data.no} data={data} />)
                                ) : response?.postDtos === null || response?.postDtos?.length === 0 ? (
                                    <div className="flex">
                                        <div>첫번째 게시물을 등록해보세요.</div>
                                    </div>
                                ) : (
                                    response?.postDtos?.map((data) => <MyPostCard key={data.no} data={data} />)
                                )}
                            </div>
                            {/* 모달 START */}
                            <div
                                className="modal fade"
                                id="modal_for_profile_setting"
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
                                            <Link to="/user_info" className="none_underline">
                                                <div data-bs-dismiss="modal" aria-label="Close">
                                                    프로필 편집
                                                </div>
                                            </Link>
                                            <hr />
                                            <div
                                                className="hover_cursor"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                                onClick={() => logOutHandler()}
                                            >
                                                로그아웃
                                            </div>
                                            <hr />
                                            <div className="hover_cursor" data-bs-dismiss="modal" aria-label="Close">
                                                취소
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 모달 END */}
                        </div>
                    </div>

                    {/* <div className="tag_for_sticky">
                        <div>
                            <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
                            <img className="adv_img_notice_right" src="/test_imgs/sns_imgs/sns1.jpg" />
                        </div>
                    </div> */}
                </>
            )}
        </>
    );
};

export default MyPosts;
