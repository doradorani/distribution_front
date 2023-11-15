import React, { useEffect, useRef, useState } from 'react';
import '../../../../css/subpage/detailnotice.css';
import QuillEditor from './QuillEditor';
import { useValidationAdminItem } from '../../../../js/api/admin/ValidationAdminItem';
import noticeIndex_config from '../../../../js/api/config/noticeIndex_config';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const ModifyNotice = () => {
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeContent, setNoticeContent] = useState('');
    const [editorContent, setEditorContent] = useState();
    const [uploadFile, setUploadFile] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const maxFileCount = 5;

    let data;

    const validationAdminForRegistNotice = useValidationAdminItem();
    const validationAdminNotice = useValidationAdminItem();
    const nav = useNavigate();

    const [indexZeroFileNameArray, setIndexZeroFileNameArray] = useState([]);
    const [indexOneFileNameArray, setIndexOneFileNameArray] = useState([]);

    useEffect(() => {
        const getDetailNotice = async () => {
            try {
                setIsLoading(true);
                const noticeIndex = noticeIndex_config.noticeIndexState;
                const modifyRequest = 1;

                const detailResponse = await validationAdminNotice(
                    'get',
                    '/notice/noticeDetail/' + noticeIndex + '/' + modifyRequest,
                    null
                );
                setNoticeContent(detailResponse.data);

                const zeroFileName = detailResponse.data[0].file_name;
                const ZeroFileNameArray = zeroFileName ? zeroFileName.split(',') : null;
                const oneFileName = detailResponse.data[1].file_name;
                const OneFileNameArray = oneFileName ? oneFileName.split(',') : null;
                setIndexZeroFileNameArray(ZeroFileNameArray);
                setIndexOneFileNameArray(OneFileNameArray);

                if (detailResponse.data[1].no == noticeIndex) {
                    setEditorContent(detailResponse.data[1].content);
                } else {
                    setEditorContent(detailResponse.data[0].content);
                }
            } catch (error) {
                console.error('Error fetching detailNotice:', error);
            } finally {
                setIsLoading(false);
            }
        };
        getDetailNotice();
    }, []);

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
        console.log('removeUploadFiles() CALLED!!');
        const newFiles = [...uploadFile];
        newFiles.splice(index, 1);
        setUploadFile(newFiles);
        console.log(newFiles);
    };

    const modifyNotice = async () => {
        let formData = new FormData();
        try {
            setIsLoading(true);
            if (noticeTitle === '') {
                alert('\n제목은 필수입력 사항입니다.\n제목을 입력해주시기 바랍니다.');
                document.getElementById('writeNoticeTitle').focus();
                window.scrollTo({
                    top: document.getElementById('writeNoticeTitle').offsetTop,
                    behavior: 'smooth',
                });
                console.log(editorContent);
            } else if (editorContent === undefined) {
                alert('\n공지내용은 필수입력 사항입니다.\n내용을 입력해주시기 바랍니다.');
            } else {
                data = {
                    title: noticeTitle,
                    content: editorContent,
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
                    alert('공지사항이 정상적으로 등록되었습니다.');
                    // 공지사항 정상 등록 후 게시글 detail페이지로 이동하기 위한 notice.no값 get
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
            <div className="detail_notice_wrap nn_font">
                <div className="admin_page_menu_title_wrap" style={{ marginLeft: '20px', marginBottom: '20px' }}>
                    <img src="/test_imgs/svg/pencil.svg" />
                    <div className="admin_page_menu_title yg_font ">공지사항</div>
                    <div className="yg_font admin_page_menu_sub_title"> &#62; 수정하기</div>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    noticeContent &&
                    (noticeContent[1] && noticeContent[1].no === noticeIndex_config.noticeIndexState ? (
                        <div className="detail_notice_content_wrap">
                            <div className="detail_notice_content_box">
                                <div className="notice_info_wrap">
                                    <div>
                                        <span>No.</span>
                                        <span>{noticeContent[1].no}</span>
                                    </div>
                                    <div>
                                        <span>작성일</span>
                                        <span>{noticeContent[1].reg_date.substring(0, 10)}</span>
                                        <span>|</span>
                                        <span>수정일</span>
                                        <span>{noticeContent[1].mod_date.substring(0, 10)}</span>
                                        <span>|</span>
                                        <span>작성자</span>
                                        <span>{noticeContent[1].admin_id}</span>
                                        <span>|</span>
                                        <span>조회수</span>
                                        <span>{noticeContent[1].hit}</span>
                                    </div>
                                </div>
                                <div className="input-group mb-3 write_notice_title" style={{ paddingTop: '5px' }}>
                                    <span
                                        className="input-group-text"
                                        id="inputGroup-sizing-default"
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        제목
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        aria-label="Sizing example input"
                                        aria-describedby="inputGroup-sizing-default"
                                        placeholder="제목을 입력하세요."
                                        onChange={addNoticeTitle}
                                        defaultValue={noticeContent[1].title || ''}
                                    />
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
                                            {indexOneFileNameArray ? (
                                                indexOneFileNameArray.map((file_name, index) => (
                                                    <div key={index}>
                                                        <a href="">{file_name}</a>
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
                                            {/* {indexZeroFileNameArray.length > 0 ? (
                                                indexZeroFileNameArray.map((file_name, index) => (
                                                    <div key={index}>
                                                        <a href="">{file_name}</a>
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
                                            )} */}
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
                    ) : (
                        <div className="detail_notice_content_wrap">
                            <div className="detail_notice_content_box">
                                <div className="notice_info_wrap">
                                    <div>
                                        <span>No.</span>
                                        <span>{noticeContent[0].no}</span>
                                    </div>
                                    <div>
                                        <span>작성일</span>
                                        <span>{noticeContent[0].reg_date.substring(0, 10)}</span>
                                        <span>|</span>
                                        <span>수정일</span>
                                        <span>{noticeContent[0].mod_date.substring(0, 10)}</span>
                                        <span>|</span>
                                        <span>작성자</span>
                                        <span>{noticeContent[0].admin_id}</span>
                                        <span>|</span>
                                        <span>조회수</span>
                                        <span>{noticeContent[0].hit}</span>
                                    </div>
                                </div>
                                <div className="input-group mb-3 write_notice_title" style={{ paddingTop: '5px' }}>
                                    <span
                                        className="input-group-text"
                                        id="inputGroup-sizing-default"
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        제목
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        aria-label="Sizing example input"
                                        aria-describedby="inputGroup-sizing-default"
                                        placeholder="제목을 입력하세요."
                                        onChange={addNoticeTitle}
                                        defaultValue={noticeContent[0].title || ''}
                                    />
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
                                            {indexZeroFileNameArray ? (
                                                indexZeroFileNameArray.map((file_name, index) => (
                                                    <div key={index}>
                                                        <a href="">{file_name}</a>
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
                    ))
                )}

                <div className="d-md-flex justify-content-md-end">
                    <button type="button" className="btn btn-light mr-3" onClick={() => modifyNotice()}>
                        수정하기
                    </button>
                    <Link to="/admin/admin_notice">
                        <button type="button" className="btn btn-light ">
                            목록보기
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ModifyNotice;
