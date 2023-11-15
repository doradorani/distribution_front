import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../css/subpage/community.css';
import SideMenu from './SideMenu';
import CoBuyingList from './co-buying/CoBuyingList';
import MyPosts from './community/MyPosts';
import DetailPost from './community/DetailPost';
import Swal from 'sweetalert2';
import { useValidationItem } from '../../js/api/VlidationItem';
import AllPost from './community/AllPost';
import isUserLogin from '../../js/api/config/userLogin_config';
import { Route, Routes, useNavigate } from 'react-router';
import userInfo_config from '../../js/api/config/userInfo_config';
import CoBuyingProceed from './co-buying/CoBuyingProceed';

const Community = ({ setSelectedSideMenu, previewImage, setPreviewImage }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadText, setUploadText] = useState('');
    const [byteCount, setByteCount] = useState(0);
    const [isUpdate, setIsUpdate] = useState(false);

    let data;
    const user_profile = userInfo_config.userProfile;
    const user_nickname = userInfo_config.userNickname;

    const validationItemForPost = useValidationItem();
    const nav = useNavigate();

    const handleFileChange = (e) => {
        const maxFiles = 5;
        const maxFileSize = 25600000;
        const files = e.target.files;
        const newSelectedFiles = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // 사진 첨부 최대 개수 설정
            if (newSelectedFiles.length >= maxFiles) {
                alert(`사진은 최대 ${maxFiles}개까지 첨부할 수 있습니다.`);
                e.target.value = '';
                setSelectedFiles([]);
                // setFileInfo('');
                setPreviewImage(null);
                return;
            }
            // 사진 첨부 최대 용량 설정
            if (file.size > maxFileSize) {
                alert(`파일 크기는 ${formatBytes(maxFileSize)}를 초과할 수 없습니다.`);
                e.target.value = '';
                setSelectedFiles([]);
                // setFileInfo('');
                setPreviewImage(null);
                return;
            }

            newSelectedFiles.push(file);

            const fileName = file.name;
            const fileSize = formatBytes(file.size);

            // 미리보기 이미지 설정
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        setSelectedFiles(newSelectedFiles);
        // setFileInfo(fileInfoText);
    };

    const handleTextChange = (e) => {
        const text = e.target.value;
        // 함수 호출하여 바이트 수 계산
        fn_checkByte(text);
        setUploadText(text);
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const deleteFiles = () => {
        setSelectedFiles([]);
        document.getElementById('fileInput').value = '';
        // setFileInfo('');
        setPreviewImage(null);
    };

    const deleteAllContent = () => {
        setSelectedFiles([]);
        setUploadText('');
    };

    // 바이트 수 체크 함수
    const fn_checkByte = (text) => {
        const maxByte = 2200;
        let totalByte = 0;
        for (let i = 0; i < text.length; i++) {
            const each_char = text.charAt(i);
            const uni_char = escape(each_char);
            if (uni_char.length > 4) {
                totalByte += 2;
            } else {
                totalByte += 1;
            }
        }
        // 바이트 수 상태 업데이트
        setByteCount(totalByte);
    };

    const removeFile = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    const renderImageInput = () => {
        if (selectedFiles.length === 0) {
            return (
                <label
                    className='upload_img_label flex'
                    htmlFor='fileInput'
                    style={{ alignItems: 'center', flexDirection: 'column' }}
                >
                    <img src='/test_imgs/png/picture.png' className='' width='225px' />
                    <div style={{ marginTop: '10px', fontSize: '1.2em' }}>사진을 선택해주세요</div>
                </label>
            );
        }
        return (
            <div
                id='carouselExample'
                className='carousel slide'
                data-bs-ride='carousel'
                style={{ width: '400px', height: '450px', objectFit: 'cover' }}
            >
                <div className='carousel-inner' style={{ width: '400px', height: '450px', objectFit: 'cover' }}>
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className={`carousel-item ${index === 0 ? 'active' : ''}`}
                            style={{
                                width: '400px',
                                height: '450px',
                                objectFit: 'cover',
                                position: 'relative',
                            }}
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                className='d-block w-100 uploaded_preview_img'
                                alt={`Image ${index + 1}`}
                                style={{
                                    width: '400px',
                                    height: '400px',
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    top: '50px',
                                }}
                            />
                            <button
                                type='button'
                                className='btn btn-outline-secondary remove-file-btn'
                                aria-label='Close'
                                onClick={() => removeFile(index)}
                                style={{
                                    width: '150px',
                                    position: 'absolute',
                                    top: '5px',
                                    right: '125px',
                                }}
                            >
                                해당 사진만 삭제
                            </button>
                        </div>
                    ))}
                </div>
                <a className='carousel-control-prev' href='#carouselExample' role='button' data-bs-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Previous</span>
                </a>
                <a className='carousel-control-next' href='#carouselExample' role='button' data-bs-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Next</span>
                </a>
            </div>
        );
    };

    const checkForPostImg = () => {
        // let formData = new FormData();
        // setIsLoading(true);
        console.log(selectedFiles);
        if (selectedFiles[0] == null) {
            Swal.fire({
                icon: 'warning',
                title: '업로드를 위해 최소 한개의 사진이 필요합니다.',
            });
        }
    };

    const registPost = async () => {
        if (isUserLogin.state === false) {
            Swal.fire({
                icon: 'warning',
                title: '로그인 후 이용가능한 서비스입니다.',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: '확인',
            }).then((result) => {
                nav('/user_login');
            });
        } else {
            let formData = new FormData();
            try {
                // setIsLoading(true);
                console.log(selectedFiles);
                data = {
                    text: uploadText,
                };
                for (let i = 0; i < selectedFiles.length; i++) {
                    formData.append('files', selectedFiles[i]);
                }
                formData.append(
                    'data',
                    new Blob([JSON.stringify(data)], {
                        type: 'application/json',
                    })
                );
                // let entries = formData.entries();
                // for (const pair of entries) {
                //     console.log(pair[0] + ', ' + pair[1]);
                // }

                const registResponse = await validationItemForPost('post', '/community/uploadPost', formData);
                console.log(registResponse);

                if (registResponse.code === 200 && registResponse.data === 1) {
                    Swal.fire({
                        icon: 'success',
                        title: '공지사항이 정상적으로 등록되었습니다.',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '확인',
                    }).then((result) => {
                        setIsUpdate(true);
                        if (window.location.pathname === '/community/my_posts') {
                            nav('/community/my_posts');
                        } else {
                            nav('/community');
                        }
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className='community_wrap'>
            <div
                className='community_main_img flex'
                style={{ justifyContent: 'space-evenly', backgroundColor: '#DAEEED' }}
            >
                <img className='community_main_img' src='/test_imgs/community_imgs/commu2.jpg' />
                <img className='community_main_img' src='/test_imgs/community_imgs/community_heart.jpg' />
                <img className='community_main_img' src='/test_imgs/community_imgs/community.jpg' />
            </div>
            <div className='community_flex'>
                <SideMenu
                    selectedMenu={2}
                    setSelectedSideMenu={setSelectedSideMenu}
                    previewImage={previewImage}
                    setPreviewImage={setPreviewImage}
                    deleteAllContent={deleteAllContent}
                />
                <Routes>
                    <Route path='/*' element={<AllPost isUpdate={isUpdate} setIsUpdate={setIsUpdate} />} />
                    <Route path='/my_posts' element={<MyPosts isUpdate={isUpdate} setIsUpdate={setIsUpdate} />} />
                    <Route path='/detail_post/:postId' element={<DetailPost />} />
                    <Route path='/co_buying_list' element={<CoBuyingList />} />
                    <Route path='/co_buying_proceed/:status' element={<CoBuyingProceed />} />
                </Routes>
                {/* Modal START */}
                <div
                    className='modal fade yg_font'
                    id='modal_for_post_img'
                    tabIndex='-1'
                    aria-labelledby='exampleModalLabel'
                    aria-hidden='true'
                >
                    <div className='modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h1 className='modal-title fs-5' id='exampleModalLabel'>
                                    새 게시물 작성하기
                                </h1>
                                <button
                                    type='button'
                                    className='btn-close'
                                    data-bs-dismiss='modal'
                                    aria-label='Close'
                                    onClick={deleteFiles}
                                ></button>
                            </div>
                            <div
                                className='modal-body mx-auto modap_img_contents'
                                style={{ width: '650px', height: '485px', position: 'relative' }}
                            >
                                {renderImageInput()}
                                <button
                                    type='button'
                                    className='btn-close'
                                    aria-label='Close'
                                    onClick={deleteFiles}
                                    style={{ position: 'absolute', top: '10px', right: '13px' }}
                                ></button>
                                <div className='for_upload_file'>
                                    <input
                                        type='file'
                                        name='files'
                                        id='fileInput'
                                        multiple
                                        style={{ display: 'none' }}
                                        accept='image/*'
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <label
                                    htmlFor='fileInput'
                                    className='upload_img_btn'
                                    style={{ position: 'absolute', bottom: '0px', right: '12px' }}
                                >
                                    <figure className='moving_btn_for_img_wrap' style={{ margin: '5px auto' }}>
                                        <img
                                            className='moving_btn_for_img'
                                            src='/test_imgs/png/upload.png'
                                            style={{ width: '45px' }}
                                        />
                                    </figure>
                                    <p className='select_image_btn'>사진 선택</p>
                                </label>
                            </div>
                            <div className='modal-footer flex' style={{ justifyContent: 'space-between' }}>
                                <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                                    이전
                                </button>
                                <button
                                    type='button'
                                    id='modal_for_post_text_target_btn'
                                    className='btn btn-primary'
                                    data-bs-toggle='modal'
                                    data-bs-target='#modal_for_post_text'
                                    // onClick={selectedFiles[0] === undefined || checkForPostImg}
                                    disabled={selectedFiles[0] === undefined ? true : false}
                                >
                                    다음
                                    {/* <label
                                        htmlFor="modal_for_post_text_target_btn"
                                        onClick={checkForPostImg}
                                        style={{ cursor: 'pointer' }}
                                    ></label> */}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className='modal fade yg_font'
                    id='modal_for_post_text'
                    tabIndex='-1'
                    aria-labelledby='exampleModalLabel'
                    aria-hidden='true'
                >
                    <div className='modal-dialog modal-lg modal-lg-text modal-dialog-centered modal-dialog-scrollable'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h1 className='modal-title fs-5' id='exampleModalLabel'>
                                    새 게시물 작성하기
                                </h1>
                                <button
                                    type='button'
                                    className='btn-close'
                                    data-bs-dismiss='modal'
                                    aria-label='Close'
                                ></button>
                            </div>
                            <div className='flex_for_profile_new_post'>
                                <div className='flex_new_post'>
                                    <div className='profile_img_new_post'>
                                        <img src={user_profile ? user_profile : `/test_imgs/png/profile.png`} />
                                    </div>
                                    <div className='profile_info_new_post'>
                                        <div className='profile_name_new_post'>{user_nickname}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='modal-body mx-auto'>
                                <textarea
                                    className='upload_text nn_font'
                                    placeholder='게시물의 내용을 작성해주세요.'
                                    onChange={handleTextChange}
                                    value={uploadText}
                                ></textarea>
                            </div>
                            <sup className='byte_for_upload '>
                                (<span id='nowByte'>{byteCount}</span>/2200bytes)
                            </sup>
                            <div className='modal-footer flex' style={{ justifyContent: 'space-between' }}>
                                <button
                                    type='button'
                                    className='btn btn-secondary'
                                    data-bs-toggle='modal'
                                    data-bs-target='#modal_for_post_img'
                                >
                                    이전
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-primary'
                                    data-bs-toggle='modal'
                                    data-bs-target='#modal_for_post_text'
                                    disabled={uploadText === '' ? true : false}
                                    onClick={() => registPost()}
                                >
                                    공유하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal END */}
            </div>
        </div>
    );
};

export default Community;
