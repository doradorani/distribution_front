import React, { useEffect, useState } from 'react';
import DiaryHeader from './DiaryHeader';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userStateAction } from '../../../js/api/redux_store/slice/userLoginSlice';
import '../../../css/subpage/diaryBook.css';
import Swal from 'sweetalert2';

const DiaryBook = ({ adContents, isLoading, setIsLoading, validationUser }) => {
    const [childBookData, setChildBookData] = useState(null);
    const userLoginDispatch = useDispatch();

    useEffect(() => {
        const getDiary = async () => {
            try {
                const validateResponse = validationUser('post', '/user/validate');
                try {
                    validationUser('get', '/diary/childrenInfo').then((res) => {
                        if (res != undefined && res.success) {
                            setChildBookData(res.data);
                        }
                    });
                    setIsLoading(true);
                } catch (error) {
                    console.log('데이터 파싱 에러');
                    console.log(error);
                }
            } catch (error) {
                console.log(error);
                userLoginDispatch(userStateAction.setState(false));
            } finally {
                setIsLoading(false);
            }
        };
        getDiary();
    }, []);

    const clickDeleteHandler = (no) => {
        Swal.fire({
            icon: 'warning',
            title: '정말 삭제 하시겠습니까?',
            text: '삭제 하시게 되면 새로 등록해야합니다.',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then((res) => {
            if (res.isConfirmed) {
                try {
                    validationUser('delete', '/diary/childBook/' + no, null, '/diary/childrenInfo').then((res) => {
                        if (res != undefined && res.success) {
                            setChildBookData(res.data);
                        }
                    });
                    setIsLoading(true);
                } catch (error) {
                    console.log(error);
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    return (
        <>
            <div className="post_full_section">
                <div className="post_section">
                    <div style={{ paddingLeft: '1.7%' }}>
                        <DiaryHeader select={'일기'} src={'/test_imgs/png/diary3.png'} />
                    </div>
                    <div>
                        <div className="go_to_add_child">
                            <Link to="/diary/register_child">
                                <input
                                    type="button"
                                    value="아이 등록"
                                    className="btn btn-primary child_register_btn"
                                    style={{ color: '#fff', backgroundColor: '#ff4898', border: ' 1px solid #ff4898' }}
                                />
                            </Link>
                        </div>
                    </div>
                    <div>
                        {isLoading ? (
                            <div>로딩중.....</div>
                        ) : childBookData != null && childBookData == 0 ? (
                            <div
                                className="yg_font"
                                style={{
                                    fontSize: '1.6rem',
                                    textAlign: 'center',
                                    height: '500px',
                                    lineHeight: '500px',
                                }}
                            >
                                아이를 등록해주세요
                            </div>
                        ) : (
                            (childBookData !== null && Array.isArray(childBookData) ? childBookData : []).map((idx) => {
                                const goToUrl = '/diary/diary_book_detail/' + idx.no;
                                const modifyUrl = '/diary/modify_child_info/' + idx.no;
                                return (
                                    <div className="component yg_font" key={idx}>
                                        <ul className="align book_ul">
                                            <li>
                                                <figure className="book">
                                                    <ul className="hardcover_front book_ul">
                                                        <li></li>
                                                        <li>
                                                            <img src={idx.img} alt="" width="100%" height="100%" />
                                                        </li>
                                                    </ul>
                                                    <ul className="page book_ul">
                                                        <li></li>
                                                        <li>
                                                            <ul className="flex diarybook_btn_container">
                                                                <li>
                                                                    <Link className="diarybook_btn" to={goToUrl}>
                                                                        보러가기
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <div className="diarybook_modify_btn_container">
                                                                        <Link className="diarybook_btn" to={modifyUrl}>
                                                                            수정하기
                                                                        </Link>
                                                                        <Link
                                                                            className="diarybook_btn"
                                                                            onClick={() => clickDeleteHandler(idx.no)}
                                                                        >
                                                                            삭제하기
                                                                        </Link>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                    <ul className="hardcover_back book_ul">
                                                        <li></li>
                                                        <li></li>
                                                    </ul>
                                                    <ul className="book_spine book_ul">
                                                        <li></li>
                                                        <li></li>
                                                    </ul>
                                                    <figcaption>
                                                        <h2>{idx.name} 육아일기</h2>
                                                        <span>생일 : {idx.birth_date}</span>
                                                        <p>{idx.content}</p>
                                                    </figcaption>
                                                </figure>
                                            </li>
                                        </ul>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            {adContents}
        </>
    );
};

export default DiaryBook;
