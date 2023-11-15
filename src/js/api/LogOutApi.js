import axios from 'axios';
import { userCobuyAction } from '../api/redux_store/slice/userCobuySlice';
import { userStateAction } from '../api/redux_store/slice/userLoginSlice';
import { userInfoAction } from '../api/redux_store/slice/userInfoSlice';
import { tokenAction } from '../api/redux_store/slice/tokenSlice';
import Swal from 'sweetalert2'; // Import SweetAlert2
import token_config from './config/token_config';

const LogOutApi = async ({ navigate, dataDispatch }) => {
    const server = token_config.server;

    // Show a confirmation dialog using Swal.fire
    const confirmLogout = await Swal.fire({
        title: '로그아웃 확인',
        text: '정말 로그아웃 하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '로그아웃',
        cancelButtonText: '취소',
    });

    if (confirmLogout.isConfirmed) {
        try {
            await axios.post(`${server}/user/logOut`);
            dataDispatch(tokenAction.setTokenName(''));
            dataDispatch(tokenAction.setTokenExpired(''));
            dataDispatch(userStateAction.setState(false));
            dataDispatch(
                userInfoAction.setUserInfo({
                    userProfile: '',
                    userName: '',
                    userNickname: '',
                    userEmail: '',
                    userPhone: '',
                    userZipcode: '',
                    userAddress: '',
                    userDetailAddress: '',
                })
            );
            dataDispatch(userCobuyAction.setFund([]));
            dataDispatch(userCobuyAction.setHit([]));

            Swal.fire('로그아웃 성공', '로그아웃에 성공하였습니다.', 'success');
            navigate('/');
        } catch (error) {
            console.log('에러 : ' + error);
        }
    }
};

export default LogOutApi;
