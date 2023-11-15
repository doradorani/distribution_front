import React from 'react';
import { useKakaoLogin } from '../../js/api/LoginApi';
import '../../css/common/common.css';

const UserAuth = (props) => {
    //받아온 주소의 인가코드를 추출한다.
    const code = new URL(window.location.href).searchParams.get('code');

    // 커스텀 훅 사용
    useKakaoLogin(code);

    return (
        <div className="LoginHandeler" style={{ marginTop: '150px' }}>
            <div className="notice">
                <div style={{ position: 'absolute', width: '440px', left: '50%', transform: 'translate(-50%)' }}>
                    <img
                        src="/test_imgs/loading/img.gif"
                        style={{ width: '100%', height: '50vh', objectFit: 'cover', borderRadius: '30px' }}
                    />
                    <p
                        className="yg_font"
                        style={{ position: 'relative', bottom: '70px', textAlign: 'center', color: '#fff' }}
                    >
                        로그인 중입니다.
                    </p>
                    <p
                        className="yg_font"
                        style={{ position: 'relative', bottom: '80px', textAlign: 'center', color: '#fff' }}
                    >
                        잠시만 기다려주세요.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserAuth;
