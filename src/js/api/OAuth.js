const CLIENT_ID = process.env.REACT_APP_REST_API_KEY;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL;

//인가코드를 제공해주는 경로 (authorize? 까지는 고정으로 사용된다)
//&redirect_uri=${REDIRECT_URI}&response_type=code 해당 code가 인가코드이다.
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;