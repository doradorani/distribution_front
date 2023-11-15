import React from 'react';

const DiaryHeader = ({ select, src }) => {
    return (
        <>
            <div className=" flex yg_font" style={{ marginLeft: 0, marginBottom: '30px' }}>
                <img src={src} style={{ width: '55px', marginRight: '15px' }} />
                <div style={{ fontSize: '40px', marginRight: '15px' }}>육아 일기</div>
                <div style={{ fontSize: '20px', display: 'flex', alignItems: 'flex-end', marginBottom: '10px' }}>
                    &#62;&nbsp;{select}
                </div>
            </div>
        </>
    );
};

export default DiaryHeader;
