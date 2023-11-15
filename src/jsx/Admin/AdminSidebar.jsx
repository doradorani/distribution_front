import React from 'react';
import '../../css/common/adminSidebar.css';
import { Link } from 'react-router-dom';

const AdminSidbar = ({ isSidebarCollapsed, setisSidebarCollapsed }) => {
    const toggleSidebar = () => {
        setisSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div
            className={`admin_side_menu_wrap yg_font ${
                isSidebarCollapsed ? 'admin_side_open' : 'admin_side_collapsed'
            }`}
            style={{ backgroundColor: '#eff0f3' }}
        >
            <nav className='navbar' style={{ paddingBottom: '0px' }}>
                <div className='container-fluid '>
                    <button
                        className='navbar-toggler flex'
                        type='button'
                        style={{ border: 'none', width: '250px' }}
                        onClick={() => toggleSidebar()}
                    >
                        <span
                            className={`navbar-toggler1-icon ${
                                isSidebarCollapsed ? 'admin_side_open' : 'admin_side_collapsed'
                            }`}
                        >
                            <img
                                className='collapse_arrow'
                                src='/test_imgs/png/down-arrow.png'
                                style={{ width: '30px' }}
                            />
                        </span>
                        <div
                            className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                            style={{
                                marginLeft: '15px',
                                lineHeight: '30px',
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            메뉴 접어두기
                        </div>
                    </button>
                </div>
            </nav>
            <nav className='navbar' style={{ marginTop: '0px', paddingTop: '0px' }}>
                <div className='container-fluid'>
                    <Link to='user_suspended' className='link_btn_admin_sidebar'>
                        <button
                            className='navbar-toggler flex'
                            type='button'
                            data-bs-toggle='collapse'
                            data-bs-target='#navbarToggleExternalContent2'
                            aria-expanded='false'
                            style={{ border: 'none', width: '245px' }}
                        >
                            <span
                                className={`navbar-toggler1-icon ${
                                    isSidebarCollapsed ? 'admin_side_open' : 'admin_side_collapsed'
                                }`}
                            >
                                <img src='/test_imgs/svg/group.svg' style={{ width: '30px' }} />
                            </span>
                            <div
                                className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                                style={{
                                    marginLeft: '15px',
                                    lineHeight: '30px',
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                유저 관리
                            </div>
                        </button>
                    </Link>
                    <button
                        className='navbar-toggler flex'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarToggleExternalContent3'
                        role='button'
                        aria-expanded='false'
                        style={{ border: 'none', width: '245px' }}
                    >
                        <span
                            className={`navbar-toggler1-icon ${
                                isSidebarCollapsed ? 'admin_side_open' : 'admin_side_collapsed'
                            }`}
                        >
                            <img src='/test_imgs/svg/approval.svg' style={{ width: '30px' }} />
                        </span>
                        <div
                            className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                            style={{
                                marginLeft: '15px',
                                lineHeight: '30px',
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            관리자 승인
                        </div>
                    </button>
                    <div
                        className={` collapse ${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                        id='navbarToggleExternalContent3'
                    >
                        <Link to='admin_authorization' className='link_btn_admin_sidebar'>
                            <button
                                className='navbar-toggler flex'
                                type='button'
                                style={{ border: 'none', width: '245px' }}
                            >
                                <span className={`navbar-toggler1-icon `} style={{ marginLeft: '15px' }}>
                                    <img src='/test_imgs/svg/chevron_right.svg' style={{ width: '30px' }} />
                                </span>
                                <div
                                    className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                                    style={{
                                        marginLeft: '15px',
                                        lineHeight: '30px',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    승인 관리자{' '}
                                </div>
                            </button>
                        </Link>
                        <Link to='admin_none_authorization' className='link_btn_admin_sidebar'>
                            <button
                                className='navbar-toggler flex'
                                type='button'
                                style={{ border: 'none', width: '245px' }}
                            >
                                <span className='navbar-toggler1-icon' style={{ marginLeft: '15px' }}>
                                    <img src='/test_imgs/svg/chevron_right.svg' style={{ width: '30px' }} />
                                </span>
                                <div
                                    className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                                    style={{
                                        marginLeft: '15px',
                                        lineHeight: '30px',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    미승인 관리자{' '}
                                </div>
                            </button>
                        </Link>
                    </div>
                    <button
                        className='navbar-toggler flex'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarToggleExternalContent4'
                        aria-expanded='false'
                        style={{ border: 'none', width: '245px' }}
                    >
                        <span
                            className={`navbar-toggler1-icon ${
                                isSidebarCollapsed ? 'admin_side_open' : 'admin_side_collapsed'
                            }`}
                        >
                            <img src='/test_imgs/svg/notice.svg' style={{ width: '30px' }} />
                        </span>
                        <div
                            className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                            style={{
                                marginLeft: '15px',
                                lineHeight: '30px',
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            공지사항
                        </div>
                    </button>
                    <div
                        className={` collapse ${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                        id='navbarToggleExternalContent4'
                    >
                        <Link to='admin_notice' className='link_btn_admin_sidebar'>
                            <button
                                className='navbar-toggler flex'
                                type='button'
                                style={{ border: 'none', width: '245px' }}
                            >
                                <span className='navbar-toggler1-icon' style={{ marginLeft: '15px' }}>
                                    <img src='/test_imgs/svg/chevron_right.svg' style={{ width: '30px' }} />
                                </span>
                                <div
                                    className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                                    style={{
                                        marginLeft: '15px',
                                        lineHeight: '30px',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    등록된 공지사항{' '}
                                </div>
                            </button>
                        </Link>
                        <Link to='write_admin_notice' className='link_btn_admin_sidebar'>
                            <button
                                className='navbar-toggler flex'
                                type='button'
                                style={{ border: 'none', width: '245px' }}
                            >
                                <span className='navbar-toggler1-icon' style={{ marginLeft: '15px' }}>
                                    <img src='/test_imgs/svg/chevron_right.svg' style={{ width: '30px' }} />
                                </span>
                                <div
                                    className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                                    style={{
                                        marginLeft: '15px',
                                        lineHeight: '30px',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    작성하기{' '}
                                </div>
                            </button>
                        </Link>
                    </div>
                    <button
                        className='navbar-toggler flex'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarToggleExternalContent5'
                        aria-expanded='false'
                        style={{ border: 'none', width: '245px' }}
                    >
                        <span
                            className={`navbar-toggler1-icon ${
                                isSidebarCollapsed ? 'admin_side_open' : 'admin_side_collapsed'
                            }`}
                        >
                            <img src='/test_imgs/svg/report.svg' style={{ width: '30px' }} />
                        </span>
                        <div
                            className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                            style={{
                                marginLeft: '15px',
                                lineHeight: '30px',
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            신고 처리
                        </div>
                    </button>
                    <div
                        className={` collapse ${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                        id='navbarToggleExternalContent5'
                    >
                        <Link to='post_report' className='link_btn_admin_sidebar'>
                            <button
                                className='navbar-toggler flex'
                                type='button'
                                style={{ border: 'none', width: '245px' }}
                            >
                                <span className='navbar-toggler1-icon' style={{ marginLeft: '15px' }}>
                                    <img src='/test_imgs/svg/chevron_right.svg' style={{ width: '30px' }} />
                                </span>
                                <div
                                    className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                                    style={{
                                        marginLeft: '15px',
                                        lineHeight: '30px',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    신고된 게시물{' '}
                                </div>
                            </button>
                        </Link>
                        <Link to='comment_report' className='link_btn_admin_sidebar'>
                            <button
                                className='navbar-toggler flex'
                                type='button'
                                style={{ border: 'none', width: '245px' }}
                            >
                                <span className='navbar-toggler1-icon' style={{ marginLeft: '15px' }}>
                                    <img src='/test_imgs/svg/chevron_right.svg' style={{ width: '30px' }} />
                                </span>
                                <div
                                    className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                                    style={{
                                        marginLeft: '15px',
                                        lineHeight: '30px',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    신고된 댓글{' '}
                                </div>
                            </button>
                        </Link>
                    </div>
                    <button
                        className='navbar-toggler flex'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarToggleExternalContent6'
                        aria-expanded='false'
                        style={{ border: 'none', width: '245px' }}
                    >
                        <span
                            className={`navbar-toggler1-icon ${
                                isSidebarCollapsed ? 'admin_side_open' : 'admin_side_collapsed'
                            }`}
                        >
                            <img src='/test_imgs/svg/shopping_cart.svg' style={{ width: '30px' }} />
                        </span>
                        <div
                            className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                            style={{
                                marginLeft: '15px',
                                lineHeight: '30px',
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            공동 구매
                        </div>
                    </button>
                    <div
                        className={` collapse ${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                        id='navbarToggleExternalContent6'
                    >
                        <Link to='co-buying_list' className='link_btn_admin_sidebar'>
                            <button
                                className='navbar-toggler flex'
                                type='button'
                                style={{ border: 'none', width: '245px', display: 'flex', alignItems: 'flex-end' }}
                            >
                                <span className='navbar-toggler1-icon' style={{ marginLeft: '15px' }}>
                                    <img src='/test_imgs/svg/chevron_right.svg' style={{ width: '30px' }} />
                                </span>
                                <div
                                    className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                                    style={{
                                        marginLeft: '15px',
                                        lineHeight: '30px',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    공구 제품 관리{' '}
                                </div>
                            </button>
                        </Link>
                        <Link to='regist_product' className='link_btn_admin_sidebar'>
                            <button
                                className='navbar-toggler flex'
                                type='button'
                                style={{ border: 'none', width: '245px', display: 'flex', alignItems: 'flex-end' }}
                            >
                                <span className='navbar-toggler1-icon' style={{ marginLeft: '15px' }}>
                                    <img src='/test_imgs/svg/chevron_right.svg' style={{ width: '30px' }} />
                                </span>
                                <div
                                    className={`${isSidebarCollapsed ? '' : 'admin_side_fold'}`}
                                    style={{
                                        marginLeft: '15px',
                                        lineHeight: '30px',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    제품 등록
                                </div>
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>
            {/* </div> */}
        </div>
    );
};

export default AdminSidbar;
