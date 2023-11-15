import React from 'react';
import '../../css/common/sidemenu.css';
import '../../css/common/common.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useParams } from 'react-router-dom';
import userInfo_config from '../../js/api/config/userInfo_config';

const SideMenu = ({ selectedMenu, setSelectedSideMenu, setSelectedNotice, deleteAllContent }) => {
    let menuContent;
    let userId = userInfo_config.userName;
    const paramsUserId = useParams().userId;

    const sideMenuNoticeClickHandler = (index) => {
        setSelectedSideMenu(index);
        setSelectedNotice(0);
    };

    if (selectedMenu === 1) {
        menuContent = (
            <>
                <div>
                    <Link to="/diary" className="none_deco_link">
                        <div className="side_menu_btn">
                            <img src="/test_imgs/png/diary3.png" style={{ width: '45px', marginRight: '15px' }} />
                            육아 일기
                        </div>
                    </Link>
                    <div>
                        <Link to="/diary" className="none_deco_link">
                            <div className="side_menu_sub_btn">- 일기</div>
                        </Link>
                        <Link to="/diary/calendar" className="none_deco_link">
                            <div className="side_menu_sub_btn">- 달력</div>
                        </Link>
                        <Link to="/diary/album" className="none_deco_link">
                            <div className="side_menu_sub_btn">- 앨범</div>
                        </Link>
                    </div>
                    <Link to="/diary/children_health_note/0" className="none_deco_link">
                        <div className="side_menu_btn" style={{ marginTop: '15px' }}>
                            <img src="/test_imgs/png/diary1.png" style={{ width: '45px', marginRight: '15px' }} />
                            육아 수첩
                        </div>
                    </Link>
                    <div>
                        <Link to="/diary/children_health_note/0" className="none_deco_link">
                            <div className="side_menu_sub_btn">- 한 눈에 보기</div>
                        </Link>
                        <Link to="/diary/children_health_list" className="none_deco_link">
                            <div className="side_menu_sub_btn">- 접종 내역</div>
                        </Link>
                    </div>
                </div>
            </>
        );
    } else if (selectedMenu === 2) {
        menuContent = (
            <div>
                <Link to="/community" className="none_deco_link">
                    <div className="side_menu_btn">
                        <img src="/test_imgs/png/아기여워.png" style={{ width: '45px', marginRight: '15px' }} />
                        아&nbsp;~&nbsp;&nbsp;기여워!
                    </div>
                </Link>

                <div>
                    <Link to="/community" className="none_deco_link">
                        <div className="side_menu_sub_btn">- 전체 게시글</div>
                    </Link>
                    <Link to="/community/my_posts" className="none_deco_link">
                        <div className="side_menu_sub_btn">- 내 게시글</div>
                    </Link>
                    <Link to="/community/detail_post/:postId" className="none_deco_link">
                        <div className="side_menu_sub_btn">- test</div>
                    </Link>
                </div>
                <div
                    className="side_menu_btn"
                    data-bs-toggle="modal"
                    data-bs-target="#modal_for_post_img"
                    // onClick={() => setPreviewImage(null)}
                    onClick={deleteAllContent}
                >
                    <img src="/test_imgs/png/pencil_logo.png" style={{ width: '45px', marginRight: '15px' }} />새 글
                    작성하기
                </div>
                <Link to="/community/co_buying_list" className="none_deco_link">
                    <div className="side_menu_btn" style={{ marginTop: '15px' }} onClick={() => setSelectedSideMenu(3)}>
                        <img src="/test_imgs/png/bag.png" style={{ width: '45px', marginRight: '15px' }} />
                        아기자기 쇼핑하기
                    </div>
                </Link>
                <div>
                    <Link to="/community/co_buying_list" className="none_deco_link">
                        <div className="side_menu_sub_btn">- 전체 상품</div>
                    </Link>
                    <Link to="/community/co_buying_proceed/ing" className="none_deco_link">
                        <div className="side_menu_sub_btn">- 진행 중인 상품</div>
                    </Link>
                    <Link to="/community/co_buying_proceed/going" className="none_deco_link">
                        <div className="side_menu_sub_btn">- 진행 예정 상품</div>
                    </Link>
                    <Link to="/community/co_buying_proceed/end" className="none_deco_link">
                        <div className="side_menu_sub_btn">- 진행 종료 상품</div>
                    </Link>
                </div>
            </div>
        );
    } else if (selectedMenu === 3) {
        menuContent = (
            <div>
                <div className="side_menu_btn" onClick={() => sideMenuNoticeClickHandler(1)}>
                    <img src="/test_imgs/png/post-it.png" style={{ width: '45px', marginRight: '15px' }} />
                    공지사항
                </div>
                {/* <div
                    className='side_menu_btn'
                    onClick={() => setSelectedSideMenu(2)}
                    // data-bs-toggle="modal"
                    // data-bs-target="#modal_for_post_img"
                    style={{ marginTop: '15px' }}
                >
                    <img src='/test_imgs/png/pencil_logo.png' style={{ width: '45px', marginRight: '15px' }} />
                    공지사항 작성하기
                </div> */}
            </div>
        );
    } else if (selectedMenu === 4) {
        menuContent = (
            <div>
                <Link to="/user_info" className="none_deco_link ">
                    <div className="side_menu_btn mb-2">
                        <img src="/test_imgs/png/user.png" style={{ width: '45px', marginRight: '15px' }} />
                        마이 페이지
                    </div>
                </Link>

                <Link
                    // to="/community"
                    className="none_deco_link"
                >
                    <div className="side_menu_btn mb-2">
                        <img src="/test_imgs/png/like1.png" style={{ width: '45px', marginRight: '15px' }} />
                        좋아요한 게시물
                    </div>
                </Link>

                <Link to="/user_myHit" className="none_deco_link">
                    <div className="side_menu_btn mb-2">
                        <img src="/test_imgs/png/gift.png" style={{ width: '45px', marginRight: '15px' }} />
                        좋아요한 상품
                    </div>
                </Link>

                <Link to="/user_myFunding" className="none_deco_link">
                    <div className="side_menu_btn mb-2">
                        <img src="/test_imgs/png/cart.png" style={{ width: '45px', marginRight: '15px' }} />
                        펀딩 상품 조회
                    </div>
                </Link>
            </div>
        );
    } else {
        menuContent = '';
    }

    return <div className="side_menu_wrap yg_font">{menuContent}</div>;
};

export default SideMenu;
