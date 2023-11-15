import React, { useState } from 'react';
import '../../../css/subpage/children.css';
import ReactDatePicker from 'react-datepicker';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import ScrollToTop from '../../ScrollToTop';
import DiaryHeader from './DiaryHeader';
import { userStateAction } from '../../../js/api/redux_store/slice/userLoginSlice';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

const ChildrenModifyInfo = ({ adContents, validationUser, setIsLoading, isLoading }) => {
    const params = useParams();
    const nav = useNavigate();
    const userLoginDispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(null);
    const [childname, setchildName] = useState('');
    const [childImg, setChildImg] = useState(null);
    const [childContent, setChildContent] = useState(null);
    const [childModifyInfo, setChildModifyInfo] = useState(null);

    useEffect(() => {
        const getDiary = async () => {
            try {
                const validateResponse = validationUser('post', '/user/validate');
                try {
                    validationUser('get', '/diary/childrenDetail/' + params.childNo).then((res) => {
                        if (res != undefined && res.success) {
                            setChildModifyInfo(res.data);
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

    const clickHandler = () => {
        nav(-1);
    };

    const handleSubmit = async (event) => {
        let formData = new FormData();
        let data = {};
        Swal.fire({
            icon: 'question',
            title: '수정하시겠습니까?',
            text: '확인을 누르시면 수정됩니다.',
            confirmButtonText: '확인',
        }).then((res) => {
            if (res.isConfirmed) {
                if (childname == '') {
                    data['name'] = childModifyInfo.name;
                } else {
                    data['name'] = childname;
                }
                if (selectedDate == null) {
                    data['birth_date'] = childModifyInfo.birth_date;
                } else {
                    data['birth_date'] =
                        selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate();
                }
                if (childContent == null) {
                    data['content'] = childModifyInfo.content;
                } else {
                    data['content'] = childContent;
                }
                if (childImg != null) {
                    formData.append('file', childImg);
                }
                formData.append(
                    'data',
                    new Blob([JSON.stringify(data)], {
                        type: 'application/json',
                    })
                );
                try {
                    validationUser('post', '/diary/childInfo/' + params.childNo, formData).then((res) => {
                        if (res != undefined && res.success) {
                            setChildModifyInfo(res.data);
                            Swal.fire({
                                icon: 'success',
                                title: '정상적으로 수정되었습니다.',
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
                                title: '정상적으로 수정되지 않았습니다.',
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
        });
    };

    const handleChange = (e) => {
        setChildImg(e[0]);
    };

    return (
        <>
            <div className="post_full_section">
                <div className="post_section">
                    <div style={{ paddingLeft: '1.7%' }}>
                        <DiaryHeader select={'일기'} src={'/test_imgs/png/diary3.png'} />
                    </div>
                    <div
                        className="yg_font"
                        style={{ textAlign: 'right', marginBottom: '20px', marginRight: '10px', cursor: 'pointer' }}
                        onClick={clickHandler}
                    >
                        &#60;&nbsp;뒤로가기
                    </div>
                    {isLoading ? (
                        <div>로딩중</div>
                    ) : (
                        childModifyInfo != null && (
                            <div className="children_wrap">
                                <div className="children_container">
                                    <div className="children_header">
                                        <div className="children_header_title bold">우리 아이 수정</div>
                                    </div>
                                    <hr style={{ margin: '25px 0 10px 0', width: '100%' }} />
                                    <div className="children_second_wrap flex">
                                        <div className="children_input flex">
                                            <div className="children_input_name">
                                                <span>이름 &nbsp;</span>
                                                <input
                                                    type="text"
                                                    onChange={(e) => setchildName(e.target.value)}
                                                    defaultValue={childModifyInfo.name}
                                                    style={{
                                                        border: 'none',
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '5px',
                                                    }}
                                                />
                                            </div>
                                            <div className="children_select_birth">
                                                <span className="children_select_title">생년월일 &nbsp;</span>
                                                {childModifyInfo.birth_date && (
                                                    <ReactDatePicker
                                                        dateFormat="yyyy.MM.dd"
                                                        shouldCloseOnSelect
                                                        selected={new Date(childModifyInfo.birth_date)}
                                                        onChange={(date) => setSelectedDate(date)}
                                                    />
                                                )}
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
                                                    defaultValue={childModifyInfo.content}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="children_submit_button"
                                            style={{ marginTop: '30px', marginRight: '20px' }}
                                        >
                                            <div>
                                                <input
                                                    type="submit"
                                                    value={'수정'}
                                                    className="btn btn-primary"
                                                    onClick={handleSubmit}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="children_input_image"
                                            style={{ marginLeft: '32px', marginBottom: '15px' }}
                                        >
                                            {/* <button className="btn btn primary">
                                아이 사진 등록 */}
                                            <input
                                                type="file"
                                                name="아이 사진"
                                                id="children_input_image"
                                                accept="image/png, image/jpeg, image/jpg"
                                                encType="multipart/form-data"
                                                onChange={(e) => handleChange(e.target.files)}
                                            />
                                            {/* </button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            {adContents}
        </>
    );
};

export default ChildrenModifyInfo;
