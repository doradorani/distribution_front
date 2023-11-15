import { event } from 'jquery';
import React, { useEffect, useState } from 'react';
import { useValidationAdminItem } from '../../../../js/api/admin/ValidationAdminItem';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const RegistProduct = () => {
    const [productImg, setProductImg] = useState([]);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [minParticipants, setMinParticipants] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productStart, setProductStart] = useState('');
    const [productEnd, setProductEnd] = useState('');
    const [productOptions, setProductOptions] = useState([]);

    const [images, setImages] = useState([]);
    const [optionCount, setOptionCount] = useState(1);
    const optionInputs = [];
    const maxOptions = 5;
    const maxImgCount = 5;

    const validateRegistProduct = useValidationAdminItem(); // 커스텀 Hook 사용
    const navigate = useNavigate();

    // 옵션 추가 버튼 handler
    const handleAddOption = () => {
        if (optionCount < maxOptions) {
            setOptionCount(optionCount + 1);
        } else {
            alert('최대 5개의 옵션을 입력할 수 있습니다.');
        }
    };

    // 옵션 삭제 버튼 handler
    const handleRemoveOption = (index) => {
        if (optionCount > 1) {
            const newOptions = [...productOptions];
            newOptions.pop(); // 마지막 옵션 제거
            setProductOptions(newOptions);

            setOptionCount(optionCount - 1);
        }
    };

    const handleImageChange = (e) => {
        const selectedFiles = e.target.files;
        const newImages = [...images];

        for (let i = 0; i < selectedFiles.length; i++) {
            const selectedFile = selectedFiles[i];

            setProductImg((prevProductImg) => [...prevProductImg, selectedFile]);

            if (newImages.length + i >= maxImgCount) {
                // 이미 5개의 사진을 선택했거나 더 많이 선택했으므로 추가하지 않음
                //console.log(newImages);
                alert('이미지는 최대 5개까지 업로드 가능합니다.');
                break;
            }

            const reader = new FileReader();

            reader.onload = (event) => {
                newImages.push(event.target.result);
                if (newImages.length === newImages.length + i) {
                    setImages(newImages);
                    //console.log(newImages);
                }
            };

            reader.readAsDataURL(selectedFile);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
        //console.log(newImages);

        const imageList = [...productImg];
        imageList.splice(index, 1);
        setProductImg(imageList);
    };

    const uploadProductHandler = () => {
        if (!productName) alert('상품 이름을 기재하여야 합니다.');
        else if (!productDescription) alert('제품 상세 정보을 기재하여야 합니다.');
        else if (!minParticipants) alert('최소 인원을 기재하여야 합니다.');
        else if (!productPrice) alert('상품 가격을 기재하여야 합니다.');
        else if (!productStart) alert('개시 날짜을 기재하여야 합니다.');
        else if (!productEnd) alert('마감 날짜을 기재하여야 합니다.');
        else if (productStart > productEnd) alert('마감 날짜는 개시 날짜보다 빠를 수 없습니다.');
        else if (!productOptions || productOptions.length === 0) alert('상품 옵션을 최소 1개 이상 기재하여야 합니다.');
        else if (!productImg || productImg.length === 0) alert('상품 이미지를 최소 1개 이상 기재하여야 합니다.');
        else {
            const registProductInfo = {
                productName: productName,
                productDescription: productDescription,
                minParticipants: minParticipants,
                productPrice: productPrice,
                productStart: productStart,
                productEnd: productEnd,
                productOptions: productOptions,
            };
            let registProductData = new FormData();

            for (let i = 0; i < productImg.length; i++) {
                registProductData.append('files', productImg[i]);
            }

            registProductData.append(
                'info',
                new Blob([JSON.stringify(registProductInfo)], { type: 'application/json' })
            );

            try {
                validateRegistProduct('post', '/coBuy/admin/register', registProductData).then((res) => {
                    if (res.success) {
                        alert('상품 등록에 성공하였습니다..');
                        navigate('/admin/co-buying_list');
                    } else {
                        alert('상품 등록 중 서버에 문제가 생겨 실패하였습니다.');
                    }
                });
            } catch (error) {
                console.log(error);
                alert('상품 등록 중 서버에 문제가 생겨 실패하였습니다.');
            }
        }
    };

    const handleChangeOption = (index, value) => {
        const updatedOptions = [...productOptions];
        updatedOptions[index] = value;
        setProductOptions(updatedOptions);
    };

    for (let i = 1; i < optionCount; i++) {
        optionInputs.push(
            <div key={i} className="flex">
                <div className="input-group mb-3 flex">
                    <span
                        className="input-group-text"
                        id="basic-addon1"
                        style={{ width: '120px', justifyContent: 'center' }}
                    >
                        상품 옵션 {i + 1}
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder={`상품옵션 ${i + 1} 입력`}
                        aria-label={`Recipient's option ${i + 1}`}
                        aria-describedby="button-addon2"
                        onChange={(e) => handleChangeOption(i, e.target.value)}
                    />
                    {i === optionCount - 1 && (
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                            onClick={handleRemoveOption}
                        >
                            &#10006;
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="admin_authorization_wrap">
                <div className="admin_page_menu_title_wrap">
                    <img src="/test_imgs/svg/shopping_cart.svg" />
                    <div className="admin_page_menu_title yg_font ">공동 구매</div>
                    <div className="yg_font admin_page_menu_sub_title">&#62; 제품 등록</div>
                </div>
                <div className="flex" style={{ justifyContent: 'space-evenly' }}>
                    {/* <div style={{ borderRight: '1px solid #dadada' }}> */}
                    <div>
                        <div className="flex " style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                            <input
                                id="imageInput"
                                type="file"
                                accept="image/*"
                                name="file"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                                multiple
                            />
                            <label htmlFor="imageInput" className="btn btn_user_modify_cancel mb-3">
                                사진 추가
                            </label>
                            <div
                                className="nn_font mb-2 flex"
                                style={{
                                    marginRight: '10px',
                                    flexDirection: 'column',
                                }}
                            >
                                <p className="mb-0">최대 5개까지 이미지를 업로드할 수 있습니다.</p>
                                <p>첫 번째 이미지가 프로필 이미지로 설정됩니다.</p>
                            </div>
                            {images.length > 0 ? (
                                images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="flex mb-4"
                                        style={{
                                            width: '550px',
                                            height: '400px',
                                            borderRadius: '30px',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <img
                                            className="mb-1"
                                            src={image}
                                            style={{
                                                width: '550px',
                                                height: '400px',
                                                objectFit: 'cover',
                                                borderRadius: '30px',
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            style={{ position: 'absolute', right: '20px', top: '20px' }}
                                            onClick={() => removeImage(index)}
                                        ></button>
                                    </div>
                                ))
                            ) : (
                                <label
                                    htmlFor="imageInput"
                                    className="flex mb-4 upload upload_img_label"
                                    style={{
                                        width: '550px',
                                        height: '400px',
                                        backgroundColor: '#EFF0F3',
                                        borderRadius: '30px',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {images.map((image, index) => (
                                        <div key={index}>
                                            <img
                                                className="mb-1"
                                                src={image}
                                                style={{
                                                    width: '550px',
                                                    height: '400px',
                                                    objectFit: 'cover',
                                                    borderRadius: '30px',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn-close"
                                                aria-label="Close"
                                                style={{ position: 'absolute', right: '20px', top: '20px' }}
                                                onClick={() => removeImage(index)}
                                            ></button>
                                        </div>
                                    ))}
                                    <img
                                        className="mb-2"
                                        src="/test_imgs/png/image.png"
                                        style={{ width: '200px', paddingTop: '10px' }}
                                    />
                                    <div className="yg_font" style={{ fontSize: '1.5em' }}>
                                        사진 업로드
                                        <p style={{ fontSize: '0.6em' }}>
                                            업로드되는 이미지는 550px &#10006; 400px로 잘릴 수 있습니다.
                                        </p>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>
                    <div className="nn_font" style={{ width: '40%' }}>
                        <div className="input-group mb-3">
                            <span
                                className="input-group-text flex"
                                style={{ width: '120px', justifyContent: 'center' }}
                            >
                                상품명
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="상품명 입력"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>
                        <div className="input-group mb-3" style={{ height: '200px' }}>
                            <span
                                className="input-group-text flex"
                                style={{ width: '120px', justifyContent: 'center' }}
                            >
                                제품
                                <br />
                                상세 정보
                            </span>
                            <textarea
                                className="form-control"
                                placeholder="제품 상세 정보 입력"
                                aria-label="With textarea"
                                style={{ height: '200px', resize: 'none' }}
                                onChange={(e) => setProductDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="input-group mb-3">
                            <span
                                className="input-group-text flex"
                                id="basic-addon1"
                                style={{ width: '120px', justifyContent: 'center' }}
                            >
                                최소인원
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="구매확정 최소인원을 입력"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                onChange={(e) => setMinParticipants(e.target.value)}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <span
                                className="input-group-text flex"
                                id="basic-addon1"
                                style={{ width: '120px', justifyContent: 'center' }}
                            >
                                상품가격
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="상품가격 입력"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                onChange={(e) => setProductPrice(e.target.value)}
                            />
                        </div>

                        <div className="input-group mb-3">
                            <span
                                className="input-group-text flex"
                                id="basic-addon1"
                                style={{ width: '120px', justifyContent: 'center' }}
                            >
                                개시 날짜
                            </span>
                            <input
                                type="date"
                                className="form-control"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                onChange={(e) => setProductStart(e.target.value)}
                            />
                        </div>

                        <div className="input-group mb-3">
                            <span
                                className="input-group-text flex"
                                id="basic-addon1"
                                style={{ width: '120px', justifyContent: 'center' }}
                            >
                                마감 날짜
                            </span>
                            <input
                                type="date"
                                className="form-control"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                onChange={(e) => setProductEnd(e.target.value)}
                            />
                        </div>

                        <div className="flex">
                            <div className="input-group mb-3 flex">
                                <span
                                    className="input-group-text"
                                    id="basic-addon1"
                                    style={{ width: '120px', justifyContent: 'center' }}
                                >
                                    상품 옵션 1
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="상품옵션 입력"
                                    aria-label="Recipient's username"
                                    aria-describedby="button-addon2"
                                    // onChange={(e) => setProductOptions([...productOptions, e.target.value])}
                                    onChange={(e) => handleChangeOption(0, e.target.value)}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    id="button-addon2"
                                    onClick={handleAddOption}
                                >
                                    &#10010;
                                </button>
                            </div>
                        </div>
                        {optionInputs}
                        <div className="flex" style={{ justifyContent: 'center' }}>
                            <button
                                className="btn btn_user_modify_cancel mb-3"
                                type="button"
                                style={{ width: '30%', height: '50px', fontSize: '1.3em' }}
                                onClick={uploadProductHandler}
                            >
                                상품 등록
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegistProduct;
