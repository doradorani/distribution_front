import AdminTokenApi from './AdminTokenApi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import adminToken_config from '../config/adminToken_config';
import moment from 'moment/moment';
import { adminTokenAction } from '../redux_store/slice/adminTokenSlice';
import Swal from 'sweetalert2';

export function useValidationAdminItem() {
    const adminTokenDispatch = useDispatch();
    const navigate = useNavigate();

    const validateAdmin = async (method, url, formData) => {
        try {
            let response;

            // HTTP 메소드에 따라 다른 Axios 메서드를 호출
            if (method === 'post') {
                response = await AdminTokenApi.post(url, formData);
            } else if (method === 'delete') {
                response = await AdminTokenApi.delete(url);
            } else if (method === 'get') {
                response = await AdminTokenApi.get(url);
            } else if (method === 'put') {
                response = await AdminTokenApi.put(url, formData);
            } else {
                throw new Error('올바르지 않은 HTTP 메소드');
            }

            adminTokenDispatch(adminTokenAction.setAdminTokenName(adminToken_config.adminTokenName));
            adminTokenDispatch(
                adminTokenAction.setAdminTokenExpired(moment().add(20, 'seconds').format('yyyy-MM-DD HH:mm:ss'))
            );

            return response.data; // 데이터 반환
        } catch (error) {
            console.log('error ==> ' + error);

            if (error.response.status === 401) {
                Swal.fire({
                    title: '관리자 로그인이 필요한 기능입니다.',
                    icon: 'warning',
                });
                navigate('/admin/sign_in');
                throw error;
            } else if (error.response.status === 403) {
                Swal.fire({
                    title: '관리자 전용 기능입니다.',
                    icon: 'warning',
                });
                navigate('/');
                throw error;
            } else {
                // 다른 오류 처리
                console.error('Error:', error);
                navigate('/admin/sign_in');
                throw error;
            }
        }
    };

    return validateAdmin;
}
