import React, { useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';

// 사용하고 싶은 옵션, 나열 되었으면 하는 순서대로 나열
const toolbarOptions = [
    ['link', 'image', 'video'],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ list: 'ordered' }, { list: 'bullet' }],

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['clean'], // remove formatting button
];

// 옵션에 상응하는 포맷, 추가해주지 않으면 text editor에 적용된 스타일을 볼수 없음
export const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'align',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'background',
    'color',
    'link',
    'image',
    'video',
    'width',
];

Quill.register('modules/imageResize', ImageResize);

const modules = {
    toolbar: {
        container: toolbarOptions,
    },
    imageResize: {
        // https://www.npmjs.com/package/quill-image-resize-module-react 참고
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
    },
};

const QuillEditor = ({
    placeholder,
    value,
    noticeContent,
    setNoticeContent,
    editorContent,
    setEditorContent,
    ...rest
}) => {
    // quill 에디터 컴포넌트 ref
    const quillRef = useRef(null);

    useEffect(() => {
        const handleImage = () => {
            // 이미지 핸들 로직
        };

        if (quillRef.current) {
            const { getEditor } = quillRef.current;
            const toolbar = quillRef.current.getEditor().getModule('toolbar');
            toolbar.addHandler('image', handleImage);
        }
    }, []);

    return (
        // 테마 (bubble, snow, custom) https://quilljs.com/docs/themes/
        <ReactQuill
            id="writeNoticeContent"
            style={{ height: '450px', marginBottom: '75px' }}
            {...rest}
            placeholder={placeholder}
            theme="snow"
            modules={modules}
            formats={formats}
            value={editorContent || ''}
            onChange={(e) => setEditorContent(e)}
        ></ReactQuill>
    );
};

export default QuillEditor;
