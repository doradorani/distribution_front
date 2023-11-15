import React, { useEffect, useState } from 'react';
import '../../../css/subpage/cobuyinglist.css';
import SideMenu from '../SideMenu';
import ProductCard from './ProductCard';
import { useDispatch } from 'react-redux';
import { userStateAction } from '../../../js/api/redux_store/slice/userLoginSlice';
import { useValidationItem } from '../../../js/api/VlidationItem';

const CoBuyingHitList = (selectedMenu, setSelectedSideMenu) => {
    const [cobuyList, setCobyuList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [listCnt, setListCnt] = useState(0);
    const [perPage] = useState(6);
    const [isLoading, setIsLoading] = useState(false);

    const validateMyFunding = useValidationItem();

    // 페이지네이션을 10개씩 보이도록 수정
    const itemsPerPage = 10;
    const startPage = Math.floor((currentPage - 1) / itemsPerPage) * itemsPerPage + 1;
    const endPage = Math.min(startPage + itemsPerPage - 1, totalPages);

    const loginDispatch = useDispatch();

    useEffect(() => {
        const listProduct = async () => {
            try {
                validateMyFunding('get', '/coBuy/myHitProduct/' + currentPage + '/' + perPage).then((res) => {
                    if (res.success) {
                        setCobyuList(res.data.myHitProducts);
                        setTotalPages(res.data.totalPages);
                        setListCnt(res.data.productListCnt);
                    }
                });
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
    }, [currentPage]);

    const cobuyPageHandler = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <>
            <div
                className="community_main_img flex"
                style={{ justifyContent: 'space-evenly', backgroundColor: '#DAEEED' }}
            >
                <img className="community_main_img" src="/test_imgs/community_imgs/commu2.jpg" />
                <img className="community_main_img" src="/test_imgs/community_imgs/community_heart.jpg" />
                <img className="community_main_img" src="/test_imgs/community_imgs/community.jpg" />
            </div>
            <div className="community_flex" style={{ height: '110vh' }}>
                <SideMenu selectedMenu={4} setSelectedSideMenu={setSelectedSideMenu} />
                <div className="co-buying_list_second_wrap">
                    <div
                        className="product_list flex"
                        style={{ flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                        <div>
                            <div className="product_filter_container">
                                <div className=" flex yg_font" style={{ marginBottom: '30px' }}>
                                    <img
                                        src="/test_imgs/png/gift.png"
                                        style={{
                                            width: '55px',
                                            height: '55px',
                                            marginRight: '15px',
                                        }}
                                    />
                                    <div style={{ fontSize: '40px', marginRight: '15px' }}>좋아요한 상품</div>
                                </div>
                            </div>
                            <div className={cobuyList.length === 0 ? '' : 'product_wrap_row'}>
                                {cobuyList.length === 0 ? (
                                    <p style={{ textAlign: 'center', fontSize: '24px' }}>상품이 없습니다</p>
                                ) : (
                                    cobuyList.map((item, index) => <ProductCard key={index} productData={item} />)
                                )}
                            </div>
                        </div>
                        <div aria-label="Page navigation example">
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
                                            className={`page-item ${startPage + i === currentPage ? 'active' : ''}`}
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
        </>
    );
};

export default CoBuyingHitList;
