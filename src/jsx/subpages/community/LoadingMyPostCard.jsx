import React from 'react';

const LoadingMyPostCard = () => {
    return (
        <button
            className="btn flex"
            type="button"
            disabled
            style={{
                marginTop: '30px',
                width: '310px',
                height: '240px',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '30px',
                backgroundColor: '#D3D4D5',
                border: 'none',
            }}
        >
            <span
                className="spinner-grow spinner-grow-sm"
                aria-hidden="true"
                style={{ width: '6rem', height: '6rem', marginBottom: '20px' }}
            ></span>
            <span role="status" style={{ fontSize: '2.0em' }}>
                이미지 로딩 중...
            </span>
        </button>
    );
};

export default LoadingMyPostCard;
