import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const LoadingPostCard = () => {
    return (
        <>
            <div
                className="card"
                aria-hidden="true"
                style={{
                    marginTop: '30px',
                    width: '730px',
                    backgroundColor: ' #f5f5f8',
                    border: 'none',
                    borderRadius: '25px',
                }}
            >
                <div className="flex" style={{ marginTop: '30px', marginLeft: '30px' }}>
                    <div
                        className="spinner-grow"
                        style={{ width: '3rem', height: '3rem', marginRight: '15px' }}
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div style={{ width: '100px' }}>
                        <p className="placeholder-glow" style={{ margin: '0px', height: '20px', marginTop: '1px' }}>
                            <span className="placeholder col-12 placeholder-sm"></span>
                        </p>
                        <p className="placeholder-glow" style={{ margin: '0px' }}>
                            <span className="placeholder col-6 placeholder-xs"></span>
                        </p>
                    </div>
                </div>
                <div className="card-body " style={{ margin: '0 auto', width: '670px' }}>
                    <h5 className="card-title placeholder-glow">
                        <span className="placeholder col-12"></span>
                    </h5>
                    <h5 className="card-title placeholder-glow flex" style={{ justifyContent: 'space-between' }}>
                        <div style={{ width: '410px' }}>
                            <span className="placeholder col-12"></span>
                        </div>
                        <div style={{ width: '220px' }}>
                            <span className="placeholder col-12"></span>
                        </div>
                    </h5>
                    <h5 className="card-title placeholder-glow flex" style={{ justifyContent: 'space-between' }}>
                        <div style={{ width: '150px' }}>
                            <span className="placeholder col-12"></span>
                        </div>
                        <div style={{ width: '480px' }}>
                            <span className="placeholder col-12"></span>
                        </div>
                    </h5>
                    <h5 className="card-title placeholder-glow flex" style={{ justifyContent: 'space-between' }}>
                        <div style={{ width: '350px' }}>
                            <span className="placeholder col-12"></span>
                        </div>
                    </h5>
                    <h5 className="card-title placeholder-glow flex" style={{ justifyContent: 'space-between' }}>
                        <div style={{ width: '100px', marginTop: '20px' }}>
                            <span className="placeholder col-12 placeholder-sm"></span>
                        </div>
                    </h5>

                    <button
                        className="btn flex"
                        type="button"
                        disabled
                        style={{
                            marginTop: '30px',
                            width: '640px',
                            height: '440px',
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
                            style={{ width: '8rem', height: '8rem', marginBottom: '30px' }}
                        ></span>
                        <span role="status" style={{ fontSize: '3.0em' }}>
                            이미지 로딩 중...
                        </span>
                    </button>
                    <div className="flex">
                        <div
                            className="card-title placeholder-glow flex"
                            style={{
                                height: '40px',
                                marginTop: '25px',
                                marginRight: '15px',
                                alignItems: 'center',
                                border: '1px solid #D0D0D4',
                                paddingLeft: '10px',
                                paddingRight: '10px',
                                borderRadius: '25px',
                            }}
                        >
                            <span
                                className="spinner-grow spinner-grow-sm"
                                aria-hidden="true"
                                style={{ width: '1.5rem', height: '1.5rem', marginRight: '5px' }}
                            ></span>
                            <div style={{ width: '30px' }}>
                                <span className="placeholder col-12 placeholder-xs"></span>
                            </div>
                        </div>
                        <div
                            className="card-title placeholder-glow flex"
                            style={{
                                height: '40px',
                                marginTop: '25px',
                                marginRight: '15px',
                                alignItems: 'center',
                                border: '1px solid #D0D0D4',
                                paddingLeft: '10px',
                                paddingRight: '10px',
                                borderRadius: '25px',
                            }}
                        >
                            <span
                                className="spinner-grow spinner-grow-sm"
                                aria-hidden="true"
                                style={{ width: '1.5rem', height: '1.5rem', marginRight: '5px' }}
                            ></span>
                            <div style={{ width: '30px' }}>
                                <span className="placeholder col-12 placeholder-xs"></span>
                            </div>
                        </div>
                        <div
                            className="card-title placeholder-glow flex"
                            style={{
                                height: '40px',
                                marginTop: '25px',
                                marginRight: '15px',
                                alignItems: 'center',
                                border: '1px solid #D0D0D4',
                                paddingLeft: '10px',
                                paddingRight: '10px',
                                borderRadius: '25px',
                            }}
                        >
                            <span
                                className="spinner-grow spinner-grow-sm"
                                aria-hidden="true"
                                style={{ width: '1.5rem', height: '1.5rem', marginRight: '5px' }}
                            ></span>
                            <div style={{ width: '30px' }}>
                                <span className="placeholder col-12 placeholder-xs"></span>
                            </div>
                        </div>
                    </div>
                    <h5 className="card-title placeholder-glow flex" style={{ justifyContent: 'space-between' }}>
                        <div style={{ width: '100px', marginTop: '20px', marginBottom: '15px' }}>
                            <span className="placeholder col-12 placeholder-sm"></span>
                        </div>
                    </h5>
                </div>
            </div>
        </>
    );
};

export default LoadingPostCard;
