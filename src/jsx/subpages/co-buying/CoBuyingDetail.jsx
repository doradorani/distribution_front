import React, { useEffect, useState } from 'react';
import '../../../css/subpage/cobuyingdetail.css';
import SideMenu from '../SideMenu';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userStateAction } from '../../../js/api/redux_store/slice/userLoginSlice';
import token_config from '../../../js/api/config/token_config';
import cobuy_config from '../../../js/api/config/userCobuy_config';
import { useValidationItem } from '../../../js/api/VlidationItem';
import Swal from 'sweetalert2';
import { userCobuyAction } from '../../../js/api/redux_store/slice/userCobuySlice';
import CountdownTimer from '../../../js/api/CountdownTimer';
import userCobuy_config from '../../../js/api/config/userCobuy_config';
import userLogin_config from '../../../js/api/config/userLogin_config';

const CoBuyingDetail = ({ setSelectedSideMenu }) => {
    const location = useLocation();
    const detailProductNo = location.state ? location.state : null;

    const server = token_config.server;
    const hitList = cobuy_config.hits;
    const [isChecked, setIsChecked] = useState(hitList.includes(detailProductNo));

    const [isLoading, setIsLoading] = useState(false);
    const [detailCobuy, setDetailCobuy] = useState({});
    const [selectedOption, setSelectedOption] = useState(''); // 상태 변수 초기화

    const validateFunding = useValidationItem();
    const validateHit = useValidationItem();

    const userCoBuyDispatch = useDispatch();
    const navigate = useNavigate();

    const today = new Date();
    const [fundingText, setFundingText] = useState('');

    const validateOptionFunding = useValidationItem();

    useEffect(() => {
        const listProduct = async () => {
            try {
                let detailResponse;

                if (userLogin_config.state) {
                    await validateOptionFunding('get', '/coBuy/userDetailProduct/' + detailProductNo).then((res) => {
                        detailResponse = res.data.coBuyDetailProduct;

                        const myOptionResponse = res.data.myCobuyOption;
                        if (myOptionResponse !== null && myOptionResponse !== undefined && myOptionResponse !== '') {
                            setSelectedOption(myOptionResponse);
                        }
                    });
                } else {
                    const validateListResponse = await axios.get(`${server}/coBuy/detailProduct/` + detailProductNo);
                    detailResponse = validateListResponse.data.data.coBuyDetailProduct;
                }

                const startDate = new Date(detailResponse.start_date);
                const endDate = new Date(detailResponse.end_date);

                if (today < startDate) setFundingText('펀딩 대기중');
                else if (today > endDate) setFundingText('펀딩 마감');
                else if (userCobuy_config.fundings.includes(detailProductNo)) setFundingText('펀딩 취소');
                else setFundingText('펀딩하기');

                setDetailCobuy({
                    cobuyNo: detailResponse.no,
                    cobuyId: detailResponse.id,
                    cobuyName: detailResponse.name,
                    cobuyContent: detailResponse.content,
                    cobuyPrice: detailResponse.price,
                    cobuyImg: detailResponse.img,
                    cobuyStart: detailResponse.start_date,
                    cobuyStart_Date: startDate,
                    cobuyEnd: detailResponse.end_date,
                    cobuyEnd_Date: endDate,
                    cobuyMin: detailResponse.min_num,
                    cobuyState: detailResponse.state,
                    cobuyHit: detailResponse.hit,
                    cobuyAccumulate: detailResponse.accumulate,
                    cobuyOption1: detailResponse.option1,
                    cobuyOption2: detailResponse.option2,
                    cobuyOption3: detailResponse.option3,
                    cobuyOption4: detailResponse.option4,
                    cobuyOption5: detailResponse.option5,
                    cobuyReg: detailResponse.reg_date,
                    cobuyMod: detailResponse.mod_date,
                });

                setIsLoading(true);
            } catch (error) {
                console.error('Error :', error);
                userCoBuyDispatch(userStateAction.setState(false));
            } finally {
                setIsLoading(false);
            }
        };
        listProduct();
    }, [fundingText]);

    const handleOptionChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value); // 선택한 값을 상태 변수에 저장
    };

    const userFundingHandler = () => {
        if (fundingText === '펀딩 대기중') {
            Swal.fire({
                text: '펀딩 대기중입니다!',
                icon: 'warning',
                timer: 1000,
                showConfirmButton: false,
            });
            return;
        } else if (fundingText === '펀딩 마감') {
            Swal.fire({
                text: '펀딩이 마감되었습니다.',
                icon: 'error',
                timer: 1000,
                showConfirmButton: false,
            });
            return;
        } else if (fundingText === '펀딩하기') {
            confirmFunding();
        } else {
            cancelFunding();
        }
    };

    const confirmFunding = async () => {
        if (selectedOption === '' || selectedOption === null) {
            Swal.fire({
                title: '옵션을 선택해주세요',
                icon: 'warning',
            });
        } else {
            Swal.fire({
                title: '펀딩 하시겠습니까?',
                text: detailCobuy.cobuyName,
                icon: 'warning',
                showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '확인',
                cancelButtonText: '취소',
                //reverseButtons: true, // 버튼 순서 거꾸로
            }).then((result) => {
                if (result.isConfirmed) {
                    validateFunding('post', '/coBuy/fundingProduct/' + detailProductNo + '/' + selectedOption)
                        .then((fundingResponse) => {
                            if (fundingResponse.data == 0) {
                                Swal.fire('이미 펀딩한 상품입니다~!.', '다시 확인해주세요!', 'warning');
                            } else if (fundingResponse.success) {
                                Swal.fire('펀딩이 완료되었습니다.', '화끈하시네요~!', 'success');
                                const updatedFundings = [...userCobuy_config.fundings, detailProductNo];
                                userCoBuyDispatch(userCobuyAction.setFund(updatedFundings));
                                setFundingText('펀딩 취소');
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            });
        }
    };

    const cancelFunding = async () => {
        Swal.fire({
            title: '펀딩을 취소하시겠습니까?',
            text: detailCobuy.cobuyName,
            icon: 'warning',
            showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            //reverseButtons: true, // 버튼 순서 거꾸로
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('test');
                validateFunding('post', '/coBuy/cancelFundingProduct/' + detailProductNo)
                    .then((fundingResponse) => {
                        if (fundingResponse.success) {
                            Swal.fire('펀딩이 완료되었습니다.', '화끈하시네요~!', 'success');
                            const updatedFundings = userCobuy_config.fundings.filter(
                                (productNo) => productNo !== detailProductNo
                            );
                            userCoBuyDispatch(userCobuyAction.setFund(updatedFundings));
                            setSelectedOption('');
                            setFundingText('펀딩하기');
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    };

    const hitHandler = () => {
        try {
            validateHit('get', '/coBuy/coBuyHit/' + detailProductNo).then((res) => {
                setDetailCobuy((prevDetailCobuy) => ({
                    ...prevDetailCobuy,
                    cobuyHit: res.data,
                }));
            });
            if (!isChecked) {
                // 좋아요를 눌렀을 때
                setIsChecked(true);
                userCoBuyDispatch(userCobuyAction.setHit([...hitList, detailProductNo]));
            } else {
                // 좋아요를 취소했을 때
                setIsChecked(false);
                userCoBuyDispatch(userCobuyAction.setHit(hitList.filter((item) => item !== detailProductNo)));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="co-buying_detail_wrap nn_font">
                <div
                    className="community_main_img flex"
                    style={{ justifyContent: 'space-evenly', backgroundColor: '#DAEEED' }}
                >
                    <img className="community_main_img" src="/test_imgs/community_imgs/commu2.jpg" />
                    <img className="community_main_img" src="/test_imgs/community_imgs/community_heart.jpg" />
                    <img className="community_main_img" src="/test_imgs/community_imgs/community.jpg" />
                </div>
                <div className="co-buying_detail_second_wrap" style={{ paddingLeft: '40px', paddingTop: '30px' }}>
                    <SideMenu selectedMenu={2} setSelectedSideMenu={setSelectedSideMenu} />
                    <div className="co-buying_detail_section">
                        <div className="co-buying_detail_left_section">
                            <div className=" flex yg_font" style={{ marginBottom: '30px', marginLeft: '35px' }}>
                                <img src="/test_imgs/png/bag.png" style={{ width: '55px', marginRight: '15px' }} />
                                <div style={{ fontSize: '40px', marginRight: '15px' }}>쇼핑하기</div>
                                <div
                                    style={{
                                        fontSize: '20px',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        marginBottom: '10px',
                                    }}
                                >
                                    &#62;&nbsp;제품 상세
                                </div>
                            </div>
                            <div className="co-buying_detail_main_img">
                                <img
                                    className="co-buying_detail_main_img"
                                    src={detailCobuy.cobuyImg ? detailCobuy.cobuyImg.split(',')[0] : ''}
                                    alt=""
                                />
                            </div>
                            <hr />
                            <div className="co-buying_detail_sub_section">
                                <div className="detail_sub_section_wrapper">
                                    <div className="detail_sub_section_title">
                                        <hr />
                                        <p className="bold">상세 설명 및 이미지</p>
                                    </div>
                                    <div className="deatil_sub_section_first_img">
                                        {detailCobuy.cobuyName ? (
                                            detailCobuy.cobuyImg.split(',').slice(1).length > 0 ? (
                                                detailCobuy.cobuyImg
                                                    .split(',')
                                                    .slice(1)
                                                    .map((image, index) => (
                                                        <img key={index} src={image} alt={`Image ${index + 1}`} />
                                                    ))
                                            ) : (
                                                <p>첨부된 이미지가 없습니다</p>
                                            )
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="boarder_line" style={{ marginTop: '80px' }}></div>
                        <div className="co-buying_detail_right_section" style={{ marginTop: '80px' }}>
                            <div className="co-buying_detail_right_container">
                                <div className="co-buying_category_container">
                                    <div className="co-buying_category_name_container">
                                        <a
                                            className="co-buying_category_link yg_font none_deco_link"
                                            style={{ fontSize: '1.1em' }}
                                        >
                                            <span>{detailCobuy.cobuyName ? detailCobuy.cobuyName : ''}</span>
                                        </a>
                                        <br />
                                        <br />
                                        <span style={{ fontSize: '1.1em' }}>
                                            가격 : {detailCobuy.cobuyPrice ? detailCobuy.cobuyPrice : ''} 원
                                        </span>
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
                                        {detailCobuy.cobuyContent ? detailCobuy.cobuyContent : ''}
                                    </p>
                                </div>
                                <div className="co-buying_funding_info_container">
                                    <div className="co-buying_participants_remainingsdays_container flex">
                                        <div className="co-buying_participants_wrapper" style={{ fontSize: '1.1em' }}>
                                            {typeof detailCobuy.cobuyAccumulate === 'number' &&
                                            typeof detailCobuy.cobuyMin === 'number' ? (
                                                <span
                                                    className="yg_font"
                                                    style={{ fontSize: '1.3em', marginRight: '5px' }}
                                                >
                                                    {detailCobuy.cobuyAccumulate} / {detailCobuy.cobuyMin}
                                                </span>
                                            ) : null}
                                            <span>명 참여</span>
                                            &nbsp;
                                        </div>
                                    </div>
                                    <div>
                                        <span className="co-buying_remainingsdays_wrapper">
                                            {detailCobuy.cobuyStart && detailCobuy.cobuyEnd ? (
                                                <span>
                                                    <CountdownTimer detailCobuy={detailCobuy} />{' '}
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </span>
                                    </div>
                                    <div className="co-buying_funding_money_wrapper" style={{ fontSize: '1.1em' }}>
                                        <p className="co-buying_funding_money">
                                            {typeof detailCobuy.cobuyAccumulate === 'number' &&
                                            !isNaN(parseInt(detailCobuy.cobuyPrice)) ? (
                                                <span
                                                    className="yg_font"
                                                    style={{ fontSize: '1.5em', marginRight: '5px' }}
                                                >
                                                    {detailCobuy.cobuyAccumulate * parseInt(detailCobuy.cobuyPrice) ||
                                                        0}
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
                                                    (detailCobuy.cobuyAccumulate / detailCobuy.cobuyMin) * 100
                                                }%`,
                                            }}
                                        >
                                            <div className="progress"></div>
                                        </div>
                                    </div>
                                    <div className="co-buying_funding_text">
                                        <b className="co-buying_funding_rate">
                                            {typeof detailCobuy.cobuyMin === 'number' &&
                                            typeof detailCobuy.cobuyAccumulate === 'number'
                                                ? `${(
                                                      (detailCobuy.cobuyAccumulate / detailCobuy.cobuyMin) *
                                                      100
                                                  ).toFixed(2)} %`
                                                : ''}
                                        </b>
                                        <span>달성됨</span>
                                    </div>
                                </div>
                            </div>
                            {fundingText !== '펀딩 마감' && (
                                <div className="co-buying_options_container">
                                    <div className="co-buygin_options_wrapper">
                                        <div className="co-buying_options_text mt-2">옵션 선택</div>
                                        <div className="co-buyging_options_wrapper mt-1">
                                            <select
                                                class=" form-select form-select-sm"
                                                aria-label="Small select example"
                                                onChange={handleOptionChange}
                                                value={selectedOption}
                                            >
                                                <option value="">-- 선택 --</option>
                                                {detailCobuy.cobuyOption1 && (
                                                    <option value={detailCobuy.cobuyOption1}>
                                                        {detailCobuy.cobuyOption1}
                                                    </option>
                                                )}
                                                {detailCobuy.cobuyOption2 && (
                                                    <option value={detailCobuy.cobuyOption2}>
                                                        {detailCobuy.cobuyOption2}
                                                    </option>
                                                )}
                                                {detailCobuy.cobuyOption3 && (
                                                    <option value={detailCobuy.cobuyOption3}>
                                                        {detailCobuy.cobuyOption3}
                                                    </option>
                                                )}
                                                {detailCobuy.cobuyOption4 && (
                                                    <option value={detailCobuy.cobuyOption4}>
                                                        {detailCobuy.cobuyOption4}
                                                    </option>
                                                )}
                                                {detailCobuy.cobuyOption5 && (
                                                    <option value={detailCobuy.cobuyOption5}>
                                                        {detailCobuy.cobuyOption5}
                                                    </option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="co-buying_buttons_container">
                                <div className="co-buying_buttons_wrapper flex" style={{ justifyContent: 'center' }}>
                                    <div className="like_button_wrapper">
                                        <div
                                            className="like_button"
                                            style={{ textAlign: 'center', position: 'relative' }}
                                        >
                                            <label htmlFor="checkbox" className="like_box">
                                                <input
                                                    type="checkbox"
                                                    id="checkbox"
                                                    hidden
                                                    defaultChecked={isChecked}
                                                    onClick={hitHandler}
                                                />
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
                                            <div className="likes_count" style={{ textAlign: 'center' }}>
                                                <label
                                                    htmlFor="checkbox"
                                                    className={isChecked ? '' : 'selected_heart'}
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
                                                        {typeof detailCobuy.cobuyHit === 'number'
                                                            ? detailCobuy.cobuyHit.toLocaleString()
                                                            : '0'}
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="co-buying_botton_wrpper">
                                        <div className="buying_button" onClick={userFundingHandler}>
                                            <p className="yg_font">{fundingText}</p>
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

export default CoBuyingDetail;
