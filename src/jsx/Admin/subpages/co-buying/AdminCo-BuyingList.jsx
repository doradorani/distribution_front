import React, { useEffect, useState } from 'react';
import AdminProductCard from './AdminProductCard';
import { useValidationAdminItem } from '../../../../js/api/admin/ValidationAdminItem';
import { useDispatch } from 'react-redux';
import { adminStateAction } from '../../../../js/api/redux_store/slice/adminLoginSlice';

const AdminCoBuyingList = ({ setSelectedSideMenu }) => {
    const validateListProductAdmin = useValidationAdminItem();
    const [cobuyList, setCobyuList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [listCnt, setListCnt] = useState(0);
    const [perPage] = useState(6);
    const [optionList, setOptionList] = useState('reg_date');
    const [isLoading, setIsLoading] = useState(false);

    // 페이지네이션을 10개씩 보이도록 수정
    const itemsPerPage = 10;
    const startPage = Math.floor((currentPage - 1) / itemsPerPage) * itemsPerPage + 1;
    const endPage = Math.min(startPage + itemsPerPage - 1, totalPages);

    const adminLoginDispatch = useDispatch();

    useEffect(() => {
        const listProduct = async () => {
            try {
                const validateListResponse = await validateListProductAdmin(
                    'get',
                    '/coBuy/list/' + optionList + '/' + currentPage + '/' + perPage
                );

                setCobyuList(validateListResponse.data.coBuyProductDtos);
                setTotalPages(validateListResponse.data.totalPages);
                setListCnt(validateListResponse.data.productListCnt);
                setIsLoading(true);
            } catch (error) {
                console.error('Error Message:', error.message);
                console.error('Status Code:', error.response.status);
                adminLoginDispatch(adminStateAction.setAdminState(false));
            } finally {
                setIsLoading(false);
            }
        };
        listProduct();
    }, [currentPage]);

    const cobuyPageHandler = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="flex nn_font">
            <div className="admin_co-buying_wrap" style={{ margin: '10px auto ' }}>
                <div className="admin_co-buying_second_wrap">
                    <div className="co-buying_list_wrap">
                        <div className="co-buying_list_second_wrap">
                            <div className="product_list">
                                <div
                                    className="product_filter_container flex"
                                    style={{ justifyContent: 'space-between', marginLeft: '10px' }}
                                >
                                    <div className=" flex yg_font" style={{ marginBottom: '30px' }}>
                                        <img
                                            src="/test_imgs/svg/shopping_cart.svg"
                                            style={{ width: '55px', marginRight: '15px' }}
                                        />
                                        <div style={{ fontSize: '40px', marginRight: '15px' }}>공동 구매</div>
                                        <div
                                            style={{
                                                fontSize: '20px',
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            {/* &#62;&nbsp;진행 중인 상품 */}
                                        </div>
                                    </div>
                                    {/* <div style={{ position: 'relative' }}>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                border: '#dadada',
                                                width: '180px',
                                                height: '35px',
                                                right: '25px',
                                                borderRadius: '40px',
                                            }}
                                        >
                                            <input
                                                className="shopping_search_bar"
                                                type="text"
                                                placeholder="검색어 입력"
                                                style={{
                                                    border: 'none',
                                                    width: '130px',
                                                    height: '32px',
                                                    marginLeft: '12px',
                                                    position: 'absolute',
                                                    top: '1px',
                                                    right: '35px',
                                                }}
                                            ></input>
                                            <button
                                                style={{
                                                    backgroundColor: '#fff',
                                                    border: 'none',
                                                    borderRadius: '100%',
                                                    width: '30px',
                                                    height: '30px',
                                                    position: 'absolute',
                                                    right: '1px',
                                                    top: '1.5px',
                                                }}
                                            >
                                                <img
                                                    src="/test_imgs/svg/search.svg"
                                                    style={{ width: '30px', height: '30px' }}
                                                />
                                            </button>
                                        </div>
                                        <ul
                                            className="order_select_option_contianer"
                                            style={{ position: 'relative', top: '40px' }}
                                        >
                                            <li className="order_select_option bold">추천순</li>
                                            <li className="order_select_option">인기순</li>
                                            <li className="order_select_option">모집금액순</li>
                                            <li className="order_select_option">마감임박순</li>
                                            <li className="order_select_option">최신순</li>
                                        </ul>
                                    </div> */}
                                </div>
                                <div className={cobuyList.length === 0 ? '' : 'product_wrap_row'}>
                                    {cobuyList.length === 0 ? (
                                        <p style={{ textAlign: 'center', fontSize: '24px' }}>상품이 없습니다</p>
                                    ) : (
                                        cobuyList.map((item, index) => (
                                            <AdminProductCard key={index} productData={item} />
                                        ))
                                    )}
                                </div>
                                {/* 
                                <div className='product_wrap_row'>
                                    {cobuyList &&
                                        cobuyList.map((item, index) => (
                                            <AdminProductCard key={index} productData={item} />
                                        ))}
                                </div> */}

                                <div aria-label="Page navigation example" style={{ marginTop: '10px' }}>
                                    <ul className="pagination justify-content-center">
                                        <li className="page-item">
                                            <button
                                                className="page-link pagination_btn"
                                                aria-label="Previous"
                                                onClick={() => {
                                                    if (startPage === 1) {
                                                        cobuyPageHandler(1);
                                                    } else {
                                                        cobuyPageHandler(startPage - 1);
                                                    }
                                                }}
                                            >
                                                <span aria-hidden="true">&laquo;</span>
                                            </button>
                                        </li>
                                        {isLoading ? (
                                            <div></div>
                                        ) : (
                                            Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                                                <li
                                                    className={`page-item ${
                                                        startPage + i === currentPage ? 'active' : ''
                                                    }`}
                                                    key={startPage + i}
                                                >
                                                    <button
                                                        className="page-link pagination_btn"
                                                        onClick={() => cobuyPageHandler(startPage + i)}
                                                    >
                                                        {startPage + i}
                                                    </button>
                                                </li>
                                            ))
                                        )}
                                        <li className="page-item">
                                            <button
                                                className="page-link "
                                                aria-label="Next"
                                                onClick={() => cobuyPageHandler(endPage + 1)}
                                            >
                                                <span aria-hidden="true">&raquo;</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCoBuyingList;
