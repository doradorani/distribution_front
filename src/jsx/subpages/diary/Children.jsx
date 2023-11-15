import React, { useState } from 'react';
import '../../../css/subpage/children.css';
import ReactDatePicker from 'react-datepicker';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { userStateAction } from '../../../js/api/redux_store/slice/userLoginSlice';
import DiaryHeader from './DiaryHeader';
import ScrollToTop from '../../ScrollToTop';

const Children = ({ adContents, validationUser, setIsLoading, isLoading }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [name, setName] = useState();
    const [img, setImg] = useState(null);
    const [childContent, setChildContent] = useState(null);
    const userLoginDispatch = useDispatch();
    const nav = useNavigate();

    useEffect(() => {
        const getDiary = async () => {
            try {
                const validateResponse = validationUser('post', '/user/validate');
            } catch (error) {
                console.log(error);
                userLoginDispatch(userStateAction.setState(false));
            } finally {
                setIsLoading(false);
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
                if (name == null) {
                    Swal.fire({
                        icon: 'warning',
                        title: '이름을 입력해주세요!',
                        confirmButtonText: '확인',
                    });
                } else if (img == null) {
                    Swal.fire({
                        icon: 'warning',
                        title: '사진을 넣어주세요!',
                        confirmButtonText: '확인',
                    });
                } else {
                    let formData = new FormData();
                    let data = {
                        name: name,
                        birth_date:
                            selectedDate.getFullYear() +
                            '-' +
                            (selectedDate.getMonth() + 1) +
                            '-' +
                            selectedDate.getDate(),
                        content: childContent,
                    };
                    formData.append('file', img);
                    formData.append(
                        'data',
                        new Blob([JSON.stringify(data)], {
                            type: 'application/json',
                        })
                    );
                    try {
                        validationUser('post', '/diary/childInfo', formData).then((res) => {
                            if (res != undefined && res.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: '정상적으로 등록되었습니다.',
                                    text: '*^^*',
                                    confirmButtonText: '확인',
                                }).then((res) => {
                                    if (res.isConfirmed) {
                                        nav('/diary');
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
                                        nav('/diary');
                                    }
                                });
                            }
                        });
                        setIsLoading(true);
                    } catch (error) {
                        console.log('데이터 파싱 에러');
                        console.log(error);
                        userLoginDispatch(userStateAction.setState(false));
                    }
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
                        <DiaryHeader select={'우리 아이 등록'} src={'/test_imgs/png/diary3.png'} />
                    </div>
                    <div>
                        <div
                            className="yg_font"
                            style={{ textAlign: 'right', marginBottom: '20px', marginRight: '10px', cursor: 'pointer' }}
                            onClick={clickHandler}
                        >
                            &#60;&nbsp;뒤로가기
                        </div>
                        <div className="children_wrap">
                            <div className="children_container">
                                <div className="children_header">
                                    <div className="children_header_title bold">우리 아이 등록</div>
                                </div>
                                <hr style={{ margin: '25px 0 10px 0', width: '100%' }} />
                                <div className="children_second_wrap flex">
                                    <div className="children_input flex">
                                        <div className="children_input_name">
                                            <span>이름 &nbsp;</span>
                                            <input
                                                type="text"
                                                onChange={(e) => setName(e.target.value)}
                                                style={{
                                                    border: 'none',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '5px',
                                                }}
                                            />
                                        </div>
                                        <div className="children_select_birth">
                                            <span className="children_select_title">생년월일 &nbsp;</span>
                                            <ReactDatePicker
                                                dateFormat="yyyy.MM.dd"
                                                shouldCloseOnSelect
                                                // minDate={new Date()}
                                                selected={selectedDate}
                                                onChange={(date) => setSelectedDate(date)}
                                            />
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="children_input_name flex" style={{ margin: ' 0 62px' }}>
                                            <div style={{ height: '200px' }}>설명 &nbsp;</div>
                                            <textarea
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

export default Children;
