import React, { useEffect, useRef, useState } from 'react';
import '../../../../css/subpage/detailnotice.css';
import QuillEditor from './QuillEditor';
import { useValidationAdminItem } from '../../../../js/api/admin/ValidationAdminItem';
import { noticeIndexAction } from '../../../../js/api/redux_store/slice/noticeIndexSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const WriteNotice = () => {
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeContent, setNoticeContent] = useState('');
    const [editorContent, setEditorContent] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadFile, setUploadFile] = useState([]);
    const maxFileCount = 5;

    let data;

    const validationAdminForRegistNotice = useValidationAdminItem();
    const getRecentNoticeIndex = useValidationAdminItem();
    const noticeIndexDispatch = useDispatch();
    const nav = useNavigate();

    const addNoticeTitle = (e) => {
        const title = e.target.value;
        setNoticeTitle(title);
    };

    const onUploadFiles = (e) => {
        if (e.target.files) {
            if (uploadFile.length + e.target.files.length > maxFileCount) {
                alert('파일은 최대 5개까지 업로드 가능합니다.');
            } else {
                const newFiles = [...uploadFile, ...e.target.files];
                setUploadFile(newFiles);
            }
        }
    };

    const removeUploadFiles = (index) => {
        const newFiles = [...uploadFile];
        newFiles.splice(index, 1);
        setUploadFile(newFiles);
        console.log(newFiles);
    };

    const registNotice = async () => {
        let formData = new FormData();
        try {
            setIsLoading(true);
            if (noticeTitle === '') {
                Swal.fire({
                    icon: 'warning',
                    title: '제목은 필수입력 사항입니다.\n제목을 입력해주시기 바랍니다.',
                });
                document.getElementById('writeNoticeTitle').focus();
                window.scrollTo({
                    top: document.getElementById('writeNoticeTitle').offsetTop,
                    behavior: 'smooth',
                });
                console.log(editorContent);
            } else if (editorContent === undefined || editorContent === '') {
                Swal.fire({
                    icon: 'warning',
                    title: '공지내용은 필수입력 사항입니다.\n내용을 입력해주시기 바랍니다.',
                });
            } else {
                data = {
                    title: noticeTitle,
                    content: editorContent,
                    uploadFile_cnt: uploadFile.length,
                };
                // upload파일 formData에 담기
                if (uploadFile != null) {
                    for (let i = 0; i < uploadFile.length; i++) {
                        formData.append('files', uploadFile[i]);
                    }
                }
                // data객체 Blob객체 생성 후 formData에 담기
                formData.append(
                    'data',
                    new Blob([JSON.stringify(data)], {
                        type: 'application/json',
                    })
                );

                const registResponse = await validationAdminForRegistNotice('post', '/notice/registNotice', formData);
                console.log(registResponse);

                if (registResponse.code === 200 && registResponse.data === 1) {
                    Swal.fire({
                        icon: 'success',
                        title: '공지사항이 정상적으로 등록되었습니다.',
                    });
                    // alert('공지사항이 정상적으로 등록되었습니다.');
                    // 공지사항 정상 등록 후 게시글 detail페이지로 이동하기 위한 notice.no값 get
                    const recentNoticeIndexResponse = await getRecentNoticeIndex('get', '/notice/recentNotice');
                    noticeIndexDispatch(noticeIndexAction.setNoticeIndexState(recentNoticeIndexResponse.data));
                    nav('/admin/admin_notice_detail');
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="text-center" style={{ marginTop: '250px' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="detail_notice_wrap ">
                    <div className="admin_page_menu_title_wrap" style={{ marginLeft: '20px', marginBottom: '20px' }}>
                        <img src="/test_imgs/svg/pencil.svg" />
                        <div className="admin_page_menu_title yg_font ">공지사항</div>
                        <div className="yg_font admin_page_menu_sub_title"> &#62; 작성하기</div>
                    </div>
                    <div className="detail_notice_content_wrap nn_font">
                        <div className="write_notice_content_box">
                            <div className="">
                                <div className="input-group mb-3 write_notice_title" style={{ margin: '0px' }}>
                                    <span
                                        className="input-group-text"
                                        id="inputGroup-sizing-default"
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        제목
                                    </span>
                                    <input
                                        type="text"
                                        id="writeNoticeTitle"
                                        className="form-control"
                                        aria-label="Sizing example input"
                                        aria-describedby="inputGroup-sizing-default"
                                        placeholder="제목을 입력하세요."
                                        value={noticeTitle || ''}
                                        onChange={addNoticeTitle}
                                    />
                                </div>
                            </div>
                            <div className="write_notice_content">
                                <div className="editor-container">
                                    <QuillEditor
                                        noticeContent={noticeContent}
                                        setNoticeContent={setNoticeContent}
                                        editorContent={editorContent}
                                        setEditorContent={setEditorContent}
                                        value={noticeContent}
                                    />
                                </div>
                            </div>
                            <div className="notice_datail_files flex">
                                <div className="flex" style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    첨부파일
                                </div>
                                <input
                                    id="noticeAttachedFile"
                                    type="file"
                                    accept="application/vnd.ms-excel, 
                                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, 
                                        text/plain, 
                                        image/*, 
                                        text/html, 
                                        audio/*, 
                                        .pdf"
                                    name="file"
                                    style={{ display: 'none' }}
                                    onChange={onUploadFiles}
                                    multiple
                                />
                                <div
                                    className="flex"
                                    style={{
                                        width: '580px',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div style={{ margin: '10px' }}>
                                        {uploadFile.length > 0 ? (
                                            uploadFile.map((file, index) => (
                                                <div key={index}>
                                                    {index + 1}. &nbsp;
                                                    {file.name}
                                                    <button
                                                        style={{
                                                            backgroundColor: '#fff',
                                                            border: 'none',
                                                            color: '#ff0000',
                                                            fontSize: '1.1em',
                                                        }}
                                                        onClick={() => removeUploadFiles(index)}
                                                    >
                                                        &nbsp;&nbsp;&#215;
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div>첨부파일이 없습니다.</div>
                                        )}
                                    </div>
                                    <label
                                        htmlFor="noticeAttachedFile"
                                        type="button"
                                        className="btn btn-light "
                                        style={{
                                            marginTop: '6px',
                                            marginRight: '10px',
                                            fontFamily: 'NanumSquareRound',
                                            width: '100px ',
                                            height: '35px',
                                        }}
                                    >
                                        파일 선택
                                    </label>
                                </div>
                            </div>
                        </div>
                        <img className="detail_notice_pin" src="/test_imgs/png/pin.png" />
                    </div>
                    <div className="d-md-flex justify-content-md-end">
                        <button type="button" className="btn btn-light " onClick={registNotice}>
                            게시하기
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default WriteNotice;
