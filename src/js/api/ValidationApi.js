import TokenApi from './TokenApi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { tokenAction } from './redux_store/slice/tokenSlice';
import token_config from './config/token_config';
import moment from 'moment/moment';
import Swal from 'sweetalert2';

export function useValidationUser() {
    const tokenDispatch = useDispatch();
    const navigate = useNavigate();

    return async (method, url, formData, url2) => {
        try {
            let response;
            if (method === 'post') {
                // HTTP 메소드에 따라 다른 Axios 메서드를 호출
                response = await TokenApi.post(url, formData);
                if (url2 !== undefined && url2 !== '') {
                    response = await TokenApi.get(url2);
                }
            } else if (method === 'delete') {
                response = await TokenApi.delete(url);
                if (url2 !== undefined && url2 !== '') {
                    response = await TokenApi.get(url2);
                }
            } else if (method === 'get') {
                response = await TokenApi.get(url);
            } else if (method === 'put') {
                response = await TokenApi.put(url, formData);
                if (url2 !== undefined && url2 !== '') {
                    response = await TokenApi.get(url2);
                }
            } else {
                throw new Error('올바르지 않은 HTTP 메소드');
            }

            //const response = await TokenApi.post(url, formData);

            tokenDispatch(tokenAction.setTokenName(token_config.tokenName));
            tokenDispatch(tokenAction.setTokenExpired(moment().add(2, 'hours').format('yyyy-MM-DD HH:mm:ss')));
            return response.data; // 데이터 반환
        } catch (error) {
            if (error.response.status === 401) {
                Swal.fire({
                    title: '로그인이 필요한 기능입니다.',
                    icon: 'warning',
                });
                navigate('/');
                // throw error;
            } else if (error.response.status === 403) {
                Swal.fire({
                    title: '사용자 전용 기능입니다.',
                    icon: 'warning',
                });
                navigate('/');
                // throw error;
            } else {
                // 다른 오류 처리
                console.error('Error:', error);
                navigate('/');
                // throw error;
            }
        }
    };
}