import React, { useEffect, useState } from 'react';
import '../../../../css/subpage/cobuyingdetail.css';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useValidationAdminItem } from '../../../../js/api/admin/ValidationAdminItem';
import { adminStateAction } from '../../../../js/api/redux_store/slice/adminLoginSlice';
import AdminCountdownTimer from '../../../../js/api/admin/AdminCountdownTimer';

const AdminCoBuyingDetail = () => {
    const location = useLocation();
    const detailProductNo = location.state ? location.state : null;
    const [isLoading, setIsLoading] = useState(false);

    const [detailCobuy, setDetailCobuy] = useState({});

    const adminCoBuyDispatch = useDispatch();
    const validateDetailProductAdmin = useValidationAdminItem();

    useEffect(() => {
        const listProduct = async () => {
            try {
                const validateDetailProductResponse = await validateDetailProductAdmin(
                    'get',
                    '/coBuy/detailProduct/' + detailProductNo
                );
                const detailResponse = validateDetailProductResponse.data.coBuyDetailProduct;

                const startDate = new Date(detailResponse.start_date);
                const endDate = new Date(detailResponse.end_date);

                setDetailCobuy({
                    adminCobuyNo: detailResponse.no,
                    adminCobuyId: detailResponse.id,
                    adminCobuyName: detailResponse.name,
                    adminCobuyContent: detailResponse.content,
                    adminCobuyPrice: detailResponse.price,
                    adminCobuyImg: detailResponse.img,
                    adminCobuyStart: detailResponse.start_date,
                    adminCobuyStart_Date: startDate,
                    adminCobuyEnd: detailResponse.end_date,
                    adminCobuyEnd_Date: endDate,
                    adminCobuyMin: detailResponse.min_num,
                    adminCobuyState: detailResponse.state,
                    adminCobuyHit: detailResponse.hit,
                    adminCobuyAccumulate: detailResponse.accumulate,
                    adminCobuyOption1: detailResponse.option1,
                    adminCobuyOption2: detailResponse.option2,
                    adminCobuyOption3: detailResponse.option3,
                    adminCobuyOption4: detailResponse.option4,
                    adminCobuyOption5: detailResponse.option5,
                    adminCobuyReg: detailResponse.reg_date,
                    adminCobuyMod: detailResponse.mod_date,
                });

                setIsLoading(true);
            } catch (error) {
                console.error('Error Message:', error.message);
                console.error('Status Code:', error.response.status);
                adminCoBuyDispatch(adminStateAction.setAdminState(false));
            } finally {
                setIsLoading(false);
            }
        };
        listProduct();
    }, []);

    return (
        <>
            <div className="co-buying_detail_wrap_admin nn_font">
                <div className="co-buying_detail_second_wrap_admin" style={{ marginTop: '10px' }}>
                    <div className="admin_page_menu_title_wrap" style={{ marginBottom: '20px', marginLeft: '50px' }}>
                        <img src="/test_imgs/svg/shopping_cart.svg" />
                        <div className="admin_page_menu_title yg_font ">공동 구매</div>
                        <div className="yg_font admin_page_menu_sub_title">&#62; 제품 등록</div>
                    </div>
                    <div className="co-buying_detail_section" style={{ position: 'relative' }}>
                        <div className="co-buying_detail_left_section">
                            <div className="co-buying_detail_main_img">
                                <img
                                    className="co-buying_detail_main_img"
                                    src={detailCobuy.adminCobuyImg ? detailCobuy.adminCobuyImg.split(',')[0] : ''}
                                    alt=""
                                />
                            </div>
                            <hr />
                            <div className="co-buying_detail_sub_section">
                                <div className="detail_sub_section_wrapper">
                                    <hr />
                                    <p className="bold" style={{ marginLeft: '40px' }}>
                                        상세 설명 및 이미지
                                    </p>
                                    <div className="deatil_sub_section_first_img ">
                                        {detailCobuy.adminCobuyName ? (
                                            detailCobuy.adminCobuyImg.split(',').slice(1).length > 0 ? (
                                                detailCobuy.adminCobuyImg
                                                    .split(',')
                                                    .slice(1)
                                                    .map((image, index) => (
                                                        <img
                                                            className="mb-4"
                                                            key={index}
                                                            src={image}
                                                            alt={`Image ${index + 1}`}
                                                        />
                                                    ))
                                            ) : (
                                                <p>첨부된 이미지가 없습니다</p>
                                            )
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="boarder_line"></div>
                        <div
                            className="co-buying_detail_right_section"
                            style={{ position: 'sticky', height: ' 650px', top: '100px' }}
                        >
                            <div className="co-buying_detail_right_container">
                                <div className="co-buying_category_container">
                                    <div className="co-buying_category_name_container yg_font">
                                        <a className="co-buying_category_link none_deco_link">
                                            <span>{detailCobuy.adminCobuyName ? detailCobuy.adminCobuyName : ''}</span>
                                        </a>
                                    </div>
                                    <div className="co-buying_sharing_icon_container">
                                        <div className="co-buying_sharing_icon_box">
                                            <img src="/test_imgs/community_imgs/share.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                                <hr className="co-buying_line" />
                                <div className="co-buying_short_info_container">
                                    <p className="co-buying_short_info_detail_1">
                                        {detailCobuy.adminCobuyContent ? detailCobuy.adminCobuyContent : ''}
                                    </p>
                                </div>
                                <div className="co-buying_funding_info_container">
                                    <div className="co-buying_participants_remainingsdays_container flex">
                                        <div className="co-buying_participants_wrapper" style={{ fontSize: '1.1em' }}>
                                            {typeof detailCobuy.adminCobuyAccumulate === 'number' &&
                                            typeof detailCobuy.adminCobuyMin === 'number' ? (
                                                <span
                                                    className="yg_font"
                                                    style={{ fontSize: '1.3em', marginRight: '5px' }}
                                                >
                                                    {detailCobuy.adminCobuyAccumulate} / {detailCobuy.adminCobuyMin}
                                                </span>
                                            ) : null}
                                            <span>명 참여</span>
                                            &nbsp;
                                        </div>
                                    </div>
                                    <div>
                                        <span className="co-buying_remainingsdays_wrapper">
                                            {detailCobuy.adminCobuyStart && detailCobuy.adminCobuyEnd ? (
                                                <span>
                                                    <AdminCountdownTimer detailCobuy={detailCobuy} />{' '}
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </span>
                                    </div>
                                    <div className="co-buying_funding_money_wrapper" style={{ fontSize: '1.1em' }}>
                                        <p className="co-buying_funding_money">
                                            {typeof detailCobuy.adminCobuyAccumulate === 'number' &&
                                            !isNaN(parseInt(detailCobuy.adminCobuyPrice)) ? (
                                                <span
                                                    className="yg_font"
                                                    style={{ fontSize: '1.5em', marginRight: '5px' }}
                                                >
                                                    {detailCobuy.adminCobuyAccumulate *
                                                        parseInt(detailCobuy.adminCobuyPrice) || 0}
                                                </span>
                                            ) : (
                                                0
                                            )}
                                            <span>원 달성</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="co-buying_funding_rate_container">
                                    <div className="co-buying_progressbar_wrappper">
                                        <div
                                            className="progressbar"
                                            style={{
                                                '--progressPercent': `${
                                                    (detailCobuy.adminCobuyAccumulate / detailCobuy.adminCobuyMin) * 100
                                                }%`,
                                            }}
                                        >
                                            <div className="progress"></div>
                                        </div>
                                    </div>
                                    <div className="co-buying_funding_text">
                                        <b className="co-buying_funding_rate">
                                            {typeof detailCobuy.adminCobuyMin === 'number' &&
                                            typeof detailCobuy.adminCobuyAccumulate === 'number'
                                                ? `${(
                                                      (detailCobuy.adminCobuyAccumulate / detailCobuy.adminCobuyMin) *
                                                      100
                                                  ).toFixed(2)} %`
                                                : ''}
                                        </b>
                                        <span>달성됨</span>
                                    </div>
                                </div>
                            </div>
                            <div className="co-buying_options_container">
                                <div className="co-buygin_options_wrapper ">
                                    <div className="co-buying_options_text mt-2">옵션 선택</div>
                                    <div className="co-buyging_options_wrapper mt-1">
                                        <select class=" form-select form-select-sm" aria-label="Small select example">
                                            <option value="" style={{ textAlign: 'center' }}>
                                                -- 선택 --
                                            </option>
                                            {detailCobuy.adminCobuyOption1 && (
                                                <option value={detailCobuy.adminCobuyOption1}>
                                                    {detailCobuy.adminCobuyOption1}
                                                </option>
                                            )}
                                            {detailCobuy.adminCobuyOption2 && (
                                                <option value={detailCobuy.adminCobuyOption2}>
                                                    {detailCobuy.adminCobuyOption2}
                                                </option>
                                            )}
                                            {detailCobuy.adminCobuyOption3 && (
                                                <option value={detailCobuy.adminCobuyOption3}>
                                                    {detailCobuy.adminCobuyOption3}
                                                </option>
                                            )}
                                            {detailCobuy.adminCobuyOption4 && (
                                                <option value={detailCobuy.adminCobuyOption4}>
                                                    {detailCobuy.adminCobuyOption4}
                                                </option>
                                            )}
                                            {detailCobuy.adminCobuyOption5 && (
                                                <option value={detailCobuy.adminCobuyOption5}>
                                                    {detailCobuy.adminCobuyOption5}
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="co-buying_buttons_container">
                                <div className="co-buying_buttons_wrapper flex" style={{ justifyContent: 'center' }}>
                                    <div className="like_button_wrapper">
                                        <div
                                            className="like_button"
                                            style={{ textAlign: 'center', position: 'relative' }}
                                        >
                                            <label htmlFor="checkbox" className="like_box">
                                                <input type="checkbox" id="checkbox" hidden checked />
                                                <svg
                                                    t="1689815540548"
                                                    className="icon"
                                                    viewBox="0 0 1024 1024"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    p-id="2271"
                                                >
                                                    <path
                                                        d="M742.4 101.12A249.6 249.6 0 0 0 512 256a249.6 249.6 0 0 0-230.72-154.88C143.68 101.12 32 238.4 32 376.32c0 301.44 416 546.56 480 546.56s480-245.12 480-546.56c0-137.92-111.68-275.2-249.6-275.2z"
                                                        fill="#231F20"
                                                        p-id="2272"
                                                        id="heart"
                                                    ></path>
                                                </svg>
                                                <span></span>
                                            </label>
                                            <div
                                                className="likes_count"
                                                style={{
                                                    textAlign: 'center',
                                                    position: 'absolute',
                                                    top: '45%',
                                                    left: '50%',
                                                    transform: ' translate(-50%, -50%)',
                                                    color: '#fff',
                                                }}
                                            >
                                                <div className="likes_count">
                                                    {typeof detailCobuy.adminCobuyHit === 'number'
                                                        ? detailCobuy.adminCobuyHit.toLocaleString()
                                                        : '0'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="co-buying_botton_wrpper">
                                        <div className="buying_button">
                                            <p className="yg_font">수정하기</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminCoBuyingDetail;
