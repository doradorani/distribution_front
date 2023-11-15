import React, { useEffect, useState } from 'react';
import '../../../css/subpage/children.css';
import ReactDatePicker from 'react-datepicker';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userStateAction } from '../../../js/api/redux_store/slice/userLoginSlice';
import DiaryHeader from './DiaryHeader';
import Swal from 'sweetalert2';

const DiaryPost = ({ adContents, validationUser }) => {
    const params = useParams();
    const nav = useNavigate();
    const userLoginDispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [title, setTitle] = useState('');
    const [img, setImg] = useState(null);
    const [childContent, setChildContent] = useState(null);
    const [checkbox, setCheckbok] = useState(0);

    const likeHandler = () => {
        if (checkbox == 0) {
            setCheckbok(1);
        } else {
            setCheckbok(0);
        }
    };

    useEffect(() => {
        const getDiary = async () => {
            try {
                const validateResponse = validationUser('post', '/user/validate');
            } catch (error) {
                console.log(error);
                userLoginDispatch(userStateAction.setState(false));
            }
        };
        getDiary();
    }, []);

    const clickHandler = () => {
        nav(-1);
    };

    const handleSubmit = async (event) => {
        Swal.fire({
            icon: 'question',
            title: '등록하시겠습니까?',
            text: '확인을 누르시면 등록됩니다.',
            confirmButtonText: '확인',
        }).then((res) => {
            if (res.isConfirmed) {
                let formData = new FormData();
                let data = {
                    title: title,
                    birth_date:
                        selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate(),
                    content: childContent,
                    fourcuts_checked: checkbox,
                    cd_no: params.childNo,
                };
                formData.append('file', img);
                formData.append(
                    'data',
                    new Blob([JSON.stringify(data)], {
                        type: 'application/json',
                    })
                );
                try {
                    validationUser('post', '/diary/dailyDiary/' + params.childNo, formData).then((res) => {
                        if (res != undefined && res.success) {
                            Swal.fire({
                                icon: 'success',
                                title: '정상적으로 등록되었습니다.',
                                text: '*^^*',
                                confirmButtonText: '확인',
                            }).then((res) => {
                                if (res.isConfirmed) {
                                    nav('/diary/diary_book_detail/' + params.childNo);
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: '정상적으로 등록되지 않았습니다.',
                                text: '다시 시도해주세요',
                                confirmButtonText: '확인',
                            }).then((res) => {
                                if (res.isConfirmed) {
                                    nav('/diary/diary_book_detail/' + params.childNo);
                                }
                            });
                        }
                    });
                } catch (error) {
                    console.log('데이터 파싱 에러');
                    console.log(error);
                    userLoginDispatch(userStateAction.setState(false));
                }
            }
        });
    };

    const handleChange = (e) => {
        setImg(e[0]);
    };

    return (
        <>
            <div className="post_full_section">
                <div className="post_section">
                    <div style={{ paddingLeft: '1.7%' }}>
                        <DiaryHeader select={'일기'} src={'/test_imgs/png/diary3.png'} />
                    </div>
                    <div className="add_diary_container">
                        <div
                            className="yg_font"
                            style={{ textAlign: 'right', marginBottom: '20px', marginRight: '10px', cursor: 'pointer' }}
                            onClick={clickHandler}
                        >
                            &#60;&nbsp;뒤로가기
                        </div>
                        <div className="children_wrap">
                            <div className="children_container">
                                <div className="children_header flex">
                                    <div className="children_header_title bold" style={{ paddingLeft: '95px' }}>
                                        오늘의 일기 작성
                                    </div>
                                    <div
                                        className="like_button diary_like"
                                        style={{ textAlign: 'center', border: 'none', width: '150px' }}
                                    >
                                        <label htmlFor="checkbox" className="like_box">
                                            <input type="checkbox" id="checkbox" hidden onClick={likeHandler} />
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

                                        <div className="yg_font">인생 네컷</div>
                                    </div>
                                </div>
                                <hr style={{ margin: '10px 0', width: '100%' }} />
                                <div className="children_second_wrap flex">
                                    <div className="children_input flex">
                                        <div className="children_input_name">
                                            <span>제목 &nbsp;</span>
                                            <input
                                                type="text"
                                                onChange={(e) => setTitle(e.target.value)}
                                                style={{
                                                    border: 'none',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '5px',
                                                }}
                                            />
                                        </div>
                                        <div className="children_select_birth">
                                            <span className="children_select_title">날짜 &nbsp;</span>
                                            <ReactDatePicker
                                                dateFormat="yyyy.MM.dd"
                                                shouldCloseOnSelect
                                                selected={selectedDate}
                                                onChange={(date) => setSelectedDate(date)}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="children_input_name flex" style={{ margin: ' 0 71px' }}>
                                            <span style={{ marginRight: '5px' }}>내용&nbsp;</span>
                                            <input
                                                type="text"
                                                onChange={(e) => setChildContent(e.target.value)}
                                                style={{
                                                    width: '500px',
                                                    minHeight: '200px',
                                                    border: 'none',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '5px',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="flex"
                                        style={{ justifyContent: 'space-between', marginTop: '25px' }}
                                    >
                                        <div
                                            className="children_input_image"
                                            style={{ marginLeft: '32px', marginBottom: '15px' }}
                                        >
                                            <label
                                                htmlFor="children_input_image"
                                                style={{
                                                    backgroundColor: '#ff4898',
                                                    border: '1px solid #ff4898',
                                                    borderRadius: '5px',
                                                    color: '#fff',
                                                    padding: '8px',
                                                }}
                                            >
                                                아이 사진 등록
                                            </label>
                                            <input
                                                type="file"
                                                name="아이 사진"
                                                id="children_input_image"
                                                accept="image/png, image/jpeg, image/jpg"
                                                encType="multipart/form-data"
                                                onChange={(e) => handleChange(e.target.files)}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                        <div className="children_submit_button">
                                            <div>
                                                <input
                                                    type="submit"
                                                    value={'등록'}
                                                    className="btn btn-primary"
                                                    onClick={handleSubmit}
                                                    style={{ backgroundColor: '#ff4898', border: '1px solid #ff4898' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {adContents}
        </>
    );
};

export default DiaryPost;
