import moment from 'moment';
import token_config from './config/token_config';
import axios from 'axios';

const Refresh = async (config) => {
    const server = token_config.server;
    let accessTokenExpired = token_config.tokenExpired;

    //토큰 만료 시,
    if (moment(accessTokenExpired).diff(moment()) < 0) {
        try {
            const res = await axios.post(`${server}/user/newToken`);
            token_config.tokenName = res.data.accessToken;
        } catch (error) {
            console.log(error);
        }
    }
    config.headers.Authorization = `Bearer ${token_config.tokenName}`;

    return config;
};

export { Refresh };
