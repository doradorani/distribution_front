import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/subpage/cobuyinglist.css';
import SideMenu from '../SideMenu';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useValidationAdminItem } from '../../../js/api/admin/ValidationAdminItem';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { userStateAction } from '../../../js/api/redux_store/slice/userLoginSlice';
import token_config from '../../../js/api/config/token_config';

const CoBuyingProceed = () => {
    const { status } = useParams(); //ing, going, end

    const server = token_config.server;

    const [cobuyList, setCobyuList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [listCnt, setListCnt] = useState(0);
    const [perPage] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [optionList, setOptionList] = useState('hit');

    // 페이지네이션을 10개씩 보이도록 수정
    const itemsPerPage = 10;
    const startPage = Math.floor((currentPage - 1) / itemsPerPage) * itemsPerPage + 1;
    const endPage = Math.min(startPage + itemsPerPage - 1, totalPages);

    const loginDispatch = useDispatch();

    useEffect(() => {
        const listProduct = async () => {
            try {
                console.log(status);
                const validateListResponse = await axios.get(
                    `${server}/coBuy/list/` + status + '/' + optionList + '/' + currentPage + '/' + perPage
                );

                setCobyuList(validateListResponse.data.data.coBuyProductDtos);
                setTotalPages(validateListResponse.data.data.totalPages);
                setListCnt(validateListResponse.data.data.productListCnt);
                setIsLoading(true);
            } catch (error) {
                console.error('Error Message:', error.message);
                console.error('Status Code:', error.response.status);
                loginDispatch(userStateAction.setState(false));
            } finally {
                setIsLoading(false);
            }
        };
        listProduct();
    }, [status, currentPage, optionList]);

    const cobuyPageHandler = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const listOptionHandler = (option) => {
        setOptionList(option);
    };

    return (
        <>
            <div className='co-buying_list_wrap'>
                <div className='co-buying_list_second_wrap'>
                    <div className='product_list'>
                        <div className='product_filter_container'>
                            {/* <div className="order_select_container yg_font"> */}
                            <div className=' flex yg_font' style={{ marginBottom: '30px' }}>
                                <img src='/test_imgs/png/bag.png' style={{ width: '55px', marginRight: '15px' }} />
                                <div style={{ fontSize: '40px', marginRight: '15px' }}>쇼핑하기</div>
                                <div
                                    style={{
                                        fontSize: '20px',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        marginBottom: '10px',
                                    }}
                                >
                                    &#62;&nbsp;
                                    {status === 'ing'
                                        ? '진행 중인 상품'
                                        : status === 'going'
                                        ? '진행 예정 상품'
                                        : status === 'end'
                                        ? '진행 종료 상품'
                                        : '전체 상품'}
                                </div>
                            </div>
                            {/* <select className="order_select_selectbox">
                                <option value="">전체</option>
                                <option value="N">진행중</option>
                                <option value="Y">종료된</option>
                            </select> */}
                            {/* </div> */}
                            {/* <ul className='order_select_option_contianer'>
                                <li className='order_select_option bold'>추천순</li>
                                <li className='order_select_option'>인기순</li>
                                <li className='order_select_option'>모집금액순</li>
                                <li className='order_select_option'>마감임박순</li>
                                <li className='order_select_option'>최신순</li>
                            </ul> */}
                            {/*  */}
                            <ul className='order_select_option_contianer'>
                                <li
                                    className={`order_select_option ${optionList === 'hit' ? 'bold' : ''}`}
                                    onClick={() => listOptionHandler('hit')}
                                >
                                    추천순
                                </li>
                                <li
                                    className={`order_select_option ${optionList === 'name' ? 'bold' : ''}`}
                                    onClick={() => listOptionHandler('name')}
                                >
                                    이름순
                                </li>
                                <li
                                    className={`order_select_option ${optionList === 'reg_date' ? 'bold' : ''}`}
                                    onClick={() => listOptionHandler('reg_date')}
                                >
                                    최신순
                                </li>
                            </ul>
                        </div>
                        {/* <div className='product_wrap_row'>
                            <div className='product_wrap_row'>
                                {cobuyList.length === 0 ? (
                                    <p>상품이 없습니다</p>
                                ) : (
                                    cobuyList.map((item, index) => <ProductCard key={index} productData={item} />)
                                )}
                            </div>
                        </div> */}
                        <div className={cobuyList.length === 0 ? '' : 'product_wrap_row'}>
                            {cobuyList.length === 0 ? (
                                <p style={{ textAlign: 'center', fontSize: '24px' }}>상품이 없습니다</p>
                            ) : (
                                cobuyList.map((item, index) => <ProductCard key={index} productData={item} />)
                            )}
                        </div>

                        <div aria-label='Page navigation example' style={{ marginTop: '10px' }}>
                            <ul className='pagination justify-content-center'>
                                <li className='page-item'>
                                    <button
                                        className='page-link pagination_btn'
                                        aria-label='Previous'
                                        onClick={() => {
                                            if (startPage === 1) {
                                                cobuyPageHandler(1);
                                            } else {
                                                cobuyPageHandler(startPage - 1);
                                            }
                                        }}
                                    >
                                        <span aria-hidden='true'>&laquo;</span>
                                    </button>
                                </li>
                                {isLoading ? (
                                    <div></div>
                                ) : (
                                    Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                                        <li
                                            className={`page-item ${startPage + i === currentPage ? 'active' : ''}`}
                                            key={startPage + i}
                                        >
                                            <button
                                                className='page-link pagination_btn'
                                                onClick={() => cobuyPageHandler(startPage + i)}
                                            >
                                                {startPage + i}
                                            </button>
                                        </li>
                                    ))
                                )}
                                <li className='page-item'>
                                    <button
                                        className='page-link '
                                        aria-label='Next'
                                        onClick={() => cobuyPageHandler(endPage + 1)}
                                    >
                                        <span aria-hidden='true'>&raquo;</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CoBuyingProceed;
