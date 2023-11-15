import moment from 'moment';
import adminToken_config from '../config/adminToken_config';
import axios from 'axios';

const RefreshAdmin = async (config) => {
    const server = adminToken_config.server;
    let adminAccessTokenExpired = adminToken_config.adminTokenExpired;

    //토큰 만료 시,
    if (moment(adminAccessTokenExpired).diff(moment()) < 0) {
        try {
            const res = await axios.post(`${server}/admin/newToken`);
            adminToken_config.adminTokenName = res.data.accessToken;
        } catch (error) {
            console.log(error);
        }
    }

    config.headers.Authorization = `Bearer ${adminToken_config.adminTokenName}`;
    return config;
};

export { RefreshAdmin };
